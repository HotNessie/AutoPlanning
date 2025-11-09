// 마커 관련 기능을 모두 한곳에서 관리하는 모듈
import { getMapInstance } from "../store/map-store.js";

// 마커 관리 클래스
class MarkerManager {
  static instance = null;
  markers = [];
  placeMarkers = {};

  constructor() {
    if (MarkerManager.instance) return MarkerManager.instance;
    MarkerManager.instance = this;
  }

  // 마커 추가
  addMarker(marker) {
    this.markers.push(marker);
    return marker;
  }

  addPlaceMarker(placeId, marker) {
    this.placeMarkers[placeId] = marker;
    return this.addMarker(marker);
  }

  removePlaceMarker(placeId) {
    const marker = this.placeMarkers[placeId];
    if (marker) {
      marker.setMap(null);
      this.markers = this.markers.filter(m => m !== marker);
      delete this.placeMarkers[placeId];
    }
  }

  removeUnusedMarkers(currentPlaceIds) {
    Object.keys(this.placeMarkers).forEach(placeId => {
      if (!currentPlaceIds.includes(placeId)) {
        this.removePlaceMarker(placeId);
      }
    });
  }

  // 일반 마커 지우기
  clearMarkers() {
    // this.markers.forEach((marker) => { marker.map = null; }); //확인 필요
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
    this.placeMarkers = {};
  }

  getMarkers() {
    return this.markers;
  }
}

// 글로벌 마커 매니저 인스턴스 생성
export const markerManager = new MarkerManager();





//Title - createMarker
// 일반 검색 결과용 마커 생성
//fields를 불러온 상태에서 사용하는 marker
export async function createMarker(place, map, index = null) {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const infoWindow = new google.maps.InfoWindow();

  // 장소 정보에서 사진 가져오기
  let photoHtml = place.photos?.length > 0
    ? `<img src="${await place.photos[0].getURI({ maxWidth: 150, maxHeight: 150 })}" alt="${place.displayName}" style="width:150px;height:auto;margin-bottom:8px;">`
    : "";

  // 인포윈도우 내용 설정
  const content = `
    <div style="padding: 5px; max-width: 250px;">
      ${photoHtml}
      <div style="font-size:14px; line-height:1.5;">
        <strong style="color:#c154ec;">${place.displayName}</strong>
        ${place.formattedAddress ? `<p style="margin: 5px 0; font-size: 12px;">${place.formattedAddress}</p>` : ''}
        ${place.rating ? `<div>★ ${place.rating.toFixed(1)} (${place.userRatingCount || 0})</div>` : ''}
      </div>
    </div>
  `;

  let markerOptions = {
    map: map,
    position: place.location,
    title: place.displayName,
  };

  if (index !== null) {
    const markerContent = document.createElement('div');
    markerContent.innerHTML = `
      <div style="width: 32px; height: 32px; position: relative; display: flex; align-items: center; justify-content: center;">
        <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
          <path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
        </svg>
        <span style="position: absolute; top: 35%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 14px; font-weight: bold;">
          ${index}
        </span>
      </div>
    `;
    markerOptions.content = markerContent;
  }

  const markerElement = new AdvancedMarkerElement(markerOptions);

  // 'gmp-click' 이벤트 사용
  markerElement.addListener('gmp-click', () => {
    infoWindow.setContent(content);
    infoWindow.open({
      anchor: markerElement,
      map: map,
    });
  });

  return markerManager.addMarker(markerElement);
}

//Title - fitAllMarkers
// 모든 마커가 지도에 표시되도록 경계 설정
export function fitAllMarkers() {
  const map = getMapInstance();
  const allMarkers = markerManager.getMarkers();

  if (!allMarkers || allMarkers.length === 0) {
    return;
  }

  const bounds = new google.maps.LatLngBounds();
  let validMarkersFound = 0;

  allMarkers.forEach(marker => {
    if (marker.position) {
      bounds.extend(marker.position);
      validMarkersFound++;
    }
  });

  if (validMarkersFound > 0) {
    map.fitBounds(bounds, 50); // 50px padding

    google.maps.event.addListenerOnce(map, 'bounds_changed', function () {
      if (map.getZoom() > 16) {
        map.setZoom(16);
      }
    });
  }
}

//Title - createServerMarker 단일 마커 생성
// 단일 마커 생성 (서버 데이터용)
export async function createServerMarker(place) {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const infoWindow = new google.maps.InfoWindow();

  const location = { lat: place.latitude, lng: place.longitude };
  const markerElement = new AdvancedMarkerElement({
    map: getMapInstance(),
    position: location
  });

  const content = `
    <div style="padding: 5px; max-width: 250px;">
      <div style="font-size:14px; line-height:1.5;">
        <strong style="color:#c154ec;">${place.name}</strong>
        <p style="margin: 5px 0; font-size: 12px;">${place.address}</p>
      </div>
    </div>
  `;

  markerElement.addListener('gmp-click', () => {
    infoWindow.setContent(content);
    infoWindow.open({
      anchor: markerElement,
      map: getMapInstance(),
    });
  });

  return markerElement;
}

// 지도 경계 조정
// 지도 경계 조정
export function adjustMapBounds(places, isServerData = true) {
  const bounds = new google.maps.LatLngBounds();

  places.forEach(place => {
    if (isServerData) {
      bounds.extend({ lat: place.latitude, lng: place.longitude });
    } else {
      bounds.extend(place.location);
    }
  });

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
}



//여기 marker랑 완전히 같은 부분이 있는데 marker호출해서 사용하면 될 듯
// placeId로 마커 생성 - 저장된 계획에 marker 생성용
// placeId로 마커 생성 - 저장된 계획에 marker 생성용
// placeId로 마커 생성 - 저장된 계획에 marker 생성용
export async function createMarkerForPlaceId(placeId) {
  // Geocoder 인스턴스 생성
  const geocoder = new google.maps.Geocoder();


  try {
    const placesService = new google.maps.places.Place({ id: placeId });
    const placeDetails = await placesService.fetchFields({
      fields: ['geometry', 'displayName', 'formattedAddress', 'rating', 'userRatingCount', 'photos']
    });
    if (placeDetails.location) {
      return await createMarker(placeDetails, getMapInstance());
    }
  } catch (errer) {
    console.error("장소 세부 정보 가져오기 실패:", errer);
    return null;
  }
}