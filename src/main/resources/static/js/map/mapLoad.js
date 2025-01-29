//지도 기본 위치
//지도 기본 위치
let map, infoWindow;

import { marker } from './marker.js';
import { findPlaces } from './findPlaces.js';
import { nearbySearch } from './findNearPlaces.js';
import { getPlaceDetails } from './getPlaceDetails.js';



async function initMap() {

  const { Map } = await google.maps.importLibrary("maps");
  const { ColorScheme } = await google.maps.importLibrary("core");
  const { Autocomplete } = await google.maps.importLibrary("places");

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
    return map;
  }

  //-----------------------------------------
  //-----------------------------------------
  //-----------------------------------------
  const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement();
  placeAutocomplete.id = "place-autocomplete-input";

  const card = document.getElementById("autocomplete");
  card.appendChild(placeAutocomplete);

  // infoWindow = new google.maps.InfoWindow();

  //커스텀 버튼 모음
  //현재위치 버튼
  //현재위치 버튼
  const locationButton = document.querySelector(".customCurrentPosition");
  const customZoomInButton = document.querySelector(".customZoomIn");
  const customZoomOutButton = document.querySelector(".customZoomOut");

  //현재위치 이동 이벤트 리스너
  locationButton.addEventListener("click", () => currentPosition(map));

  //zoomin
  customZoomInButton.addEventListener("click", () => {
    map.setZoom(map.getZoom() + 1);
  });
  //zoomout
  customZoomOutButton.addEventListener("click", () => {
    map.setZoom(map.getZoom() - 1);
  });
}

//-----------------------------------------
//-----------------------------------------
//-----------------------------------------
function updateInfoWindow(content, center) {
  infoWindow.setContent(content);
  infoWindow.setPosition(center);
  infoWindow.open({
    map,
    anchor: marker,
    shouldFocus: false,
  });
}
//현 위치 정의
function currentPosition(map) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setZoom(18);
        map.setCenter(pos);

        let content =
          '<div id="infowindow-content">' +
          '<span id="place-displayname" class="title">' +
          "currentPosition" +
          "</span>" +
          "</div>";

        updateInfoWindow(content, pos);
      },
    );
  }
}

// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//   infoWindow.setPosition(pos);
//   infoWindow.setContent(
//     browserHasGeolocation
//       ? 'Error: The Geolocation service failed.'
//       : 'Error: Your browser doesn\'t support geolocation.'
//   );
//   infoWindow.open(map);
// }

initMap();