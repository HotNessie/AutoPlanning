import { getMapInstance } from '../core/store.js';
import { centerMapToCurrentPosition } from '../map/position.js';
import { fitAllMarkers, markerManager } from '../map/marker.js';
import { routeManager } from '../map/commonRoute.js';

/* 
* 메뉴 여닫기 이벤트 부여
* 장소 검색창 표시/숨김 관리
* 메뉴 너비 조절
* 메뉴 여닫기 함수
* 검색 결과 컨테이너 표시/숨김 관리(selfContent에서 사용되는 박스)
* 지도 컨트롤 버튼
*/

/**
 * Title - collapseButton 클릭 이벤트부여
 */
export function collapseButtonEvent() {
  const collapseButton = document.getElementById('collapseButton');
  if (collapseButton) {
    collapseButton.addEventListener('click', () => {
      toggleContent();
      console.log("collapseButton 클릭");
    });
  }
}

/**
 * Title - collapseButton css 상태, selfContent에서 autocomplete 숨김
 */
export function resetCollapseButtonStateWithAutoComplete(hideAutoComplete = false) {
  const content = document.getElementById('content');
  const rightArrow = document.getElementById('rightArrow');
  const leftArrow = document.getElementById('leftArrow');
  const autocomplete = document.getElementById('autocomplete');
  const collapseButton = document.getElementById('collapseButton');
  const searchResultsContainer = document.querySelector('#searchResultsContainer');

  if (content) {
    content.classList.remove('hide');
  }
  if (collapseButton) {
    collapseButton.style.left = '100%';
    collapseButton.classList.remove('expanded');
  }
  if (rightArrow) rightArrow.style.display = 'none';
  if (leftArrow) leftArrow.style.display = 'inline';

  // true면 autocomplete 숨기기
  if (hideAutoComplete) {
    if (autocomplete) autocomplete.classList.add('autoComplete_displayNone');
    if (searchResultsContainer) {
      searchResultsContainer.classList.remove('visible');
    }
  } else {
    if (autocomplete) autocomplete.classList.remove('autoComplete_displayNone');
  }
}

/**
 * Title - .contentWidth 조절
 */
export function adjustContentWidth(width) {
  const content = document.getElementById('content');
  if (!content) return;

  console.log("adjustContentWidth 호출");
  const planDetail = document.querySelector('.planDetail-container');
  if (planDetail) {
    content.style.width = '500px';
  } else {
    content.style.width = '390px';
  }
}

/**
 * Title - content 접기/펼치기 function
 */
function toggleContent() {
  const content = document.getElementById('content');
  const rightArrow = document.getElementById('rightArrow');
  const leftArrow = document.getElementById('leftArrow');
  const autocomplete = document.getElementById('autocomplete');
  const collapseButton = document.getElementById('collapseButton');
  const searchResultsContainer = document.querySelector('#searchResultsContainer');
  const isSelfContent = document.querySelector('.selfContent') !== null;

  if (!content) return;

  content.classList.toggle('hide');

  if (content.classList.contains('hide')) { // 접혀있을 때
    if (rightArrow) rightArrow.style.display = 'inline';
    if (leftArrow) leftArrow.style.display = 'none';
    if (collapseButton) collapseButton.style.left = '100%';
    
    if (isSelfContent && autocomplete) {
      autocomplete.classList.remove('autoComplete_displayNone');
    }
    if (searchResultsContainer) {
      searchResultsContainer.classList.remove('visible');
    }
  } else { // 펼쳐져있을 때
    if (rightArrow) rightArrow.style.display = 'none';
    if (leftArrow) leftArrow.style.display = 'inline';
    
    if (isSelfContent && autocomplete) {
      autocomplete.classList.add('autoComplete_displayNone');
    }
  }

  if (collapseButton && collapseButton.classList.contains('expanded')) {
    collapseButton.classList.remove('expanded');
  }
}

/**
 * Title - 검색 결과 컨테이너 표시/숨김 관리
 */
export function toggleSearchResultsVisibility(visible = true) {
  const searchResultsContainer = document.querySelector("#searchResultsContainer");
  const collapseButton = document.querySelector('#collapseButton');

  if (visible) {
    if (searchResultsContainer) searchResultsContainer.classList.add("visible");
    if (collapseButton) collapseButton.classList.add("expanded");
  } else {
    if (searchResultsContainer) searchResultsContainer.classList.remove("visible");
    if (collapseButton) collapseButton.classList.remove("expanded");
  }
}

/**
 * Title - 검색 결과 상태 초기화
 */
export function resetSearchResultState() {
  const searchResultsContainer = document.querySelector("#searchResultsContainer");
  if (searchResultsContainer) {
    searchResultsContainer.classList.remove("visible");
    searchResultsContainer.dataset.lastQuery = '';
  }
}

/**
 * Title - 지도 컨트롤 버튼 이벤트
 */
export function initControls() {
  const map = getMapInstance();
  if (!map) return;

  // 표준 addEventListener 사용 (currentPosition, zoomIn, zoomOut 등)
  const currentPosBtn = document.querySelector('.customCurrentPosition');
  if (currentPosBtn) {
    currentPosBtn.addEventListener('click', () => centerMapToCurrentPosition(map));
  }

  const zoomInBtn = document.querySelector('.customZoomIn');
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => map.setZoom(map.getZoom() + 2));
  }

  const zoomOutBtn = document.querySelector('.customZoomOut');
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => map.setZoom(map.getZoom() - 2));
  }

  const fitMarkersBtn = document.getElementById('fitMarkersBtn');
  if (fitMarkersBtn) {
    fitMarkersBtn.addEventListener('click', () => fitAllMarkers());
  }

  const clearRoutesBtn = document.querySelector('.clearRoutesBtn');
  if (clearRoutesBtn) {
    clearRoutesBtn.addEventListener('click', () => {
      routeManager.clearRoutes();
      markerManager.clearMarkers();
    });
  }
}
