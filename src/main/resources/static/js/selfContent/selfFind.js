// selfContent에서 검색
import { cacheElement, bindEvent, elements } from '../ui/dom-elements.js';
import { getMapInstance } from '../store/map-store.js';
import { createMarker, markerManager } from '../map/marker.js';
import { findBySearch } from '../search/findBySearch.js';

let currentPlaceInput = null;
let routePolylines = []; // 그려진 경로선들을 저장하는 배열

// placeId로 검색
// searchPlaceByText 합쳐도 될 듯
export function searchPlaceByInputId(inputId) { // inputId는 placeName1, placeName2, placeName3 등
  console.log("searchPlaceByInputId 실행:", inputId);
  const input = cacheElement(inputId, `#${inputId}`);
  console.log("self x번째 검색란:", inputId.replace("placeName", ""));
  console.log("이거 검색했음:", document.querySelector(`#${inputId}`).value);
  if (!input.value) return;
  // 현재 입력 필드 설정
  currentPlaceInput = input;
  // 검색 실행
  findBySearch(inputId).then((places) => {
    const searchResults = document.querySelector("#searchResults");
    const searchResultsContainer = document.querySelector("#searchResultsContainer");
    searchResults.innerHTML = '';

    if (places.length) {
      places.forEach(place => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.dataset.placeId = place.id;
        const photoURIs = place.photos
          ? place.photos.slice(0, 3).map(photo => photo.getURI({ maxWidth: 100, maxHeight: 100 }))
          : [];
        resultItem.innerHTML = `
          <button class="place-name">${place.displayName}</button>
          <div class="place-rating">
            Rating: ${place.rating || 'N/A'} (${place.userRatingCount || 'N/A'} reviews)
          </div>
          <div class="place-photos">
            ${photoURIs.map(uri => `<img src="${uri}" alt="${place.displayName}">`).join('')}
          </div>
        `;
        searchResults.appendChild(resultItem);
      });
      searchResultsContainer.classList.add("visible");
      console.log("searchResultsContainer.classList", searchResultsContainer.classList);
      // collapse 버튼 확장 TODO: 펼치는 버튼 이상하게 펼쳐짐 css조작해얃댐
      const collapseButton = cacheElement("collapseButton", "#collapseButton");
      collapseButton.classList.add("expanded");
    } else {
      searchResults.innerHTML = "<p>검색 결과가 없습니다.</p>";
      searchResultsContainer.classList.add("visible");
    }
  });
}

export async function dumiSearch() {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const placeInputs = document.querySelectorAll(".placeInput input[type='text']");
  const dumiData = [
    { placeId: "수락산역", position: { lat: 37.678017, lng: 127.055218 } },
    { placeId: "노원역", position: { lat: 37.654688, lng: 127.060551 } },
    { placeId: "건대역", position: { lat: 37.539020, lng: 127.070159 } },
    { placeId: "홍대역", position: { lat: 37.557723, lng: 126.924478 } },
    { placeId: "강남역", position: { lat: 37.498595, lng: 127.030026 } },
  ];
  placeInputs.forEach(input => {
    const selectedPlace = dumiData.find(data => data.placeId === input.value);
    // let position = { lat: 37.655, lng: 127.077 };
    let position = {};
    if (selectedPlace) {
      position = selectedPlace.position;
      const dumiMarker = new AdvancedMarkerElement({
        map: getMapInstance(),
        position: position,
      });
      markerManager.addMarker(dumiMarker);
    }

    const positionSet = [];

    placeInputs.forEach(placeInput => {
      const inputValue = placeInput.value.trim();
      if (inputValue) {
        const matchingPlace = dumiData.find(data => data.placeId === inputValue);
        if (matchingPlace) {
          positionSet.push(matchingPlace.position);
        }
      }
    });
    console.log("positionSet:", positionSet);

    const bounds = new google.maps.LatLngBounds();
    positionSet.map(async (place) => {
      bounds.extend(place);

      if (!bounds.isEmpty()) {
        getMapInstance().fitBounds(bounds, {
          top: 100,
          right: 100,
          bottom: 100,
          left: 100
        });
        google.maps.event.addListenerOnce(getMapInstance(), "bounds_changed", () => {
          if (getMapInstance().getZoom() > 17) {
            getMapInstance().setZoom(17);
          }
        });
      }
      console.log("position lat:", position.lat, ", lng:", position.lng);
    });
  });
}




// initializePlaceEvents - input을 긁어서 searchPlaceByInputId를 실행 시키는 이벤트 붙여주기
export async function initializePlaceEvents() {
  console.log("initializePlaceEvents");
  const placeInputs = document.querySelectorAll(".placeInput input[type='text']");
  //장소 input.value를 findBySearch()
  placeInputs.forEach(input => {
    if (!input.dataset.eventAttached) {
      input.addEventListener("keydown", async (event) => {
        if (event.isComposing) return;
        if (event.key === "Enter" && input.name.startsWith("placeNames")) {
          console.log("Enter 눌렀음");
          console.log("장소 input:", input.value);
          event.preventDefault();

          // searchPlaceByInputId(input.id); 
          //  돈 내기 시렁 더미 데이터로 대체하겠다
          dumiSearch();
          input.dataset.eventAttached = "true";
        }
      });
    }
  });

  //이미 채워진 placeId가 있으면 마커 생성
  setTimeout(() => {
    document.querySelectorAll(".placeInput input[type='hidden'][name='.placeId']").forEach(input => {
      if (input.value) {
        const nameInput = document.getElementById(input.id.replace('placeId', 'placeName'));
        createMarker(place, map).then(marker => {
          if (marker) {
            markerManager.addPlaceMarker(input.value, marker);
          }
        });
      };
    });
  }, 1000);
}


export function initSearchResults() { }
export async function handelSearchResultsClick() {
  console.log("initSearchResults");

  // cacheElement("searchResults", "#searchResults");
  // const searchResults = document.querySelector("#searchResults");
  // searchResults.addEventListener("click", async (event) => {
  console.log("searchResults click");
  const resultItem = event.target.closest(".result-item");
  if (resultItem && currentPlaceInput) {
    const placeId = resultItem.dataset.placeId;
    const displayName = resultItem.querySelector(".place-name").textContent;

    currentPlaceInput.value = displayName; // 장소명 입력
    let placeIdInput;
    if (currentPlaceInput.id === "placeNameEnd") {
      placeIdInput = cacheElement("placeIdEnd", "#placeIdEnd");
    } else {
      const placeNum = currentPlaceInput.id.replace('placeName', '');
      placeIdInput = cacheElement(`placeId${placeNum}`, `#placeId${placeNum}`);
    }
    if (placeIdInput) {
      const prevValue = placeIdInput.value;
      placeIdInput.value = placeId;

      const changeEvent = new Event('change', { bubbles: true });
      placeIdInput.dispatchEvent(changeEvent);
      currentPlaceInput.style.border = ""; // 검증 오류 표시 제거
      if (prevValue) {
        markerManager.removePlaceMarker(prevValue);
      }
      const marker = await createMarker(placeId, getMapInstance()); //createMarker로 되어있는데 후에 plcaeId로 검색하는 경우는 따로 작성해야 됨
      if (marker) {
        markerManager.addPlaceMarker(placeId, marker);
        if (marker.position) {
          getMapInstance().panTo(marker.position);
          getMapInstance().setZoom(15);
        }
      }
      // const transportInput = cacheElement(`transport${currentPlaceInput.id.replace('placeName', '')}`, `#transport${currentPlaceInput.id.replace('placeName', '')}`);
      // if (transportInput) {
      //   transportInput.value = transportSelections[currentPlaceInput.id.replace('placeName', '')] || "TRANSIT";
      //   console.log("transportInput", transportInput.value);
      // }
      const searchResultsContainer = document.querySelector("#searchResultsContainer");
      searchResultsContainer.classList.remove("visible");
      console.log("searchResultsContainer.classList", searchResultsContainer.classList);
      const collapseButton = cacheElement("collapseButton", "#collapseButton");
      collapseButton.classList.remove("expanded");
    }
  }
  // });
}