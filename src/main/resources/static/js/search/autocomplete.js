// autocomplete 제어
import { getMapInstance } from '../store/map-store.js';
import { cacheElement, bindEvent } from '../ui/dom-elements.js';

export async function initAutocomplete(inputId = 'searchInput', resultsId = 'results', suggestionId = 'suggestion') {
  const { AutocompleteSessionToken, AutocompleteSuggestion } = await google.maps.importLibrary('places');
  const map = getMapInstance();
  const token = new AutocompleteSessionToken();
  const input = cacheElement('searchInput', `#${inputId}`);
  const results = cacheElement('results', `#${resultsId}`);
  const suggestion = cacheElement('suggestion', `#${suggestionId}`);

  let selectedIndex = -1;
  let lastInput = '';

  const updateSuggestions = async () => {
    const inputText = input.value.trim();
    if (!inputText) {
      suggestion.style.display = 'none';
      results.innerHTML = '';
      return;
    }

    const request = {
      input: inputText,
      language: 'ko',
      region: 'kr',
      origin: map.getCenter(),
      sessionToken: token,
    };

    const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
    results.innerHTML = '';
    suggestion.style.display = suggestions.length ? 'inline' : 'none';

    suggestions.forEach(s => {
      const li = document.createElement('li');
      li.textContent = s.placePrediction.text.toString();
      const button = document.createElement('button');
      button.style.border = 'none';
      button.style.backgroundColor = 'transparent';
      button.appendChild(li);
      results.appendChild(button);
    });
  };

  const handleKeydown = event => {
    const items = results.querySelectorAll('button');
    if (!items.length) return;

    const currentInput = input.value.trim();
    if (lastInput !== currentInput) {
      selectedIndex = -1;
    }
    if (event.isComposing) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
    } else if (event.key === 'Enter' && selectedIndex >= 0) {
      event.preventDefault();
      input.value = items[selectedIndex].textContent;
      results.innerHTML = '';
      suggestion.style.display = 'none';
      selectedIndex = -1;
    } else if (event.key === 'Enter' && selectedIndex < 0) {
      event.preventDefault();
      cacheElement('searchButton', '#searchButton').click();
    }

    items.forEach((item, index) => {
      item.style.backgroundColor = index === selectedIndex ? 'rgb(36,36,36)' : 'transparent';
    });
  };

  const handleSelection = event => {
    if (event.target.tagName === 'LI') {
      input.value = event.target.textContent;
      suggestion.style.display = 'none';
      selectedIndex = -1;
    }
  };

  const handleEmptyInput = () => {
    if (!input.value.trim()) {
      suggestion.style.display = 'none';
      results.innerHTML = '';
    }
    lastInput = input.value.trim();
  };

  const handleOutsideClick = event => {
    if (event.target !== input && !results.contains(event.target)) {
      suggestion.style.display = 'none';
    }
  };

  bindEvent('searchInput', 'input', updateSuggestions);
  bindEvent('searchInput', 'keydown', handleKeydown);
  bindEvent('searchInput', 'keyup', handleEmptyInput);
  bindEvent('results', 'click', handleSelection);
  document.addEventListener('click', handleOutsideClick);

  return () => {
    document.removeEventListener('click', handleOutsideClick);
  };
}