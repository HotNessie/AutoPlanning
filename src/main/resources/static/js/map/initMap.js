//지도 기본 위치
//지도 기본 위치
let map, infoWindow;

import { marker } from './marker.js';
import { currentPosition } from './withPosition.js';
import { findPlaces } from './findPlaces.js';
import { nearbySearch } from './findNearPlaces.js';

async function initMap() {

  const { Map } = await google.maps.importLibrary("maps");
  const { ColorScheme } = await google.maps.importLibrary("core");
  const { Place, SearchNearbyRankPreference, AutocompleteSessionToken, AutocompleteSuggestion } =
    await google.maps.importLibrary("places");

  infoWindow = new google.maps.InfoWindow();

  //이거 기본값 어디인거임...?
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
    marker(map, map.getCenter(), "NOW", infoWindow);
    return map;
  }


  //---------------------AutoComplete---------------------
  //---------------------AutoComplete---------------------
  //---------------------AutoComplete---------------------
  const token = new AutocompleteSessionToken();
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", handleSearch);

  const suggestion = document.getElementById("suggestion");

  async function handleSearch() {
    const inputText = searchInput.value.trim();
    const resultsElement = document.getElementById("results");
    // const suggestion = document.getElementById("suggestion");
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

    const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

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
    //---------------------------------------------------
    //---------------------------------------------------
    //---------------------------------------------------
    //---------------------------------------------------
    //---------------------------------------------------
    let selectedIndex = -1; // 현재 선택된 추천 검색어의 인덱스

    //자동완성 텍스트 선택 이벤트
    searchInput.addEventListener("keydown", selectSuggestion);
    searchInput.addEventListener("keyup", handleEmptyInput);

    //---------------------------------------------------
    //---------------------------------------------------
    //---------------------------------------------------
    //---------------------------------------------------
    //---------------------------------------------------
    function selectSuggestion(event) {
      const items = document.querySelectorAll("#results button"); // 모든 추천 버튼 가져오기

      if (items.length === 0) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if ((selectedIndex + 1) < items.length) {
          selectedIndex = (selectedIndex + 1); // 다음 항목 선택
        } else if (selectedIndex + 1 === items.length) {
          selectedIndex = 0;
        }
        console.log(selectedIndex);
        console.log();

        // selectedIndex = (selectedIndex + 1) % items.length; // 다음 항목 선택
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if ((selectedIndex - 1) === -2) {
          selectedIndex = items.length - 1;
        } else if (selectedIndex > -2 || selectedIndex < items.length) {
          selectedIndex = (selectedIndex - 1); // 이전 항목 선택
        }
        console.log(selectedIndex);
        console.log();

      } else if (event.key === "Enter" && selectedIndex >= 0) {
        event.preventDefault();
        // items[selectedIndex].click(); // 선택된 항목 클릭
        searchInput.value = items[selectedIndex].textContent; // 선택된 추천어 입력창에 반영
        resultsElement.innerHTML = ""; // 추천 목록 제거
        suggestion.style.display = "none";
        selectedIndex = -1; // 선택 초기화
      }
      //focuse 효과
      items.forEach((item, index) => {
        if (index === selectedIndex) {
          item.style.backgroundColor = "rgb(36,36,36)";
        } else {
          item.style.backgroundColor = "transparent";
        }
      });
    }
    //---------------------------------------------------
    //---------------------------------------------------
    //---------------------------------------------------
    //---------------------------------------------------
    //---------------------------------------------------
    // 클릭하면 검색창에 반영
    resultsElement.addEventListener("click", handleSelection);
    //---------------------------------------------------
    //---------------------------------------------------
    //---------------------------------------------------
    //---------------------------------------------------
    //---------------------------------------------------
    //추천 검색어 이벤트
    function handleSelection(event) {
      if (event.target.tagName === "LI") {
        searchInput.value = event.target.textContent;
        suggestion.style.display = "none";
        selectedIndex = -1; // 선택 초기화
      }
    };
    //---------------------------------------------------
    //---------------------------------------------------
    //---------------------------------------------------
    //---------------------------------------------------
    //---------------------------------------------------
    //TODO: 리스트 혹은 검색버튼 눌렀을 때, 세션 재발급 시켜줘야 함
  }
  //---------------------------------------------------
  //---------------------------------------------------
  //---------------------------------------------------
  //---------------------------------------------------
  //---------------------------------------------------
  //input이 비어있으면 display = none
  async function handleEmptyInput() {
    const resultsElement = document.getElementById("results");
    const suggestion = document.getElementById("suggestion");
    if (searchInput.value.trim() === "") {
      suggestion.style.display = "none";
      resultsElement.innerHTML = "";
    }
  }

  //searchButton을 통해 searchInput의 텍스트를 검색
  const searchButton = document.getElementById('searchButton');
  searchButton.addEventListener("click", findBySearch);

  let markers = [];
  async function findBySearch() {
    const inputText = searchInput.value.trim(); // 검색어 가져오기
    suggestion.style.display = "none";

    if (inputText === "") {
      alert("검색어를 입력해주세요.");
      return;
    }
    //요청 정보
    const request = {
      textQuery: inputText, // 검색어
      fields: ["displayName", "location", "businessStatus"], // 가져올 필드
      maxResultCount: 20,
      // useStrictTypeFiltering: true, //빡씬 제한 (includedType를 기준으로 제한하는거임)
    };

    const { places } = await Place.searchByText(request);

    clearMarkers();
    //하나씩 마커 찍어주기
    if (places.length) {
      // console.log(places);
      places.forEach(async (place) => {
        console.log(place.displayName);
        // console.log(place.position);
        const newMarker = await marker(map, place.location, place.displayName, infoWindow);
        markers.push(newMarker);
      });
    } else {
      alert("검색 결과가 없습니다.");
    }


    //기존 마커 삭제
    function clearMarkers() {
      if (markers.length > 0) {
        markers.forEach((marker) => { marker.setMap(null); })
      }
      markers = [];
    }
  }
  //---------------------------------------------------
  //---------------------------------------------------
  //---------------------------------------------------
  //---------------------------------------------------
  //---------------------------------------------------

  //커스텀 버튼 모음
  //현재위치 버튼
  const locationButton = document.querySelector(".customCurrentPosition");
  const customZoomInButton = document.querySelector(".customZoomIn");
  const customZoomOutButton = document.querySelector(".customZoomOut");

  //현재위치
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