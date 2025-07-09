import { cacheElement } from '../ui/dom-elements.js';
import { getMapInstance } from '../store/map-store.js';
import { markerManager, createServerMarker, adjustMapBounds } from '../map/marker.js';
import { toggleSearchResultsVisibility } from '../ui/state-manager.js';

let currentPlaceInput = null;

// 검색 결과 아이템 HTML 생성 (서버 결과용)
// 검색 결과 아이템 HTML 생성 (서버 결과용)
// 검색 결과 아이템 HTML 생성 (서버 결과용)
function createServerResultItemHTML(place) {
  return `
    <button class="place-name">${place.name}</button>
    <div class="place-address">${place.address}</div>
    <div class="place-keywords">
      ${place.topPurposeKeywords && place.topPurposeKeywords.length > 0
      ? `<div class="keywords-group">
            <span>목적: </span>
            ${place.topPurposeKeywords.map(keyword =>
        `<span class="keyword">${keyword}</span>`).join('')}
          </div>`
      : ''}
      ${place.topMoodKeywords && place.topMoodKeywords.length > 0
      ? `<div class="keywords-group">
            <span>분위기: </span>
            ${place.topMoodKeywords.map(keyword =>
        `<span class="keyword">${keyword}</span>`).join('')}
          </div>`
      : ''}
    </div>
  `;
}

// 검색 결과 아이템 HTML 생성 (구글 API 결과용)
// 검색 결과 아이템 HTML 생성 (구글 API 결과용)
// 검색 결과 아이템 HTML 생성 (구글 API 결과용)
function createGoogleResultItemHTML(place) {
  const photoURIs = place.photos
    ? place.photos.slice(0, 3).map(photo => photo.getURI({ maxWidth: 100, maxHeight: 100 }))
    : [];

  return `
    <button class="place-name">${place.displayName}</button>
    <div class="place-rating">
      Rating: ${place.rating || 'N/A'} (${place.userRatingCount || 'N/A'} reviews)
    </div>
    <div class="place-photos">
      ${photoURIs.map(uri => `<img src="${uri}" alt="${place.displayName}">`).join('')}
    </div>
  `;
}

// 서버에서 검색된 장소 결과 표시
// 서버에서 검색된 장소 결과 표시
// 서버에서 검색된 장소 결과 표시
export async function displayServerSearchResults(places, inputId) {
  console.log("서버에서 검색된 장소 표시:", places);

  currentPlaceInput = document.getElementById(inputId);
  const searchResults = document.querySelector("#searchResults");
  const searchResultsContainer = document.querySelector("#searchResultsContainer");

  searchResults.innerHTML = '';
  markerManager.clearMarkers();

  // 결과 아이템 생성
  // 결과 아이템 생성
  // 결과 아이템 생성
  const markerPromises = places.map(async (place) => {
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    resultItem.dataset.placeId = place.placeId;
    resultItem.innerHTML = createServerResultItemHTML(place);
    searchResults.appendChild(resultItem);

    // 마커 생성
    const marker = await createServerMarker(place);
    return markerManager.addMarker(marker);
  });

  await Promise.all(markerPromises);

  // UI 업데이트
  toggleSearchResultsVisibility(true);
  searchResultsContainer.dataset.lastQuery = currentPlaceInput.value;

  // 지도 경계 조정
  adjustMapBounds(places, true);

  console.log("검색 결과 표시 완료");
}

// 구글 API 검색 결과 표시
// 구글 API 검색 결과 표시
// 구글 API 검색 결과 표시
export async function displayGoogleSearchResults(places, inputId) {
  console.log("구글 API 검색 결과 표시:", places);

  currentPlaceInput = document.getElementById(inputId);
  const searchResults = document.querySelector("#searchResults");
  const searchResultsContainer = document.querySelector("#searchResultsContainer");

  searchResults.innerHTML = '';

  if (places.length) {
    places.forEach(place => {
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      resultItem.dataset.placeId = place.id;
      resultItem.innerHTML = createGoogleResultItemHTML(place);
      searchResults.appendChild(resultItem);
    });

    // UI 업데이트
    toggleSearchResultsVisibility(true);
    searchResultsContainer.dataset.lastQuery = currentPlaceInput.value;
  } else {
    searchResults.innerHTML = "<p>검색 결과가 없습니다.</p>";
    searchResultsContainer.dataset.lastQuery = currentPlaceInput.value;
    toggleSearchResultsVisibility(true);
  }

  console.log("구글 검색 결과 표시 완료");
}

// 검색 결과 클릭 처리
// 검색 결과 클릭 처리
// 검색 결과 클릭 처리
export async function handleSearchResultClick(event) {
  console.log("검색 결과 클릭 처리");

  const resultItem = event.target.closest(".result-item");
  if (!resultItem || !currentPlaceInput) return;
  // if (resultItem && currentPlaceInput) {
  const placeId = resultItem.dataset.placeId;
  const displayName = resultItem.querySelector(".place-name").textContent;

  // 장소명 입력
  currentPlaceInput.value = displayName;

  // placeId input 찾기 및 업데이트
  let placeIdInput;
  if (currentPlaceInput.id === "placeNameEnd") {
    placeIdInput = cacheElement("placeIdEnd", "#placeIdEnd");
  } else {
    const placeNum = currentPlaceInput.id.replace('placeName', '');
    placeIdInput = cacheElement(`placeId${placeNum}`, `#placeId${placeNum}`);//이게 hidden input임
  }

  if (placeIdInput) {
    const prevValue = placeIdInput.value;
    placeIdInput.value = placeId;// hidden input에 placeId를 할당

    // 이벤트 발생
    const changeEvent = new Event('change', { bubbles: true });
    placeIdInput.dispatchEvent(changeEvent);

    // 스타일 초기화
    currentPlaceInput.style.border = "";

    // 이전 마커 제거
    if (prevValue) {
      markerManager.removePlaceMarker(prevValue);
    }

    // 새 마커 생성 (createMarker 함수 필요시 import)
    try {
      const { createMarker } = await import('../map/marker.js');
      //TODO: placeId로 마커 생성하는거 만들어야 됨
      const marker = await createMarker(placeId, getMapInstance());
      if (marker) {
        markerManager.addPlaceMarker(placeId, marker);
        if (marker.position) {
          getMapInstance().panTo(marker.position);
          getMapInstance().setZoom(15);
        }
      }
    } catch (error) {
      console.warn("마커 생성 실패:", error);
    }

    // 검색 결과 숨기기
    toggleSearchResultsVisibility(false);
  }
}

// 현재 입력 필드 설정
export function setCurrentPlaceInput(input) {
  currentPlaceInput = input;
}

// 현재 입력 필드 가져오기
export function getCurrentPlaceInput() {
  return currentPlaceInput;
}