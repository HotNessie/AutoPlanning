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
// export async function createMarker(map, place) {
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









//여기 marker랑 완전히 같은 부분이 있는데 marker호출해서 사용하면 될 듯
// placeId로 마커 생성 (경로 계획에 사용) 
export async function createMarkerForPlace(placeId, map) {
  // Geocoder 인스턴스 생성
  const geocoder = new google.maps.Geocoder();

  // // Geocoder로 placeId를 좌표로 변환
  // const result = await new Promise((resolve, reject) => {
  //   geocoder.geocode({ 'placeId': placeId }, (results, status) => {
  //     if (status === google.maps.GeocoderStatus.OK) {
  //       if (results[0]) {
  //         resolve(results[0]);
  //       } else {
  //         reject(new Error('No results found'));
  //       }
  //     } else {
  //       reject(new Error(`Geocoder failed: ${status}`));
  //     }
  //   });
  // });

  // Places API를 사용하여 장소에 대한 더 자세한 정보 가져오기
  const placesService = new google.maps.places.Place({ id: placeId });
  const placeDetails = await placesService.fetchFields(
    {
      fields: [
        'displayName',
        'formattedAddress',
        'rating',
        'userRatingCount',
        'photos']
    }
  );

  // 마커 생성
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const markerElement = new AdvancedMarkerElement({
    map: map,
    position: result.geometry.location,
    title: placeDetails.name || result.formatted_address
  });

  // 인포윈도우 생성
  const infoWindow = new google.maps.InfoWindow();

  // 인포윈도우 내용 설정
  let photoHtml = '';
  if (placeDetails.photos && placeDetails.photos.length > 0) {
    const photoUrl = placeDetails.photos[0].getUrl({ maxWidth: 150, maxHeight: 150 });
    photoHtml = `<img src="${photoUrl}" alt="${placeDetails.name}" style="width:150px;height:auto;margin-bottom:8px;">`;
  }

  const content = `
      <div style="padding: 5px; max-width: 250px;">
        ${photoHtml}
        <div style="font-size:14px; line-height:1.5;">
          <strong style="color:#c154ec;">${placeDetails.name}</strong>
          ${placeDetails.formatted_address ? `<p style="margin: 5px 0; font-size: 12px;">${placeDetails.formatted_address}</p>` : ''}
          ${placeDetails.rating ? `<div>★ ${placeDetails.rating.toFixed(1)} (${placeDetails.user_ratings_total || 0})</div>` : ''}
        </div>
      </div>
    `;

  // 'gmp-click' 이벤트 리스너 추가
  markerElement.addListener('gmp-click', () => {
    infoWindow.setContent(content);
    infoWindow.open({
      anchor: markerElement,
      map: map
    });
  });

  return markerElement;
}