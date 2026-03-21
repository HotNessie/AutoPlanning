// autocomplete 제어
import { getMapInstance } from '../core/store.js';

export async function initAutocomplete(inputId = 'searchInput', resultsId = 'results', suggestionId = 'suggestion', onSelect = null) {
  const { AutocompleteSessionToken, AutocompleteSuggestion } = await google.maps.importLibrary('places');
  const map = getMapInstance();
  
  // 세션 토큰 초기화
  let token = new AutocompleteSessionToken();
  
  // 직접 DOM 요소 참조
  const input = document.getElementById(inputId);
  const results = document.getElementById(resultsId);
  const suggestion = document.getElementById(suggestionId);

  if (!input || !results || !suggestion) {
    console.warn('Autocomplete elements not found:', { inputId, resultsId, suggestionId });
    return () => {};
  }

  let selectedIndex = -1;
  let lastInput = '';
  let debounceTimer;

  const fetchSuggestions = async (inputText) => {
    const request = {
      input: inputText,
      language: 'ko',
      region: 'kr',
      origin: map ? map.getCenter() : null,
      sessionToken: token,
    };

    try {
      const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      results.innerHTML = '';
      suggestion.style.display = suggestions.length ? 'inline' : 'none';

      suggestions.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s.placePrediction.text.toString();
        const button = document.createElement('button');
        button.style.border = 'none';
        button.style.backgroundColor = 'transparent';
        button.dataset.placeId = s.placePrediction.placeId; // placeId 저장
        button.appendChild(li);
        results.appendChild(button);
      });
    } catch (error) {
      console.error("Autocomplete fetch error:", error);
    }
  };

  const onInput = () => {
    const inputText = input.value.trim();
    if (!inputText) {
      suggestion.style.display = 'none';
      results.innerHTML = '';
      return;
    }
    if (inputText.length < 2) return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchSuggestions(inputText);
    }, 300);
  };

  const refreshSession = () => {
    token = new AutocompleteSessionToken();
  };

  const handleKeydown = event => {
    const items = results.querySelectorAll('button');
    
    // 한글 입력 중(IME 조합 중)일 때는 엔터 키 동작을 브라우저에 맡김
    if (event.isComposing) return;

    if (!items.length) {
      if (event.key === 'Enter') {
        const searchBtn = document.getElementById('searchButton');
        if (searchBtn) searchBtn.click();
        refreshSession();
      }
      return;
    }

    if (lastInput !== input.value.trim()) selectedIndex = -1;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
    } else if (event.key === 'Enter') {
      event.preventDefault(); // 기본 엔터 동작 방지
      if (selectedIndex >= 0) {
        const selectedItem = items[selectedIndex];
        input.value = selectedItem.textContent;
        
        if (onSelect) {
          onSelect(selectedItem.dataset.placeId, selectedItem.textContent);
        }
        
        results.innerHTML = '';
        suggestion.style.display = 'none';
        selectedIndex = -1;
      } else {
        // 선택된 항목이 없으면 바로 검색 실행
        const searchBtn = document.getElementById('searchButton');
        if (searchBtn) searchBtn.click();
      }
      refreshSession();
    }

    items.forEach((item, index) => {
      item.style.backgroundColor = index === selectedIndex ? 'rgb(36,36,36)' : 'transparent';
    });
  };

  const handleSelection = event => {
    const target = event.target.closest('button');
    if (target) {
      input.value = target.textContent;
      
      // 콜백 실행
      if (onSelect) {
        onSelect(target.dataset.placeId, target.textContent);
      }
      
      suggestion.style.display = 'none';
      results.innerHTML = '';
      selectedIndex = -1;
      refreshSession();
    }
  };

  const handleKeyUp = () => {
    if (!input.value.trim()) {
      suggestion.style.display = 'none';
      results.innerHTML = '';
    }
    lastInput = input.value.trim();
  };

  const handleOutsideClick = (event) => {
    if (event.target !== input && !results.contains(event.target)) {
      suggestion.style.display = 'none';
    }
  };

  // 표준 addEventListener 사용
  input.addEventListener('input', onInput);
  input.addEventListener('keydown', handleKeydown);
  input.addEventListener('keyup', handleKeyUp);
  results.addEventListener('click', handleSelection);
  document.addEventListener('click', handleOutsideClick);

  // cleanup 함수 반환
  return () => {
    input.removeEventListener('input', onInput);
    input.removeEventListener('keydown', handleKeydown);
    input.removeEventListener('keyup', handleKeyUp);
    results.removeEventListener('click', handleSelection);
    document.removeEventListener('click', handleOutsideClick);
  };
}
