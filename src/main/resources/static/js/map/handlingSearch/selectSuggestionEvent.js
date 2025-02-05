import { searchInput, resultsElement, suggestion } from '../dom-elements.js';

let selectedIndex = -1; // 현재 선택된 추천 검색어의 인덱스
let searchInputPast;

export function selectSuggestion(event) {
    const items = document.querySelectorAll("#results button"); // 모든 추천 버튼 가져오기
    if (items.length === 0) return;
    let searchInputCurrent = searchInput.value.trim();
    if (searchInputPast !== searchInputCurrent) {
        selectedIndex = -1; //입력값 변동 감지시 리셋
    }
    if (event.isComposing) return;

    if (event.key === "ArrowDown") {
        event.preventDefault();
        if (selectedIndex < items.length - 1) {
            selectedIndex = (selectedIndex + 1); // 다음 항목 선택
        } else if (selectedIndex === items.length - 1) {
            selectedIndex = -1;
        }
        console.log(selectedIndex);

    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (selectedIndex === -1) {
            selectedIndex = items.length - 1;
        } else if (selectedIndex > -2 || selectedIndex < items.length) {
            selectedIndex = (selectedIndex - 1); // 이전 항목 선택
        }
        console.log(selectedIndex);

    } else if (event.key === "Enter" && selectedIndex >= 0) {
        event.preventDefault();
        // items[selectedIndex].click(); // 선택된 항목 클릭
        searchInput.value = items[selectedIndex].textContent; // 선택된 추천어 입력창에 반영
        resultsElement.innerHTML = ""; // 추천 목록 제거
        suggestion.style.display = "none";
        selectedIndex = -1; // 선택 초기화
    }
    //focuse 효과
    items.forEach((item, index) => {
        if (index === selectedIndex) {
            item.style.backgroundColor = "rgb(36,36,36)";
        } else {
            item.style.backgroundColor = "transparent";
        }
    });
}

//input이 비어있으면 display = none
export async function handleEmptyInput() {
    const resultsElement = document.getElementById("results");
    const suggestion = document.getElementById("suggestion");
    if (searchInput.value.trim() === "") {
        suggestion.style.display = "none";
        resultsElement.innerHTML = "";
    }
    searchInputPast = searchInput.value.trim();
}


//추천 검색어 이벤트
export function handleSelection(event) {
    if (event.target.tagName === "LI") {
        searchInput.value = event.target.textContent;
        suggestion.style.display = "none";
        selectedIndex = -1; // 선택 초기화
    }
};