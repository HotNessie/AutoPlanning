//지도 기본 위치
//지도 기본 위치
let map, infoWindow;
let currentMarker = null;

import { marker } from './marker.js';
import { currentPosition } from './withPosition.js';
import { findPlaces } from './findPlaces.js';
import { nearbySearch } from './findNearPlaces.js';
import { getPlaceDetails } from './getPlaceDetails.js';

async function initMap() {

  const { Map } = await google.maps.importLibrary("maps");
  const { ColorScheme } = await google.maps.importLibrary("core");
  const { PlaceAutocompleteElement } = await google.maps.importLibrary("places");
  const { Place, AutocompleteSessionToken, AutocompleteSuggestion } =
    await google.maps.importLibrary("places");

  infoWindow = new google.maps.InfoWindow();

  const defaultPos = { lat: 37.65564466099954, lng: 127.06206796919646 };

  //Default(current) location  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      createMap(pos);
    }, () => {
      console.log("cannot get location");
      createMap(defaultPos);
    });  //현 위치 가져오기 실패하면..

  function createMap(position) {
    map = new Map(document.getElementById("map"),
      {
        center: position,
        zoom: 17,
        mapId: 'CURRENT_POS',
        language: 'ko',
        region: 'kr',
        //mapTypeId: google.maps.MapTypeId.TERRAIN,
        disableDefaultUI: true,
        colorScheme: ColorScheme.DARK
      }
    );
    marker(map, map.getCenter(), infoWindow);
    return map;
  }


  //---------------------AutoCompleteElement---------------------
  //---------------------AutoCompleteElement---------------------
  //---------------------AutoCompleteElement---------------------
  const token = new google.maps.places.AutocompleteSessionToken();
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", handleSearch);
  searchInput.addEventListener("keyup", handleEmptyInput);

  async function handleSearch() {
    const inputText = searchInput.value.trim();
    const resultsElement = document.getElementById("results");
    const suggestion = document.getElementById("suggestion");
    if (inputText === "") {
      suggestion.style.display = "none";
      return;
    }

    let request = {
      input: inputText,  // 사용자 입력 값
      language: 'ko',
      region: 'kr',
      origin: map.getCenter(),
      sessionToken: token
    };

    const { suggestions } = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

    // 기존 리스트 초기화
    resultsElement.innerHTML = "";

    suggestion.style.display = "inline";
    if (!suggestions || suggestions.length === 0) {
      suggestion.style.display = "none";
    }

    for (let suggestion of suggestions) {
      const placePrediction = suggestion.placePrediction;
      // 리스트 요소 생성 및 추가
      const listItem = document.createElement("li");
      const listItemButton = document.createElement("button");
      listItemButton.style.border = "none"
      listItemButton.style.backgroundColor = "transparent"
      listItem.textContent = placePrediction.text.toString();
      resultsElement.appendChild(listItemButton);
      listItemButton.appendChild(listItem);
    }

    let selectedIndex = -1; // 현재 선택된 추천 검색어의 인덱스

    searchInput.addEventListener("keydown", handleKeyDown);

    function handleKeyDown(event) {
      const items = document.querySelectorAll("#results button"); // 모든 추천 버튼 가져오기

      if (items.length === 0) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length; // 다음 항목 선택
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length; // 이전 항목 선택
      } else if (event.key === "Enter" && selectedIndex >= 0) {
        event.preventDefault();
        // items[selectedIndex].click(); // 선택된 항목 클릭
        searchInput.value = items[selectedIndex].textContent; // 선택된 추천어 입력창에 반영
        resultsElement.innerHTML = ""; // 추천 목록 제거
        suggestion.style.display = "none";
        selectedIndex = -1; // 선택 초기화
      }

      items.forEach((item, index) => {
        if (index === selectedIndex) {
          item.style.backgroundColor = "rgb(36,36,36)";
        } else {
          item.style.backgroundColor = "transparent";
        }
      });
    }

    // 클릭하면 검색창에 반영
    resultsElement.addEventListener("click", handleSelection);

    //추천 검색어 이벤트
    function handleSelection(event) {
      if (event.target.tagName === "LI") {
        searchInput.value = event.target.textContent;
        suggestion.style.display = "none";
        selectedIndex = -1; // 선택 초기화
      }
    };

    //TODO: 리스트 혹은 검색버튼 눌렀을 때, 세션 재발급 시켜줘야 함
  }

  async function handleEmptyInput() {
    const resultsElement = document.getElementById("results");
    const suggestion = document.getElementById("suggestion");
    if (searchInput.value.trim() === "") {
      suggestion.style.display = "none"; // 입력값이 비면 바로 숨김
      resultsElement.innerHTML = "";
    }
  }


  // const placeAutocomplete = new PlaceAutocompleteElement();
  // placeAutocomplete.id = "place-autocomplete-input";

  // const card = document.getElementById("autocomplete");
  // card.appendChild(placeAutocomplete);

  // placeAutocomplete.addEventListener("gmp-placeselect", async ({ place }) => {
  //   await place.fetchFields({
  //     fields: ["displayName", "formattedAddress", "location"],
  //   });
  //   if (place.viewport) {
  //     map.fitBounds(place.viewport);
  //   } else {
  //     map.setCenter(place.location);
  //     map.setZoom(17);
  //   }
  //   let content =
  //     `
  //     <div id="infowindow-content">
  //       <span id="place-displayname" class="title">${place.displayName}</span><br />
  //       <span id="place-address">${place.formattedAddress}</span>
  //     </div>
  //   `;

  //   updateInfoWindow(content, place.location);

  //   // 기존 마커 제거
  //   if (currentMarker) {
  //     currentMarker.setMap(null);
  //   }

  //   // 새로운 마커 추가
  //   const newMarker = await marker(map, place.location, infoWindow);
  //   if (newMarker) {
  //     currentMarker = newMarker; // 현재 마커 업데이트
  //   }
  // });


  // const searchButton = document.getElementById("searchFood");

  // // 검색 버튼 클릭 이벤트
  // searchButton.addEventListener("click", () => {
  //   nearbySearch(map, infoWindow);
  // });

  //---------------------------------------------------
  //---------------------------------------------------
  //---------------------------------------------------
  //커스텀 버튼 모음
  //현재위치 버튼
  const locationButton = document.querySelector(".customCurrentPosition");
  const customZoomInButton = document.querySelector(".customZoomIn");
  const customZoomOutButton = document.querySelector(".customZoomOut");

  //현재위치 이동 이벤트 리스너
  locationButton.addEventListener("click", () => currentPosition(map, infoWindow));

  //zoomin
  customZoomInButton.addEventListener("click", () => {
    map.setZoom(map.getZoom() + 2);
  });
  //zoomout
  customZoomOutButton.addEventListener("click", () => {
    map.setZoom(map.getZoom() - 2);
  });
}
function updateInfoWindow(content, center) {
  infoWindow.setContent(content);
  infoWindow.setPosition(center);
  infoWindow.open({
    map,
    // anchor: marker,
    shouldFocus: false,
  });
}

initMap();