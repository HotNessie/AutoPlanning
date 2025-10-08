import { cacheElement } from '../ui/dom-elements.js';
import { getMapInstance } from '../store/map-store.js';
import { markerManager, createServerMarker, adjustMapBounds } from '../map/marker.js';
import { toggleSearchResultsVisibility } from '../ui/state-manager.js';

let currentPlaceInput = null;
// 최근 구글 검색 결과 저장
class GoogleSearchResultsManager {
  constructor() {
    this.currentGoogleResults = [];
  }

  setResults(places) {
    this.currentGoogleResults = places;
  }
  getResults(index) {
    return this.currentGoogleResults[index];
  }
  clearResults() {
    this.currentGoogleResults = [];
  }
  getAllResults() {
    return this.currentGoogleResults;
  }
}
export const googleSearchResultsManager = new GoogleSearchResultsManager();

/* 
* 검색 결과 반환하는 item 생성로직
* @result item =  검색결과 리스트를 담는 div
*/

//Title - 검색 결과 아이템 HTML (서버 결과용)
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

//Title - 검색 결과 아이템 HTML (구글 API 결과용)
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

//Title -  서버에서 검색된 장소 결과 표시
export async function displayServerSearchResults(places, inputId) {
  console.log("서버에서 검색된 장소 표시:", places);

  searchResultsManager.setResults(places);//최근 검색 결과 저장

  currentPlaceInput = document.getElementById(inputId);
  const searchResults = document.querySelector("#searchResults");
  const searchResultsContainer = document.querySelector("#searchResultsContainer");

  searchResults.innerHTML = '';
  markerManager.clearMarkers();

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

//Title -  구글 API 검색 결과 표시
export async function displayGoogleSearchResults(places, inputId) {
  console.log("구글 API 검색 결과 표시:", places);

  googleSearchResultsManager.setResults(places);//최근 검색 결과 저장
  console.log("googleSearchResultsManager:", googleSearchResultsManager.getAllResults());
  console.log("count of googleSearchResultsManager:", googleSearchResultsManager.getAllResults().length);

  currentPlaceInput = document.getElementById(inputId);
  const searchResults = document.querySelector("#searchResults");
  const searchResultsContainer = document.querySelector("#searchResultsContainer");

  searchResults.innerHTML = '';

  if (places.length) {
    places.forEach((place, index) => {
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';

      /* resultItem.dataset.placeId = place.id;
      resultItem.innerHTML = createGoogleResultItemHTML(place); // 구글 API 결과용 HTML 생성 함수 사용 */

      resultItem.dataset.index = index; //dataset에 index 저장
      resultItem.innerHTML = createGoogleResultItemHTML(place); // 구글 API 결과용 HTML 생성 함수 사용
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

//Title - 검색 결과 클릭하면..
export async function handleSearchResultClick(event) {
  console.log("검색 결과 클릭 처리");

  const resultItem = event.target.closest(".result-item"); //반환된 결과 iteam
  if (!resultItem || !currentPlaceInput) return;
  //?선택 아이템 index가져오기.
  const index = parseInt(resultItem.dataset.index, 10); //클릭한 아이템의 dataset
  //?index를 통해서 googleSearchResults에서 장소 데이터 가져오기
  const placeData = googleSearchResultsManager.getResults(index);
  // const displayName = resultItem.querySelector(".place-name").textContent;
  //클릭한 아이템의 장소명
  if (!placeData) {
    console.warn("선택한 장소 데이터가 없습니다.", index);
    return;
  }
  console.log("선택한 장소 데이터:", placeData);

  const placeId = placeData.id || placeData.place_id; // Google Place_ID
  const displayName = placeData.displayName || placeData.name; // 장소명
  const address = placeData.formattedAddress || placeData.address; // 주소
  const latitude = placeData.location.lat();
  const longitude = placeData.location.lng();

  // 장소명 입력
  currentPlaceInput.value = displayName; //js변수에 value저장
  console.log("currentPlaceInput:", currentPlaceInput);

  console.log("to save data:", {
    placeId: placeId,
    displayName: displayName,
    address: address,
    latitude: latitude,
    longitude: longitude
  });

  try {
    const response = await fetch('/api/public/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placeId: placeId,
        name: displayName,
        address: address,
        latitude: latitude,
        longitude: longitude
      })
    });
    if (response.ok) {
      const savedPlace = await response.json();
      console.log("장소 저장 성공:", savedPlace);
    } else {
      console.warn("장소 저장 실패:", response.statusText);
    }
  } catch (error) {
    console.error("장소 저장 중 오류 발생:", error);
  }


  // placeId input 찾기 및 업데이트 //? hidden input 선택
  let placeIdInput;
  if (currentPlaceInput.id === "placeNameEnd") {
    placeIdInput = document.querySelector("#placeIdEnd");
  } else {
    const placeNum = currentPlaceInput.id.replace('placeName', '');
    placeIdInput = document.querySelector(`#placeId${placeNum}`);
    //placeIdInput == hidden input
  }

  if (placeIdInput) {
    const prevValue = placeIdInput.value;
    placeIdInput.value = placeId;// hidden input에 placeId를 할당
    //TODO: hidden에 넣지말고 이것도 변수로 저장하거나 dataset으로 하는게 좋을 듯. 시간 나면 수정

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

//Title - 현재 입력 필드 설정
export function setCurrentPlaceInput(input) {
  currentPlaceInput = input;
}

//Title - 현재 입력 필드 가져오기
export function getCurrentPlaceInput() {
  return currentPlaceInput;
}