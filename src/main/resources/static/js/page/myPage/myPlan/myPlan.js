/*
*My 메뉴 기능
*/
import { fetchPlanDetails, fetchPlanRoutes } from './apiService.js';
import { displayRoute } from '../../../map/commonRoute.js';
import { markerManager, createMarker } from '../../../map/marker.js';
import { getMapInstance } from '../../../core/store.js';
import { renderPlanDetail } from './myPlan-dom.js';

// --- 전역 상태 관리 ---
class CurrentMyPlanAndRoutes {
  currentPlan = null;
  currentRoutes = [];

  setCurrentPlan(plan) {
    this.currentPlan = plan;
  }

  getCurrentPlan() {
    return this.currentPlan;
  }

  setCurrentRoutes(routes) {
    this.currentRoutes = routes;
  }

  getCurrentRoutes() {
    return this.currentRoutes;
  }
}
export const currentMyPlanAndRoutes = new CurrentMyPlanAndRoutes();

/**
 * Title - 특정 planId로 계획 불러오기 및 상세 뷰 렌더링
 * @param {string} planId - 로드할 계획의 ID
 */
export async function loadPlan(planId) {
  console.log('Load plan with ID:', planId);

  try {
    const planData = await fetchPlanDetails(planId);
    const routeData = await fetchPlanRoutes(planId);
    console.log("routeData:", routeData);

    currentMyPlanAndRoutes.setCurrentPlan(planData);
    currentMyPlanAndRoutes.setCurrentRoutes(routeData);

    // commonRoute.js의 displayRoute가 예상하는 데이터 구조로 변환
    const transformedRouteData = {
      routes: [
        {
          legs: routeData.map(route => ({
            polyline: {
              encodedPolyline: route.polyline
            }
          }))
        }
      ]
    };

    await displayRoute(transformedRouteData);

    markerManager.clearMarkers();
    const markerPromises = routeData.map((route, index) => {
      const originalPlace = route.place;
      const transformedPlace = {
        location: {
          lat: originalPlace.latitude,
          lng: originalPlace.longitude
        },
        displayName: originalPlace.name,
        formattedAddress: originalPlace.address || '',
        placeId: originalPlace.placeId || ''
      };
      return createMarker(transformedPlace, getMapInstance(), index + 1);
    });
    await Promise.all(markerPromises);

    renderPlanDetail(planData, routeData);

  } catch (error) {
    console.error('Error loading plan details:', error);
    alert('계획 상세 정보를 불러오는 데 실패했습니다.');
  }
}

/**
 * Title - 새 계획 만들기 버튼 클릭 핸들러 (myPlan-initializer에서 호출)
 * @param {Function} navigateToSelfContent - selfContent 페이지로 이동하는 콜백 함수
 */
export function handleCreatePlanClick(navigateToSelfContent) {
  if (navigateToSelfContent) {
    navigateToSelfContent();
  } else {
    console.error('navigateToSelfContent callback not provided.');
  }
}