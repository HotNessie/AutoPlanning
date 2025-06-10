import { elements } from './dom-elements.js';
import { cleanupFunctions } from '../main.js';

export function initUIState() {
  // 공통 UI 요소 캐싱
  const content = elements.content;
  const rightArrow = elements.rightArrow;
  const leftArrow = elements.leftArrow;
  const autocomplete = elements.autocomplete;
  const collapseButton = elements.collapseButton;
  const collapseBody = elements.collapseBody;

  // collapseButton 이벤트 바인딩
  collapseButton.addEventListener('click', () => { toggleContent(); console.log("collapseButton 클릭"); });
}

//content 상태 초기화
//content 상태 초기화
//content 상태 초기화
export function resetUIState(isSelfContent = false) {
  const content = elements.content;
  const rightArrow = elements.rightArrow;
  const leftArrow = elements.leftArrow;
  const autocomplete = elements.autocomplete;
  const collapseButton = elements.collapseButton;
  const searchResultsContainer = document.querySelector('#searchResultsContainer');

  if (!content) return;

  // 기본 상태 설정 content 순겨짐 상태
  content.classList.remove('hide');
  rightArrow.style.display = 'none';
  leftArrow.style.display = 'inline';
  collapseButton.style.left = '100%';
  collapseButton.classList.remove('expanded');

  if (isSelfContent) { // selfContent에서
    autocomplete.classList.add('autoComplete_displayNone'); //autocomplete 안보이게
    if (searchResultsContainer) {
      searchResultsContainer.classList.remove('visible');
    }
  } else {
    autocomplete.classList.remove('autoComplete_displayNone');
  }
}

// collapseButton 토글
// collapseButton 토글
// collapseButton 토글
export function toggleContent() {
  const content = elements.content;
  const rightArrow = elements.rightArrow;
  const leftArrow = elements.leftArrow;
  const autocomplete = elements.autocomplete;
  const collapseButton = elements.collapseButton;
  const searchResultsContainer = document.querySelector('#searchResultsContainer');
  const isSelfContent = document.querySelector('.selfContent') !== null;

  content.classList.toggle('hide');

  if (content.classList.contains('hide')) {//접혀있을 떄
    rightArrow.style.display = 'inline';
    leftArrow.style.display = 'none';
    collapseButton.style.left = '100%';
    if (isSelfContent && autocomplete) { // selfContent에서
      autocomplete.classList.remove('autoComplete_displayNone');//닫으면 autocomplete보이게
    }
    if (searchResultsContainer) { //접힌 상태에서 결과가 있으면..
      searchResultsContainer.classList.remove('visible');//serchResult숨기기
    }
  } else {
    rightArrow.style.display = 'none';
    leftArrow.style.display = 'inline';
    if (isSelfContent && autocomplete) {
      autocomplete.classList.add('autoComplete_displayNone');
    }
  }

  if (collapseButton.classList.contains('expanded')) { //collapseButton가 펼쳐져있으면 무조건 닫기
    collapseButton.classList.remove('expanded');
  }
}

// 검색 결과 컨테이너 표시/숨김 관리
export function toggleSearchResultsVisibility(visible = true) {
  const searchResultsContainer = document.querySelector("#searchResultsContainer");
  const collapseButton = document.querySelector('#collapseButton');

  if (visible) {
    searchResultsContainer.classList.add("visible");
    collapseButton.classList.add("expanded");
  } else {
    searchResultsContainer.classList.remove("visible");
    collapseButton.classList.remove("expanded");
  }
}

export function resetSearchResultState() {
  const searchResultsContainer = document.querySelector("#searchResultsContainer");
  if (searchResultsContainer) {
    searchResultsContainer.classList.remove("visible");
    searchResultsContainer.dataset.lastQuery = '';
  }
}