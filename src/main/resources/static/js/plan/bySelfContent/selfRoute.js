import { getMapInstance } from "../../store/map-store.js";

//RouteManager 클래스
//RouteManager 클래스
//RouteManager 클래스
class RouteManager {
  static instance = null;
  routePolylines = [];

  constructor() {
    if (RouteManager.instance) return RouteManager.instance;
    RouteManager.instance = this;
  }

  // 경로 추가
  addRoute(polyline) {
    this.routePolylines.push(polyline);
    return polyline;
  }

  // 경로 제거
  removeRoute(polyline) {
    polyline.setMap(null);
    this.routePolylines = this.routePolylines.filter(p => p !== polyline);
  }

  // 모든 경로 제거
  clearRoutes() {
    this.routePolylines.forEach(polyline => polyline.setMap(null));
    this.routePolylines = [];
  }
  //경로 가져오기
  getRoutes() {
    return this.routePolylines;
  }
}

export const routeManager = new RouteManager();

// 경로 순서 조정 함수 (selfContent.js에서 이동)
// 경로 순서 조정 함수 (selfContent.js에서 이동)
// 경로 순서 조정 함수 (selfContent.js에서 이동)
export function adjustPlaceIndices() { // 만약 단일경로 추가같은 기능이 필요하다면 개선 필요
  const placeContainer = document.querySelector('#placeContainer');
  const allPlaceInputs = placeContainer.querySelectorAll('.placeInput');
  const totalPlaces = allPlaceInputs.length;

  // 모든 장소 input 태그에 대해 인덱스 재조정
  allPlaceInputs.forEach((placeDiv, index) => {
    const isEnd = placeDiv.id === "placeEnd";
    const actualIndex = isEnd ? totalPlaces - 1 : index; // 도착지는 항상 마지막 인덱스

    const updateName = (selector, suffix) => {
      const input = placeDiv.querySelector(selector);
      if (input) input.name = `placeNames[${actualIndex}].${suffix}`;
    };
    updateName('input[type="text"]', 'name');
    updateName('input[type="hidden"][name$=".placeId"]', 'placeId');
    updateName('input[type="hidden"][name$=".transport"]', 'transport');
    updateName('input[type="number"][name$=".time"]', 'time');
  });
}

// 경로 요청
// 경로 요청
// 경로 요청
export async function requestRoute(formdElement, clearBouelean) {
  const formData = new FormData(formdElement);
  const response = await fetch("/route/compute", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    let errorMessage = "입력 오류:\n";
    for (let field in errorData) {
      errorMessage += `${field}: ${errorData[field]} \n`;
    }
    alert(errorMessage);
    return;
  }

  if (clearBouelean) {
    routeManager.clearRoutes();
  }  // clearAllRoutes(); // 기존 경로 제거 - 그냥 경로 추가만 할 수도 있으니까 clear하지 않기

  try {
    const geometry = await google.maps.importLibrary("geometry");
    const data = await response.json();
    const legs = data.routes[0].legs;
    const map = getMapInstance();

    legs.forEach((leg, index) => {
      if (!leg.polyline || !leg.polyline.encodedPolyline) {
        console.warn("경로 데이터에 polyline 정보가 없습니다.");
        return;
      }

      try {
        const strokeColor = index % 2 === 0 ? '#f0659b' : '#c154ec';
        const strokeWeight = index % 2 === 0 ? 5 : 3;
        const path = geometry.encoding.decodePath(leg.polyline.encodedPolyline);
        const polyline = new google.maps.Polyline({
          path: path,
          strokeColor: strokeColor,
          strokeWeight: strokeWeight,
          map: map
        });
        // 생성된 폴리라인을 배열에 저장
        routeManager.routePolylines.push(polyline);
      } catch (e) {
        console.error("폴리라인 디코딩 오류:", e);
      }
    });

    adjustMapBounds(legs, geometry, map);
  } catch (error) {
    console.error("경로 요청 처리 중 오류 발생:", error);
    alert("경로 요청 처리 중 오류가 발생했습니다. 콘솔을 확인하세요.");
  }
}

//bound조정
function adjustMapBounds(legs, geometry, map) {
  try {
    const bounds = new google.maps.LatLngBounds();
    legs.forEach(leg => {
      if (leg.polyline?.encodedPolyline) {
        geometry.encoding.decodePath(leg.polyline.encodedPolyline)
          .forEach(coord => bounds.extend(coord));
      }
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
    }
  } catch (e) {
    console.error("지도 경계 조정 오류:", e);
  }
}