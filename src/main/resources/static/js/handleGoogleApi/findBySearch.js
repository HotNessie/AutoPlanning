//검색, marker, bound지정
import { markerManager, createMarker } from '../map/marker.js';
import { getMapInstance } from '../core/store.js';
import { searchPlacesByText } from '../core/apiService.js';

//TODO PlaceService로 바꾸면서 페이지네이션 추가
//Title - 장소 검색 (Google API)
/*
* @inputElementId 검색어가 입력된 input 필드의 id에서 value추출해서 검색
* @return places 검색된 장소 배열 반환
*/
export async function findBySearch(inputElementId) {
  console.log("findBySearch 실행");
  const map = getMapInstance();
  const input = document.querySelector(`#${inputElementId}`);
  const suggestion = document.querySelector('#suggestion');
  const inputText = input.value.trim();

  if (suggestion) {
    suggestion.style.display = "none";
  }

  const places = await searchPlacesByText(inputText);

  if (!places || places.length === 0) {
    alert("검색 결과가 없습니다.");
    return;
  }

  // 기존 마커 지우기
  markerManager.clearMarkers();

  //하나씩 마커 찍어주기
  const bounds = new google.maps.LatLngBounds();

  const markerPromises = places.map(async (place) => {
    // 마커 생성
    const marker = await createMarker(place, map);
    //zoom레벨 설정을 위한
    bounds.extend(place.location);
    return marker;
  });

  await Promise.all(markerPromises);

  if (map && !bounds.isEmpty()) {
    map.fitBounds(bounds, {
      top: 100,
      right: 100,
      bottom: 100,
      left: 100
    });
    google.maps.event.addListenerOnce(map, "bounds_changed", () => {
      if (map.getZoom() > 17) {
        map.setZoom(17);
      }
    });
  }

  return places;
}
