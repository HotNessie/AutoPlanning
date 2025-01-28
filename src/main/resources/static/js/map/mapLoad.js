//지도 기본 위치
//지도 기본 위치
let map, infoWindow;

import { marker } from './marker.js';
import { findPlaces } from './findPlaces.js';
import { nearbySearch } from './findNearPlaces.js';
import { getPlaceDetails } from './getPlaceDetails.js';
import { initAutocomplete } from './autocomplete.js';



async function initMap() {

  const { Map } = await google.maps.importLibrary("maps");
  const { ColorScheme } = await google.maps.importLibrary("core");

  const position = { lat: 37.65564466099954, lng: 127.06206796919646 };

  //Default location  
  map = new Map(document.getElementById("map"),
    {
      center: position,
      zoom: 17,
      mapId: 'DEMO_MAP_ID',
      language: 'ko',
      region: 'kr',
      //            mapTypeId: google.maps.MapTypeId.TERRAIN,
      disableDefaultUI: true,
      colorScheme: ColorScheme.DARK
    }
  );

  infoWindow = new google.maps.InfoWindow();

  //현재위치 버튼
  //현재위치 버튼
  const locationButton = document.querySelector(".customCurrentPosition");
  const customZoomInButton = document.querySelector(".customZoomIn");
  const customZoomOutButton = document.querySelector(".customZoomOut");

  //현재위치 이동 이벤트 리스너
  //현재위치 이동 이벤트 리스너
  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");

          infoWindow.open(map);
          //                      map.setCenter(pos);
          map.panTo(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

  customZoomInButton.addEventListener("click", () => {
    map.setZoom(map.getZoom() + 1);
  });

  customZoomOutButton.addEventListener("click", () => {
    map.setZoom(map.getZoom() - 1);
  });

  marker(map, infoWindow);
  findPlaces(map,);
  nearbySearch(map,);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : 'Error: Your browser doesn\'t support geolocation.'
  );
  infoWindow.open(map);
}

initMap();