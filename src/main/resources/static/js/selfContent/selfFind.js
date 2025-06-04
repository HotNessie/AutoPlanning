// selfContent에서 검색
import { cacheElement, bindEvent, elements } from '../ui/dom-elements.js';
import { getMapInstance } from '../store/map-store.js';
import { createMarker, markerManager } from '../map/marker.js';
import { findBySearch } from '../search/findBySearch.js';

let currentPlaceInput = null;
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
  const inputIdKey = searchResultsContainer.dataset.lastInputId;

  // 현재 검색어와 마지막 검색어가 같고, 동일한 입력 필드에서 검색한 경우 API 호출을 하지 않음
  // if (lastQuery === input.value && inputIdKey === inputId) {
  if (lastQuery === input.value) {
    console.log("동일한 검색어 감지, 캐시된 결과 사용:", input.value);
    searchResultsContainer.classList.add("visible");
    const collapseButton = cacheElement("collapseButton", "#collapseButton");
    collapseButton.classList.add("expanded");
    currentPlaceInput = input; // 현재 입력 필드 설정 (이 부분은 중요함)
    console.log("그냥 펼침");
    return;
  }

  // 현재 입력 필드 설정
  currentPlaceInput = input;

  // 검색 실행
  findBySearch(inputId).then((places) => {
    const searchResults = document.querySelector("#searchResults");
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

      // 검색 결과와 현재 검색어를 저장
      searchResultsContainer.dataset.lastQuery = input.value;
      // searchResultsContainer.dataset.lastInputId = inputId;

      searchResultsContainer.classList.add("visible");
      console.log("searchResultsContainer.classList", searchResultsContainer.classList);
      // collapse 버튼 확장 TODO: 펼치는 버튼 이상하게 펼쳐짐 css조작해얃댐
      const collapseButton = cacheElement("collapseButton", "#collapseButton");
      collapseButton.classList.add("expanded");
    } else {
      searchResults.innerHTML = "<p>검색 결과가 없습니다.</p>";
      // 검색 결과가 없는 경우에도 쿼리를 저장 (중복 요청 방지)
      searchResultsContainer.dataset.lastQuery = input.value;
      // searchResultsContainer.dataset.lastInputId = inputId;
      searchResultsContainer.classList.add("visible");
    }
  });
}
//더미데이터
//더미데이터
//더미데이터
export async function dumiSearch() {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const placeInputs = document.querySelectorAll(".placeInput input[type='text']");
  const dumiData = [
    { placeName: "수락산역", position: { lat: 37.678017, lng: 127.055218 }, placeId: "ChIJu5r4xti4fDURipdcST_0DmA" },
    { placeName: "노원역", position: { lat: 37.654688, lng: 127.060551 }, placeId: "ChIJv98ROkC5fDURcL4ufuuX1mk" },
    { placeName: "건대역", position: { lat: 37.539020, lng: 127.070159 }, placeId: "ChIJC7gU5uikfDURj6CjED_CmOk" },
    { placeName: "홍대역", position: { lat: 37.557723, lng: 126.924478 }, placeId: "ChIJ4d9T2emYfDURGK_RrkTeN0o" },
    { placeName: "강남역", position: { lat: 37.498595, lng: 127.030026 }, placeId: "ChIJKxs2jFmhfDURPP--kvKavw0" },
  ];
  placeInputs.forEach(input => {
    const selectedPlace = dumiData.find(data => data.placeName === input.value);
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
        const matchingPlace = dumiData.find(data => data.placeName === inputValue);
        if (matchingPlace) {
          positionSet.push(matchingPlace.position);
          document.querySelector(`#${placeInput.id.replace("placeName", "placeId")}`).value = matchingPlace.placeId;
        }
      }
    });
    // console.log("positionSet:", positionSet);

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
    });
  });
}



// 서버에서 검색된 장소 결과표시
// 서버에서 검색된 장소 결과표시
// 서버에서 검색된 장소 결과표시
async function displaySearchResults(places, inputId) {
  console.log("서버에서 검색된 장소 표시:", places);

  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const infoWindow = new google.maps.InfoWindow();

  currentPlaceInput = document.getElementById(inputId);

  const searchResults = document.querySelector("#searchResults");
  searchResults.innerHTML = '';

  places.forEach(place => {
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    resultItem.dataset.placeId = place.placeId;

    resultItem.innerHTML = `
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
    searchResults.appendChild(resultItem);

    const searchResultsContainer = document.querySelector("#searchResultsContainer");
    searchResultsContainer.classList.add("visible");
    const collapseButton = cacheElement("collapseButton", "#collapseButton");
    collapseButton.classList.add("expanded");

    // 검색 결과와 현재 검색어를 저장
    searchResultsContainer.dataset.lastQuery = place.value;

    const hidden = document.querySelectorAll(".placeINput input[type='hidden'][name='.placeId']")
    hidden.forEach(hiddenInput => {
      hiddenInput.value = place.placeId
    });
    //
    //
    //marker
    markerManager.clearMarkers();

    let location = { lat: place.latitude, lng: place.longitude };
    const markerElement = new AdvancedMarkerElement({
      map: getMapInstance(),
      position: location
    })
    markerElement.addListener('gmp-click', () => {
      infoWindow.setContent(content);
      infoWindow.open({
        anchor: markerElement,
        map: getMapInstance(),
      });
    });
    return markerManager.addMarker(markerElement);
  });

  const bounds = new google.maps.LatLngBounds();//bounds
  const markerPromises = places.map(async place => {
    bounds.extend({ lat: place.latitude, lng: place.longitude });
  });
  await Promise.all(markerPromises);
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
  console.log("검색 결과 표시 완료");
}

// initializePlaceEvents - input을 긁어서 searchPlaceByInputId를 실행 시키는 이벤트 붙여주기
// initializePlaceEvents - input을 긁어서 searchPlaceByInputId를 실행 시키는 이벤트 붙여주기
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
          event.preventDefault();
          console.log("Enter 눌렀음");
          console.log("장소 input:", input.value);

          try {
            //일단 내 서버를 통해서 검색 시도
            const searchTerm = input.value.trim();
            if (!searchTerm) {
              alert("검색어를 입력해주세요.");
              return;
            }
            const response = await fetch(`/places/search?name=${encodeURIComponent(searchTerm)}`);
            if (response.ok) {
              const places = await response.json();
              if (places && places.length > 0) {
                displaySearchResults(places, input);
                return;
              }
            }
            return
          }
          catch (error) {
            console.log("DB에 장소 데이터 없음 고로 구글 API요청 보냄", error);
            // searchPlaceByInputId(input.id);
            dumiSearch();
          }
          // searchPlaceByInputId(input.id); 
          //  돈 내기 시렁 더미 데이터로 대체하겠다
          //          dumiSearch();
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
      placeIdInput = cacheElement(`placeId${placeNum}`, `#placeId${placeNum}`); //이게 hidden input임
    }
    if (placeIdInput) {
      const prevValue = placeIdInput.value;
      placeIdInput.value = placeId; // hidden input에 placeId를 할당

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
      const searchResultsContainer = document.querySelector("#searchResultsContainer");
      searchResultsContainer.classList.remove("visible");
      console.log("searchResultsContainer.classList", searchResultsContainer.classList);
      const collapseButton = cacheElement("collapseButton", "#collapseButton");
      collapseButton.classList.remove("expanded");
    }
  }
  // });
}