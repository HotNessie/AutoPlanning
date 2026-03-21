import * as api from './myPlanDetails-api.js';
import { setupDetailsEventListeners } from './myPlanDetails-events.js';
import { googleSearchResultsManager } from '../../selfPage/searchResult.js';
import { searchPlacesByText } from '../../../core/apiService.js';
import { loadPlan, currentMyPlanAndRoutes } from '../myPlan/myPlan.js';
import { displayRoute } from '../../../map/commonRoute.js';
import { cleanupFunctions } from '../../../main.js';

// --- 페이지 상태 관리 ---
const state = {
  selectedPlaces: [], // 장소 추가 모달에서 선택된 장소들
};

// --- UI 부분 업데이트 로직 ---

/**
 * UI를 새로운 경로 데이터로 부분 업데이트합니다. (전체 페이지 리로드 방지)
 * @param {Array<object>} updatedRoutes - 서버에서 받은 최신 경로 리스트
 */
function updateUIWithNewRoutes(updatedRoutes) {
  const listBox = document.querySelector('.planDetail-list-box');
  if (!listBox) return;

  // 1. 상태 동기화
  currentMyPlanAndRoutes.setCurrentRoutes(updatedRoutes);

  // 2. 지도 경로 다시 그리기
  const transformedRouteData = {
    routes: [{
      legs: updatedRoutes.map(route => ({
        polyline: { encodedPolyline: route.polyline }
      }))
    }]
  };
  displayRoute(transformedRouteData);

  // 3. DOM 요소 업데이트
  const placeCards = [...listBox.querySelectorAll('.planDetail-place-card')];
  const transportCards = [...listBox.querySelectorAll('.planDetail-transport-card')];

  updatedRoutes.forEach((route, index) => {
    // 장소 카드 업데이트
    const placeCard = placeCards[index];
    if (placeCard) {
      const grid = placeCard.querySelector('.planDetail-day-card-content-grid');
      if (grid) grid.dataset.routeId = route.routeId;
      
      const stayTimeSpan = placeCard.querySelector(`[id^="planDetail-stay-time"]`);
      if (stayTimeSpan) {
        stayTimeSpan.id = `planDetail-stay-time${route.routeId}`;
        stayTimeSpan.innerText = ` ${route.stayTime}`;
      }
    }

    // 교통수단 카드 업데이트
    const transportCard = transportCards[index];
    if (transportCard) {
      if (index < updatedRoutes.length - 1) {
        transportCard.style.display = 'block';
        const nextRoute = updatedRoutes[index + 1];
        const routeText = transportCard.querySelector('.planDetail-transport-route');
        if (routeText) {
          routeText.textContent = `${route.place.name} → ${nextRoute.place.name}`;
        }
        const timeText = transportCard.querySelector('.planDetail-transport-time');
        if (timeText) {
          timeText.textContent = `예상 소요시간: ${route.travelTime ?? '?'}분`;
        }
      } else {
        transportCard.style.display = 'none';
      }
    }
  });
}

// --- '장소 추가' 모달 로직 ---

/**
 * 모달 내에서 장소를 검색하고 결과를 렌더링합니다.
 * @param {string} query - 검색어
 */
async function handleModalSearch(query) {
  const places = await searchPlacesByText(query);
  googleSearchResultsManager.setResults(places);

  const resultList = document.getElementById('myPlanDetail-add-place-result-list');
  if (!resultList) return;
  resultList.innerHTML = '';

  const fragment = document.createDocumentFragment();
  places.forEach((place, index) => {
    const listItem = document.createElement('li');
    listItem.id = `myPlanDetail-add-place-result-item-${index}`;
    listItem.style = "list-style:none; cursor: pointer;";
    listItem.textContent = `${place.displayName} - ${place.formattedAddress}`;
    listItem.dataset.index = index;
    fragment.appendChild(listItem);
  });
  resultList.appendChild(fragment);
}

/**
 * 모달에서 검색 결과 클릭 시, 선택 목록에 추가합니다.
 * @param {string} index - 클릭된 아이템의 인덱스
 */
function handleModalResultClick(index) {
  const placeData = googleSearchResultsManager.getResults(parseInt(index, 10));
  if (!placeData) return;

  state.selectedPlaces.push(placeData);
  renderSelectedPlaces();
}

/**
 * 선택된 장소를 화면에 렌더링합니다.
 */
function renderSelectedPlaces() {
  const selectedListContainer = document.querySelector('#myPlanDetail-add-place-selected-place');
  if (!selectedListContainer) return;

  // 제목을 제외한 모든 자식 노드 삭제
  while (selectedListContainer.children.length > 1) {
    selectedListContainer.removeChild(selectedListContainer.lastChild);
  }

  state.selectedPlaces.forEach((place, index) => {
    const selectedItem = document.createElement('li');
    selectedItem.className = "myPlanDetail-add-place-selected-item";
    selectedItem.style = "list-style:none;";
    selectedItem.innerHTML = `${place.displayName} <button class="myPlanDetail-add-place-remove-btn" data-index="${index}">x</button>`;
    selectedListContainer.appendChild(selectedItem);
  });
}

/**
 * 선택 목록에서 장소를 제거합니다.
 * @param {string} index - 제거할 아이템의 인덱스
 * @param {HTMLElement} elementToRemove - 제거할 DOM 요소
 */
function handleModalRemoveClick(index, elementToRemove) {
  state.selectedPlaces.splice(parseInt(index, 10), 1);
  elementToRemove.remove();
  renderSelectedPlaces();
}

/**
 * 모달에서 '추가' 버튼 클릭 시, 장소를 계획에 추가합니다.
 */
async function handleModalConfirm() {
  const plan = currentMyPlanAndRoutes.getCurrentPlan();
  if (!plan || !plan.planId || state.selectedPlaces.length === 0) {
    alert('선택된 장소가 없거나 현재 계획 정보가 없습니다.');
    return;
  }

  try {
    const placePromises = state.selectedPlaces.map(place =>
      api.savePlace({
        placeId: place.id,
        name: place.displayName,
        address: place.formattedAddress,
        latitude: place.location.lat(),
        longitude: place.location.lng()
      })
    );
    await Promise.all(placePromises);

    const routeInfo = {
      placeNames: state.selectedPlaces.map(place => ({
        placeId: place.id,
        name: place.displayName,
        time: 60, transport: 'TRANSIT',
      })),
      units: 'METRIC'
    };

    await api.addPlacesToPlan(plan.planId, routeInfo);

    alert('장소가 성공적으로 추가되었습니다.');
    loadPlan(plan.planId);

  } catch (error) {
    console.error('장소 추가 프로세스 중 오류 발생:', error);
  }
}

/**
 * 계획에서 특정 경로를 삭제 처리합니다.
 * @param {string} planId - 계획 ID
 * @param {string} routeSequence - 삭제할 경로의 시퀀스
 * @param {HTMLElement} routeElement - 삭제할 경로의 DOM 요소 (li.planDetail-card)
 */
async function handleDeleteRouteClick(planId, routeSequence, routeElement) {
  if (!confirm('정말로 이 장소를 삭제하시겠습니까?')) {
    return;
  }

  try {
    await api.deleteRouteAndRecalculate(planId, routeSequence);
    loadPlan(planId);
  } catch (error) {
    console.error('경로 삭제 중 오류 발생:', error);
  }
}

/**
 * 경로 순서 변경 후 서버에 저장하는 로직을 처리합니다.
 * @param {string[]} orderedRouteSequences - 재정렬된 경로 시퀀스 ID 배열.
 */
async function handleOrderSave(orderedRouteSequences) {
  const plan = currentMyPlanAndRoutes.getCurrentPlan();
  if (!plan || !plan.planId) {
    console.error('계획 정보가 없습니다. 순서 저장에 실패했습니다.');
    return;
  }

  const updatedRoutes = orderedRouteSequences.map((routeId, index) => ({
    routeId: parseInt(routeId, 10),
    newSequence: index + 1
  }));

  try {
    const newRoutes = await api.updateRouteOrder(plan.planId, updatedRoutes);
    if (newRoutes) {
      updateUIWithNewRoutes(newRoutes);
    } else {
      loadPlan(plan.planId);
    }
  } catch (error) {
    console.error('경로 순서 저장 중 오류 발생:', error);
    alert('경로 순서 저장에 실패했습니다.');
  }
}


/**
 * myPlanDetails 페이지의 모든 기능을 초기화하고 이벤트 리스너를 설정합니다.
 */
export function initMyPlanDetails() {
  const container = document.querySelector('.planDetail-container');
  if (!container || container.dataset.listenerAttached === 'true') {
    return;
  }
  container.dataset.listenerAttached = 'true';

  state.selectedPlaces = []; // 모달 상태 초기화

  const callbacks = {
    onTitleChange: api.updatePlanTitle,
    onStayTimeChange: api.updateRouteStayTime,
    onMemoChange: api.updateRouteMemo,
    onDescriptionChange: api.updatePlanDescription,
    onKeywordsChange: api.updatePlanKeywords,
    onDeleteRouteClick: handleDeleteRouteClick,
    onOrderSave: handleOrderSave,
    onModalSearch: handleModalSearch,
    onModalResultClick: handleModalResultClick,
    onModalRemoveClick: handleModalRemoveClick,
    onModalConfirm: handleModalConfirm,
  };

  const cleanup = setupDetailsEventListeners(container, callbacks);
  cleanupFunctions.push(cleanup);
}
