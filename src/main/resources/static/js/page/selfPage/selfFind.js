/* 
selfContent에서 검색 
*/
import { getMapInstance } from '../../core/store.js'
import { markerManager } from '../../map/marker.js';
import { findBySearch } from '../../handleGoogleApi/findBySearch.js';
import {
  displayGoogleSearchResults,
  setCurrentPlaceInput
} from './searchResult.js';

/**
 * Title - placeId로 검색 (Google API로 장소 검색)
 */
export function searchPlaceByInputId(inputId) {
  console.log("searchPlaceByInputId 실행:", inputId);
  const input = document.getElementById(inputId);
  
  if (!input || !input.value) return;

  console.log("self x번째 검색란:", inputId.replace("placeName", ""));
  console.log("이거 검색했음:", input.value);

  // 현재 입력 필드 설정
  setCurrentPlaceInput(input);

  // 검색 실행 google API로 장소 검색
  findBySearch(inputId).then((places) => {
    displayGoogleSearchResults(places, inputId);
  });
}

/**
 * 더미데이터 검색 (개발용)
 */
export async function dumiSearch(input) {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  markerManager.clearMarkers();
  const dumiData = [
    { placeName: "수락산역", position: { lat: 37.678017, lng: 127.055218 }, placeId: "ChIJu5r4xti4fDURipdcST_0DmA" },
    { placeName: "노원역", position: { lat: 37.654688, lng: 127.060551 }, placeId: "ChIJv98ROkC5fDURcL4ufuuX1mk" },
    { placeName: "건대역", position: { lat: 37.539020, lng: 127.070159 }, placeId: "ChIJC7gU5uikfDURj6CjED_CmOk" },
    { placeName: "홍대역", position: { lat: 37.557723, lng: 126.924478 }, placeId: "ChIJ4d9T2emYfDURGK_RrkTeN0o" },
    { placeName: "강남역", position: { lat: 37.498595, lng: 127.030026 }, placeId: "ChIJKxs2jFmhfDURPP--kvKavw0" },
  ];
  const searchTerm = input.value.trim();
  const selectedPlace = dumiData.find(data => data.placeName === searchTerm);

  if (selectedPlace) {
    const placeIdInput = document.getElementById(input.id.replace("placeName", "placeId"));
    if (placeIdInput) {
      placeIdInput.value = selectedPlace.placeId;
    }
    const map = getMapInstance();
    if (map) {
      const dumiMarker = new AdvancedMarkerElement({
        map: map,
        position: selectedPlace.position,
      });
      markerManager.addMarker(dumiMarker);
      map.panTo(selectedPlace.position);
      map.setZoom(17);
    }
  }
}

/**
 * Title - 검색 결과 클릭 이벤트 총괄
 */
export async function initSearchResults() {
  const searchResults = document.getElementById("searchResults");
  if (searchResults && !searchResults.dataset.listenerAdded) {
    // searchResult.js의 handleSearchResultClick는 외부에서 호출 가능하므로 이벤트 리스너로 직접 등록
    import('./searchResult.js').then(module => {
      searchResults.addEventListener('click', module.handleSearchResultClick);
      searchResults.dataset.listenerAdded = 'true';
    });
  }
}

/**
 * Title - 장소 검색 실행 핸들러
 */
export async function handlePlaceSearch(inputElement) {
  if (!inputElement || !inputElement.value.trim()) {
    alert("검색어를 입력해주세요.");
    return;
  }
  searchPlaceByInputId(inputElement.id);
}

/**
 * Title - 단일 input에 검색 이벤트 리스너 추가
 */
export function attachSearchEventToInput(inputElement) {
  if (!inputElement || inputElement.dataset.eventAttached) return;

  inputElement.addEventListener("keydown", async (event) => {
    if (event.isComposing) return;
    if (event.key === "Enter" && inputElement.name && inputElement.name.startsWith("placeNames")) {
      event.preventDefault();
      console.log("Enter 눌렀음:", inputElement.value);
      await handlePlaceSearch(inputElement);
    }
  });

  inputElement.dataset.eventAttached = "true";
}

export async function initializeSearchEvents() {
  console.log("initializeSearchEvents");
  const placeInputs = document.querySelectorAll(".placeInput input[type='text']");
  placeInputs.forEach(input => {
    attachSearchEventToInput(input);
  });
}
