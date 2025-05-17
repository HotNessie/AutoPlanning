// selfContent에서 검색
import { cacheElement, bindEvent, elements } from '../ui/dom-elements.js';
import { getMapInstance } from '../store/map-store.js';
import { createMarker, markerManager } from '../map/marker.js';
import { findBySearch } from '../search/findBySearch.js';

let currentPlaceInput = null;
let routePolylines = []; // 그려진 경로선들을 저장하는 배열

// placeId로 검색
// searchPlaceByText 합쳐도 될 듯
export function searchPlaceByInputId(inputId) {
  console.log("searchPlaceByInputId 실행:", inputId);
  const input = cacheElement(inputId, `#${inputId}`);
  console.log("self x번째 검색란:", inputId.replace("placeName", ""));
  console.log("이거 검색했음:", document.querySelector(`#${inputId}`).value);
  if (!input.value) return;

  // 현재 입력 필드 설정
  currentPlaceInput = input;

  // 검색 실행
  findBySearch(inputId).then((places) => {
    // const searchResults = cacheElement("searchResults", "#searchResults");
    // const searchResultsContainer = cacheElement("searchResultsContainer", "#searchResultsContainer");
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



// initializePlaceEvents - input을 긁어서 searchPlaceByInputId를 실행 시키는 이벤트 붙여주기
export function initializePlaceEvents() {
  console.log("initializePlaceEvents");
  const map = getMapInstance();
  const placeInputs = document.querySelectorAll(".placeInput input[type='text']");
  // const placeInputs = cacheElement("placeInput input[type='text']", ".placeInput input[type='text']");
  //장소 input.value를 findBySearch()
  placeInputs.forEach(input => {
    if (!input.dataset.eventAttached) {
      input.addEventListener("keydown", (event) => {
        if (event.isComposing) return;
        if (event.key === "Enter" && input.name.startsWith("placeNames")) {
          console.log("Enter 눌렀음");
          console.log("장소 input:", input.value);
          //이 이벤트가 addPlace()로 생성된 input에는 이벤트가 붙지 않음, resultItem도 마찬가지겠지?
          event.preventDefault();
          searchPlaceByInputId(input.id);
        }
      });
      input.dataset.eventAttached = "true";
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


export function initSearchResults() {
  console.log("initSearchResults");

  // cacheElement("searchResults", "#searchResults");
  const searchResults = document.querySelector("#searchResults");
  //이거부터 수정하면 이벤트 먹을거임
  // bindEvent("searchResults", "click", async (event) => {
  searchResults.addEventListener("click", async (event) => {
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
  });
}