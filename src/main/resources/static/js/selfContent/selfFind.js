// selfContent에서 검색
import { cacheElement, bindEvent, elements } from '../ui/dom-elements.js';
import { getMapInstance } from '../store/map-store.js';
import { createMarker, markerManager } from '../map/marker.js';
import { findBySearch } from '../search/findBySearch.js';
import {
  displayServerSearchResults,
  displayGoogleSearchResults,
  handleSearchResultClick,
  setCurrentPlaceInput
} from '../selfContent/searchResult.js';
import { toggleSearchResultsVisibility } from '../ui/state-manager.js';

let routePolylines = []; // 그려진 경로선들을 저장하는 배열

// placeId로 검색
// placeId로 검색
// placeId로 검색
// searchPlaceByText 합쳐도 될 듯
export function searchPlaceByInputId(inputId) { // inputId는 placeName1, placeName2, placeName3 등
  console.log("searchPlaceByInputId 실행:", inputId);
  const input = cacheElement(inputId, `#${inputId}`);
  console.log("self x번째 검색란:", inputId.replace("placeName", ""));
  console.log("이거 검색했음:", document.querySelector(`#${inputId}`).value);
  if (!input.value) return;

  const searchResultsContainer = document.querySelector("#searchResultsContainer");
  const lastQuery = searchResultsContainer.dataset.lastQuery;

  if (lastQuery === input.value) {
    console.log("동일한 검색어 감지, 캐시된 결과 사용:", input.value);
    setCurrentPlaceInput(input);
    toggleSearchResultsVisibility(true);
    console.log("그냥 펼침");
    return;
  }

  // 현재 입력 필드 설정
  setCurrentPlaceInput(input);

  // 검색 실행 google API로 장소 검색
  findBySearch(inputId).then((places) => {
    displayGoogleSearchResults(places, inputId);
  });
}
//더미데이터
//더미데이터
//더미데이터
export async function dumiSearch(input) {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  // const placeInputs = document.querySelectorAll(".placeInput input[type='text']");
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
    const placeIdInpute = document.querySelector(`#${input.id.replace("placeName", "placeId")}`);
    if (placeIdInpute) {
      placeIdInpute.value = selectedPlace.placeId;
    }
    const dumiMarker = new AdvancedMarkerElement({
      map: getMapInstance(),
      position: selectedPlace.position,
    });
    markerManager.addMarker(dumiMarker);
    getMapInstance().panTo(selectedPlace.position);
    getMapInstance().setZoom(17);
  }
}

export async function initSearchResults() {
  const searchResults = document.querySelector("#searchResults");
  if (searchResults && !searchResults.dataset.listenerAdded) {
    searchResults.addEventListener('click', handleSearchResultClick);
    searchResults.dataset.listenerAdded = 'true';
  }
}

// 더 이상 사용하지 않는 함수들은 제거하고 새로운 모듈 함수 사용
// export { displayServerSearchResults as displaySearchResults };

// DB에 장소 검색 없으면 구글 API로 장소 검색
// DB에 장소 검색 없으면 구글 API로 장소 검색
// DB에 장소 검색 없으면 구글 API로 장소 검색
export async function handlePlaceSearch(inputElemnet) {
  if (!inputElemnet.value.trim()) {
    alert("검색어를 입력해주세요.");
    return;
  }

  const searchTerm = inputElemnet.value.trim();

  try {
    // 서버 검색 시도
    const response = await fetch(`/places/search?name=${encodeURIComponent(searchTerm)}`);

    if (response.ok) {
      const places = await response.json();
      if (places && places.length > 0) {
        displayServerSearchResults(places, inputElemnet.id);
        return;
      }
    } else if (response.status === 404) {
      console.log("장소 검색 결과 없음, 더미 데이터로 대체");
    }
  } catch (error) {
    console.log("DB에 장소 데이터 없음 고로 구글 API요청 보냄", error);
  }

  // 서버 검색 실패 시 더미 데이터 사용
  //searchPlaceByInputId(inputElemnet.id);
  dumiSearch(inputElemnet);
}

// 단일 input에 검색 이벤트 리스너 추가
export function attachSearchEventToInput(inputElement) {
  if (inputElement.dataset.eventAttached) return;

  inputElement.addEventListener("keydown", async (event) => {
    if (event.isComposing) return;
    if (event.key === "Enter" && inputElement.name.startsWith("placeNames")) {
      event.preventDefault();
      console.log("Enter 눌렀음");
      console.log("장소 inputElement:", inputElement.value);

      await handlePlaceSearch(inputElement);
    }
  });

  inputElement.dataset.eventAttached = "true";
}

// 리팩토링된 initializeSearchEvents
export async function initializeSearchEvents() {
  console.log("initializeSearchEvents");
  const placeInputs = document.querySelectorAll(".placeInput input[type='text']");

  placeInputs.forEach(input => {
    attachSearchEventToInput(input);
  });
}