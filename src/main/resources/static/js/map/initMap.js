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
  const { PlaceAutocompleteElement, Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places");

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
  const placeAutocomplete = new PlaceAutocompleteElement();
  placeAutocomplete.id = "place-autocomplete-input";

  const card = document.getElementById("autocomplete");
  card.appendChild(placeAutocomplete);

  placeAutocomplete.addEventListener("gmp-placeselect", async ({ place }) => {
    await place.fetchFields({
      fields: ["displayName", "formattedAddress", "location"],
    });
    if (place.viewport) {
      map.fitBounds(place.viewport);
    } else {
      map.setCenter(place.location);
      map.setZoom(17);
    }
    let content =
      `
      <div id="infowindow-content">
        <span id="place-displayname" class="title">${place.displayName}</span><br />
        <span id="place-address">${place.formattedAddress}</span>
      </div>
    `;

    updateInfoWindow(content, place.location);

    // 기존 마커 제거
    if (currentMarker) {
      currentMarker.setMap(null);
    }

    // 새로운 마커 추가
    const newMarker = await marker(map, place.location, infoWindow);
    if (newMarker) {
      currentMarker = newMarker; // 현재 마커 업데이트
    }
  });


  const searchButton = document.getElementById("searchFood");

  // 검색 버튼 클릭 이벤트
  searchButton.addEventListener("click", () => {
    nearbySearch(map, infoWindow);
  });

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