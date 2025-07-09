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





// 일반 검색 결과용 마커 생성
//fields를 불러온 상태에서 사용하는 marker, displayname 지우는거 고려해보셈
export async function createMarker(place, map = getMapInstance()) {
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

  const markerElement = new AdvancedMarkerElement({
    map: getMapInstance(),
    position: place.location,
    title: place.displayName,
  });

  // 'gmp-click' 이벤트 사용
  markerElement.addListener('gmp-click', () => {
    infoWindow.setContent(content);
    infoWindow.open({
      anchor: markerElement,
      map: getMapInstance(),
    });
  });

  // // 'gmp-mouseover' 이벤트 -- 이거 안됨;;;;;;
  // markerElement.addListener('gmp-mouseover', () => {
  //   infoWindow.setContent(content);
  //   infoWindow.open({
  //     anchor: markerElement,
  //     map: map
  //   });
  // });

  // // 'gmp-mouseout' 이벤트
  // markerElement.addListener("gmp-mouseout", () => {
  //   infoWindow.close();
  // });

  // return markerElement;

  return markerManager.addMarker(markerElement);
}




//TODO: 조정 필요
// 모든 마커가 지도에 표시되도록 경계 설정
export function fitAllMarkers() {
  // 현재 등록된 모든 placeId 수집
  const placeIdInputs = document.querySelectorAll('input[type="hidden"][name$=".placeId"]');
  const validPlaceIds = Array.from(placeIdInputs)
    .filter(input => input.value) // 값이 있는 input만 선택
    .map(input => input.value);    // placeId 값만 추출

  // 마커 매니저에서 해당 placeId의 마커 위치 가져오기
  if (window.markerManager && Object.keys(window.markerManager.placeMarkers).length > 0) {
    const bounds = new google.maps.LatLngBounds();
    let hasValidMarkers = false;

    // 각 마커를 경계에 추가
    for (const placeId of validPlaceIds) {
      const marker = window.markerManager.placeMarkers[placeId];
      if (marker && marker.position) {
        bounds.extend(marker.position);
        hasValidMarkers = true;
      }
    }

    if (hasValidMarkers) {
      // 경계에 맞춰 지도 조정 (약간의 패딩 추가)
      window.map.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
      });

      // 줌 레벨이 너무 높을 경우 (단일 마커 또는 가까운 마커들) 최대 줌 제한
      google.maps.event.addListenerOnce(window.map, 'bounds_changed', function () {
        if (window.map.getZoom() > 16) {
          window.map.setZoom(16);
        }
      });
    }
  }
}

// 단일 마커 생성 (서버 데이터용)
// 단일 마커 생성 (서버 데이터용)
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