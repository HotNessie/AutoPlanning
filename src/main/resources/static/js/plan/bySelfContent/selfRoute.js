//commonRoute의 자식. selfContent에서만 사용되는 함수들

import {
  routeManager,
  displayRoute,
  fetchRoute,
  extractRouteInfo,
} from "../../map/commonRoute.js";

//Title -  경로 순서 조정 함수
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

//Title - 경로 요청
export async function requestRoute(formElement, clear = false) {
  try {
    // const formData = new FormData(formElement);

    // console.log("formData:", formData);

    const planResponseDto = await fetchRoute(formElement); // formData 대신 formElement 자체를 전달

    const routeData = planResponseDto.routeResponse;

    console.log("routeData:", routeData);

    //?sessionStorage에 경로 데이터 저장
    //?sessionStorage에 경로 데이터 저장
    sessionStorage.setItem("routePlanData", JSON.stringify(routeData));
    sessionStorage.setItem("planResponseDto", JSON.stringify(planResponseDto));

    await displayRoute(routeData, {
      clearExisting: clear,
      adjustBounds: true,
      polylineOptions: {
        // strokeColor: #c154ec,
        // strokeWeight: 4
      }
    });
    // 경로 정보 추출 안해도..?
    const routeInfo = extractRouteInfo(routeData);
    console.log("경로 정보:", routeInfo);
    return routeData;
  } catch (e) {
    console.error("경로 요청 처리 중 오류 발생:", e);
    alert("경로 요청 처리 중 오류가 발생했습니다. 콘솔을 확인하세요.");
  }
}