//지도 기본 위치
//지도 기본 위치
let map, infoWindow;
let markers = [];
let currentMarker = null;

import { marker } from './marker.js';
import { currentPosition } from './withPosition.js';
import { findPlaces } from './findPlaces.js';
import { nearbySearch } from './findNearPlaces.js';
import { getPlaceDetails } from './getPlaceDetails.js';

async function initMap() {

  const { Map } = await google.maps.importLibrary("maps");
  const { ColorScheme } = await google.maps.importLibrary("core");
  const { PlaceAutocompleteElement, PlacesService, Autocomplete } = await google.maps.importLibrary("places");

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
  //-----------------------------------------
  //-----------------------------------------
  //-----------AutoCompleteElement-----------
  const placeAutocomplete = new PlaceAutocompleteElement();
  placeAutocomplete.id = "place-autocomplete-input";

  const placesService = new PlacesService(map);

  const card = document.getElementById("autocomplete");
  card.appendChild(placeAutocomplete);

  const searchButton = document.createElement("button");
  searchButton.textContent = "검색";
  card.appendChild(searchButton);

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

    searchButton.addEventListener("click", () => {
      const keyword = card.value.trim();
      if (keyword) {
        searchNearbyPlaces(placesService, place.location, keyword);
      }
    });

  })

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

function searchNearbyPlaces(placesService, location, keyword) {
  // 기존 마커 제거
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  // 장소 검색 요청
  const request = {
    location: location,
    radius: 1000, // 1km 반경
    query: keyword, // 검색 키워드 (예: 맛집)
  };

  placesService.textSearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(place => {
        const marker = new google.maps.Marker({ //내 마커로 변경
          position: place.geometry.location,
          map: map,
          title: place.name,
        });

        // 마커 클릭 시 정보창 표시
        marker.addListener("click", () => {
          infoWindow.setContent(`
                      <div>
                          <strong>${place.name}</strong><br>
                          ${place.formatted_address}
                      </div>
                  `);
          infoWindow.open(map, marker);
        });

        markers.push(marker);
      });

      // 검색 결과가 있다면 지도를 첫 번째 결과 위치로 이동
      if (results.length > 0) {
        map.setCenter(results[0].geometry.location);
      }
    } else {
      console.error("검색 실패:", status);
    }
  });
}
initMap();