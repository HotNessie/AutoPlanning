//지도 기본 위치
//지도 기본 위치
import { handleSearch } from './handlingSearch/handleSearch.js';
import { findBySearch } from './handlingSearch/findBySearch.js';
import { selectSuggestion, handleEmptyInput, handleSelection } from './handlingSearch/selectSuggestionEvent.js';

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
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");


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
        mapId: '281ecb2de2a0840c',
        // mapId: 'CURRENT_POS',
        language: 'ko',
        region: 'kr',
        disableDefaultUI: true,
        colorScheme: ColorScheme.DARK,
      }
    );
    // marker(map, map.getCenter(), "NOW", infoWindow, content);

    const parser = new DOMParser();
    // A marker with a custom inline SVG.
    const pinSvgString =
      `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <g fill="#c7d5ef">
          <circle cx="24" cy="24" r="12" fill-opacity="0.5"/>
        </g>
        <g fill="#fff">
          <circle cx="24" cy="24" r="6.5"/>
        </g>
        <g fill="#4284f4">
          <circle cx="24" cy="24" r="6"/>
        </g>
      </svg>
      `;
    const currentSvg = parser.parseFromString(
      pinSvgString,
      "image/svg+xml",
    ).documentElement;

    const currentPosMarker = new AdvancedMarkerElement({
      position: map.getCenter(),
      map: map,
      content: currentSvg,
    })
    return map;
  }


  //---------------------AutoComplete---------------------
  //---------------------AutoComplete---------------------
  //---------------------AutoComplete---------------------
  const token = new AutocompleteSessionToken();
  const searchInput = document.getElementById("searchInput");

  //개발단계에서 너무 많은 api요청으로 임시 주석
  //개발단계에서 너무 많은 api요청으로 임시 주석
  //개발단계에서 너무 많은 api요청으로 임시 주석
  //개발단계에서 너무 많은 api요청으로 임시 주석
//   searchInput.addEventListener("input", () => handleSearch(AutocompleteSuggestion, token, map));

  const searchButton = document.getElementById('searchButton');

  searchInput.addEventListener("keydown", selectSuggestion);
  searchInput.addEventListener("keyup", handleEmptyInput);
  // const suggestion = document.getElementById("suggestion");

  //searchButton을 통해 searchInput의 텍스트를 검색
  searchButton.addEventListener("click", () => findBySearch(Place, map, infoWindow));
  // resultsElement.addEventListener("click", handleSelection);


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