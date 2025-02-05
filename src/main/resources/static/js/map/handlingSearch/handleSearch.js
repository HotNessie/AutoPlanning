import { searchInput, resultsElement, suggestion } from '../dom-elements.js';
import { selectSuggestion, handleEmptyInput, handleSelection } from './selectSuggestionEvent.js';

export async function handleSearch(AutocompleteSuggestion, token, map) {
    const inputText = searchInput.value.trim();
    // const resultsElement = document.getElementById("results");
    // const suggestion = document.getElementById("suggestion");

    if (inputText === "") {
        suggestion.style.display = "none";
        return;
    }

    let request = {
        input: inputText,  // 사용자 입력 값
        language: 'ko',
        region: 'kr',
        origin: map.getCenter(),
        sessionToken: token
    };

    const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

    // 기존 리스트 초기화
    resultsElement.innerHTML = "";

    suggestion.style.display = "inline";
    if (!suggestions || suggestions.length === 0) {
        suggestion.style.display = "none";
    }

    for (let suggestion of suggestions) {
        const placePrediction = suggestion.placePrediction;
        // 리스트 요소 생성 및 추가
        const listItem = document.createElement("li");
        const listItemButton = document.createElement("button");
        listItemButton.style.border = "none"
        listItemButton.style.backgroundColor = "transparent"
        listItem.textContent = placePrediction.text.toString();
        resultsElement.appendChild(listItemButton);
        listItemButton.appendChild(listItem);
    }

    //자동완성 텍스트 선택 이벤트
    // searchInput.addEventListener("keydown", selectSuggestion);
    // searchInput.addEventListener("keyup", handleEmptyInput);

    // 클릭하면 검색창에 반영
    resultsElement.addEventListener("click", handleSelection);

    //TODO: 리스트 혹은 검색버튼 눌렀을 때, 세션 재발급 시켜줘야 함
}
