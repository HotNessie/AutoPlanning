import { getMapInstance } from "../store/map-store.js";

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

//bound조정
//bound조정
//bound조정
export function adjustMapBounds(legs, encoding, map) {
  try {
    const bounds = new google.maps.LatLngBounds();
    legs.forEach(leg => {
      if (leg.polyline?.encodedPolyline) {
        // geometry.encoding.decodePath(leg.polyline.encodedPolyline)
        encoding.decodePath(leg.polyline.encodedPolyline)
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

//Polyline 생성
//Polyline 생성
//Polyline 생성
export function createPolyline(path, options = {}) {
  const defaultOptions = {
    strokeColor: '#c154ec',
    strokeWeight: 5,
    map: getMapInstance()
  };

  return new google.maps.Polyline({
    path: path,
    ...defaultOptions,
    ...options
  });
}

// legs로부터 Polyline 생성
// legs로부터 Polyline 생성
// legs로부터 Polyline 생성
export async function createPolylinsFromLegs(legs, options = {}) {
  try {
    // if (!window.goolge || !window.google.maps) {
    //   throw new Error("Google Maps API가 로드되지 않았습니다.");
    // }

    const { encoding } = await google.maps.importLibrary("geometry");
    // const polylines = [];

    legs.forEach((leg, index) => {
      if (!leg.polyline || !leg.polyline.encodedPolyline) {
        console.warn("경로 데이터에 polyline 정보가 없습니다.");
        return;
      }
      try {
        const strokeColor = options.strokeColor || (index % 2 === 0 ? '#f0659b' : '#c154ec');
        const strokeWeight = options.strokeWeight || (index % 2 === 0 ? 5 : 3);

        const path = encoding.decodePath(leg.polyline.encodedPolyline);

        if (!path || path.length === 0) {
          console.warn("디코딩된 경로가 비어 있습니다.");
          return;
        }
        const polyline = createPolyline(path, {
          strokeColor: strokeColor,
          strokeWeight: strokeWeight,
          ...options
        });
        // polylines.push(polyline);
        routeManager.addRoute(polyline);
        console.log(`경로 ${index} 생성 완료:`, polyline);
      } catch (error) {
        console.error("폴리라인 생성 중 오류 발생:", error);
      }
    });
    // return { polylines, encoding };
    return encoding;
  } catch (error) {
    console.error("경로 생성 중 오류 발생:", error);
  }
}

//서버 응답
//서버 응답
//서버 응답
export async function processRouteResponse(response) {
  console.log("응답 상태:", response);
  console.log("응답 상태:", response.status);
  if (!response.ok) {
    const errorData = await response.json();
    let errorMessage = "입력 오류:\n";
    for (let field in errorData) {
      errorMessage += `${field}: ${errorData[field]} \n`;
    }
    throw new Error(errorMessage);
  }
  const data = await response.json();
  if (!data.routeResponse || !data.routeResponse.routes || !data.routeResponse.routes[0] || !data.routeResponse.routes[0].legs) {
    throw new Error("유효한 경로 데이터가 없습니다.");
  }
  // if (!data.routes || !data.routes[0] || !data.routes[0].legs) {
  //   throw new Error("유효한 경로 데이터가 없습니다.");
  // }
  return data;
}

//Route 표시
//Route 표시
//Route 표시
export async function displayRoute(routeData, options = {}) {
  const {
    clearExisting = true,
    adjustBounds = true,
    polylineOptions = {}
  } = options;

  try {
    if (clearExisting) {
      routeManager.clearRoutes();
    }

    const legs = routeData.routes[0].legs;
    // const { polylines, encoding } = await createPolylinsFromLegs(legs, polylineOptions);
    const encoding = await createPolylinsFromLegs(legs, polylineOptions);

    if (adjustBounds) {
      adjustMapBounds(legs, encoding, getMapInstance());
    }
    console.log("경로 목록:", routeManager.getRoutes());
    return routeManager.getRoutes();
  } catch (error) {
    console.error("경로 표시 중 오류 발생:", error);
    throw error;
  }
}

//경로 요청
//경로 요청
//경로 요청
export async function fetchRoute(formData) {
  try {
    const response = await fetch("/route/compute", {
      method: "POST",
      body: formData
    });
    console.log("경로 요청 응답:", response);
    return await processRouteResponse(response);
  } catch (error) {
    console.error("경로 요청 처리 중 오류 발생:", error);
    throw error;
  }
}

//경로 정보 추출
//경로 정보 추출
//경로 정보 추출
export function extractRouteInfo(routeData) {
  const route = routeData.routes[0];
  const legs = route.legs;

  let toralDistance = 0;
  let totalDuration = 0;

  legs.forEach(leg => {
    toralDistance += leg.distanceMeters || 0;
    totalDuration += leg.duration?.seconds || 0;
  });

  return {
    totalDistance: Math.round(toralDistance / 1000 * 100) / 100, // km 단위로 변환
    totalDuration: Math.round(totalDuration / 60), // 분 단위로 변환
    legs: legs,
    polyline: route.polyline
  };
}