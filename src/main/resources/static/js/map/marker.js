// 마커 관련 기능을 모두 한곳에서 관리하는 모듈

// 일반 검색 결과용 마커 생성
export async function marker(map, place) {
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

  // const scaleElement = new PinElement({
  // scale: 2,
  // });

  const infoWindow = new google.maps.InfoWindow();

  // 장소 정보에서 사진 가져오기
  let photoHtml = "";
  if (place.photos && place.photos.length > 0) {
    try {
      const photoUri = await place.photos[0].getURI({ maxWidth: 150, maxHeight: 150 });
      photoHtml = `<img src="${photoUri}" alt="${place.displayName}" style="width:150px;height:auto;margin-bottom:8px;">`;
    } catch (error) {
      console.warn("사진을 가져오는 데 실패했습니다:", error);
    }
  }

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
    position: place.location,
    map: map,
    title: place.displayName,
    // gmpClickable: true,
    // gmpDraggable: true,
    // content: scaleElement.element
  });

  // 'gmp-click' 이벤트 사용
  markerElement.addListener('gmp-click', () => {
    infoWindow.setContent(content);
    infoWindow.open({
      anchor: markerElement,
      map: map
    });
  });

  // 'gmp-mouseover' 이벤트
  markerElement.addListener('gmp-mouseover', () => {
    infoWindow.setContent(content);
    infoWindow.open({
      anchor: markerElement,
      map: map
    });
  });

  // 'gmp-mouseout' 이벤트
  markerElement.addListener("gmp-mouseout", () => {
    infoWindow.close();
  });

  return markerElement;
}

// placeId로 마커 생성 (경로 계획에 사용) 
export async function createMarkerForPlace(placeId, placeName, map) {
  try {
    // Geocoder 인스턴스 생성
    const geocoder = new google.maps.Geocoder();

    // Geocoder로 placeId를 좌표로 변환
    const result = await new Promise((resolve, reject) => {
      geocoder.geocode({ 'placeId': placeId }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            resolve(results[0]);
          } else {
            reject(new Error('No results found'));
          }
        } else {
          reject(new Error(`Geocoder failed: ${status}`));
        }
      });
    });

    // Places API를 사용하여 장소에 대한 더 자세한 정보 가져오기
    const placesService = new google.maps.places.PlacesService(map);
    const placeDetails = await new Promise((resolve, reject) => {
      placesService.getDetails(
        { placeId: placeId, fields: ['name', 'formatted_address', 'rating', 'user_ratings_total', 'photos'] },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(place);
          } else {
            // 상세 정보를 가져오지 못해도 기본 정보로 진행
            resolve({
              name: placeName || result.formatted_address,
              formatted_address: result.formatted_address
            });
          }
        }
      );
    });

    // 마커 생성
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const markerElement = new AdvancedMarkerElement({
      map: map,
      position: result.geometry.location,
      title: placeDetails.name || placeName || result.formatted_address
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
          <strong style="color:#c154ec;">${placeDetails.name || placeName}</strong>
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
  } catch (error) {
    console.error('마커 생성 중 오류:', error);
    return null;
  }
}

// 마커 관리 클래스
export class MarkerManager {
  constructor() {
    this.markers = [];
    this.placeMarkers = {}; // placeId를 키로 하는 마커 객체 저장
  }

  // 일반 마커 지우기
  clearMarkers() {
    if (this.markers.length > 0) {
      this.markers.forEach((marker) => { marker.map = null; });
    }
    this.markers = [];
  }

  // placeId 기반 마커 지우기
  clearAllPlaceMarkers() {
    for (const placeId in this.placeMarkers) {
      if (this.placeMarkers[placeId]) {
        this.placeMarkers[placeId].map = null;
      }
    }
    this.placeMarkers = {};
    console.log("모든 장소 마커가 지워졌습니다.");
  }

  // 모든 마커 지우기
  clearAll() {
    this.clearMarkers();
    this.clearAllPlaceMarkers();
  }

  // 마커 추가
  addMarker(marker) {
    this.markers.push(marker);
    return marker;
  }

  // placeId 기반 마커 추가
  addPlaceMarker(placeId, marker) {
    // 이전에 같은 placeId로 등록된 마커가 있으면 제거
    this.removePlaceMarker(placeId);
    this.placeMarkers[placeId] = marker;
    return marker;
  }

  // placeId 기반 마커 제거
  removePlaceMarker(placeId) {
    if (this.placeMarkers[placeId]) {
      this.placeMarkers[placeId].map = null;
      delete this.placeMarkers[placeId];
      return true;
    }
    return false;
  }

  // 사용하지 않는 마커 제거
  removeUnusedMarkers(usedPlaceIds) {
    for (const placeId in this.placeMarkers) {
      if (!usedPlaceIds.includes(placeId)) {
        this.removePlaceMarker(placeId);
      }
    }
  }
}

// 글로벌 마커 매니저 인스턴스 생성
export const markerManager = new MarkerManager();

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