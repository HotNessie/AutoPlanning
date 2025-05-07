// dom-elements 캐싱
export const elements = {};

export const cacheElement = (id, selector) => {
  elements[id] = document.querySelector(selector);
  return elements[id];
};

export const bindEvent = (id, event, callback) => {
  const element = elements[id];
  if (element) {
    element.addEventListener(event, callback);
    // return () => element.removeEventListener(event, callback); // Cleanup function
  }
};

export const getElement = id => elements[id];

// 초기 캐싱
export function initDomElements() {
  //autocomplete
  cacheElement('autocomplete', '#autocomplete');//기본 검색어 입력창이 들어있는 div
  cacheElement('searchInput', '#searchInput');//기본 검색어 입력창
  cacheElement('results', '#results');//추천 검색어 리스트
  cacheElement('suggestion', '#suggestion');//추천 검색어
  cacheElement('searchButton', '#searchButton');//검색 버튼
  //mapControl Button
  cacheElement('currentPosition', '.customCurrentPosition');//기본 검색어 검색 버튼
  cacheElement('zoomIn', '.customZoomIn');//줌인 버튼
  cacheElement('zoomOut', '.customZoomOut');//줌아웃 버튼
  cacheElement('fitMarkers', '#fitMarkersBtn');//모든 마커 보기 버튼
  cacheElement('clearRoutes', '.clearRoutesBtn');//모든 경로 지우기 버튼
  //content관련 element
  cacheElement('content', '#content');//collapseBody가 들어가는 div
  cacheElement('collapseBody', '#collapseBody');//fragment 들어가는 div
  cacheElement('rightArrow', '#rightArrow');//collapseButton의 오른쪽 화살표
  cacheElement('leftArrow', '#leftArrow');// collapseButton의 왼쪽 화살표
  cacheElement('collapseButton', '#collapseButton');//메뉴 접기 버튼
  //메뉴 버튼
  cacheElement('hotButton', '#hotButton');
  cacheElement('autoButton', '#autoButton');
  cacheElement('selfButton', '#selfButton');
  cacheElement('bookmarkButton', '#bookmarkButton');
  cacheElement('historyButton', '#historyButton');
}