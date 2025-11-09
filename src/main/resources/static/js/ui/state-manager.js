import { elements } from './dom-elements.js';
import { cleanupFunctions } from '../main.js';

/* 
* Title - collapseButton 클릭 이벤트부여
*/
export function collapseButtonEvent() {
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

/* 
* Title - collapseButton css 상태, selfContent에서 autocomplete 숨김
*/
export function resetCollapseButtonStateWithAutoComplete(hideAutoComplete = false) {
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

  //true면 autocomplete 숨기기
  if (hideAutoComplete) {
    autocomplete.classList.add('autoComplete_displayNone'); //autocomplete 안보이게
    if (searchResultsContainer) {
      searchResultsContainer.classList.remove('visible');
    }
  } else {
    autocomplete.classList.remove('autoComplete_displayNone');
  }
}

/* 
* Title - .contentWidth 조절
* 메뉴마다 다 너비를 다르게 할 수도 있음
*/
export function adjustContentWidth(width) {
  const content = elements.content;
  console.log("adjustContentWidth 호출");
  console.log(content);
  const planDetail = document.querySelector('.planDetail-container');
  if (planDetail) {
    content.style.width = '500px';
  } else {
    content.style.width = '390px';
  }
}

/* 
* Title - content 접기/펼치기 function
*/
function toggleContent() {
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

/*
* Title - 검색 결과 컨테이너 표시/숨김 관리
*/
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