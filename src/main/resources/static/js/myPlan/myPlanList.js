/*
*My 메뉴 기능 
*/
import { bindDynamicElements } from "../ui/dom-elements.js";
import { hideAutoComplete, getDynamicElements, initRouteFormHandler } from "../selfContent/selfContent.js";
import { getTransportIcon } from "../selfContent/selfPlan.js";
import { initializeSearchEvents, initSearchResults } from "../selfContent/selfFind.js";
import { adjustContentWidth } from "../ui/state-manager.js";
import { getMapInstance } from "../store/map-store.js";
import { displayRoute } from "../map/commonRoute.js";
import { markerManager, createMarker } from "../map/marker.js";

// --- 페이징 상태 관리 변수 ---
let currentPage = 0;
let isLastPage = false;
let isLoading = false;
let scrollListener = null; // 스크롤 리스너 참조 저장


//Title - 계획 리스트 불러오기 (무한 스크롤 초기화)
export async function loadMyPlanList() {
  console.log('loadMyPlanList 초기화');
  //   //TODO:title이전에 image추가해주기
  //TODO: description에 몇박인지 만들기. 우선 Plan Entitiy에 몇박도 카운트 가능하도록 수정해야 함. 
  const planList = document.querySelector('.plan-list');

  // 이전 리스너가 있다면 제거
  if (planList && scrollListener) {
    planList.removeEventListener('scroll', scrollListener);
  }

  // UI 및 상태 초기화
  planList.innerHTML = '';
  currentPage = 0;
  isLastPage = false;
  isLoading = false;

  // 로그인 상태 확인
  const loginStatus = await fetch('/status', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!loginStatus.ok) {
    alert('로그인이 필요합니다.');
    emptyMyPlanList();
    createPlanButtonEvent();
    return;
  }

  // 첫 페이지 로드 및 스크롤 리스너 설정
  await fetchAndAppendPlans(currentPage);
  setupScrollListener();

  const createPlanButtonBox = document.querySelector('.plan-actions');
  createPlanButtonBox.style.display = 'none';
}

//Title - 페이징 데이터 로딩 및 렌더링
async function fetchAndAppendPlans(page) {
  if (isLoading || isLastPage) return;
  isLoading = true;

  try {
    const response = await fetch(`/api/private/my-plans?page=${page}&size=10&sort=createdDate,desc`);
    if (!response.ok) throw new Error('Failed to fetch plans');

    const data = await response.json();

    if (data.content && data.content.length > 0) {
      const planList = document.querySelector('.plan-list');
      const plansHtml = createPlansHtml(data.content);
      planList.insertAdjacentHTML('beforeend', plansHtml);
      attachClickListenersToNewItems();
    }
    else if (page === 0) {
      emptyMyPlanList();
      createPlanButtonEvent();
    }

    isLastPage = data.last;
    currentPage = data.number;

  } catch (error) {
    console.error('Error fetching plans:', error);
  } finally {
    isLoading = false;
  }
}

export function createPlansHtml(plans) {
  return plans.map(plan => {
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
    };
    return `
      <div class="plan-item" data-plan-id="${plan.planId}" data-event-attached="false">
        <div class="plan-item-content">
          <h4>${plan.title}</h4>
          <div class="plan-details">
            <span>${plan.regionName}</span>
            <span>${formatDate(plan.startTime)} ~ ${formatDate(plan.endTime)}</span>
          </div>
          <div class="plan-keywords">
            ${plan.purposeKeywords.map(k => `<span>#${k}</span>`).join('')}
            ${plan.moodKeywords.map(k => `<span>#${k}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');
}
//       <div>${plan.travelDistance}</div>
//     </div>
//     <div class="plan-keywords">
//       ${plan.keywords.map(keyword => `<span class="keyword">${keyword}</span>`)}
//     </div>


//Title - 새 계획 만들기 버튼 이벤트
function createPlanButtonEvent() {
  const createPlanButtonBox = document.querySelector('.plan-actions');
  createPlanButtonBox.style.display = 'flex';
  const createPlanButton = document.querySelector('.plan-actions>button');
  const collapseBody = document.querySelector('#collapseBody');
  //새 계획 만들기 버튼 클릭 이벤트
  createPlanButton.addEventListener('click', async () => {
    const response = await fetch('/selfContent');
    //selfContent로 이동하고 이벤트 부여 및 초기화
    //TODO: 이동했으면 메뉴버튼도 self버튼 활성화
    collapseBody.innerHTML = '';
    const data = await response.text();
    collapseBody.innerHTML = data;
    bindDynamicElements(getDynamicElements());
    hideAutoComplete(); //self로 이동했으니까 autocomplete 숨기기
    initializeSearchEvents(); //self 검색 이벤트
    initSearchResults();// searchResult 이벤트
    initRouteFormHandler(); //self form 설정
  });

}

//Title - 특정 planId로 계획 불러오기
//TODO: 클릭한 계획으로 이동시키기
export async function loadPlan(planId) {
  console.log('Load plan with ID:', planId);
  const planResponse = await fetch(`/api/private/plan/${planId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const planData = await planResponse.json();
  const routeResponse = await fetch(`/api/private/routes/${planId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const routeData = await routeResponse.json();
  console.log("routeData:", routeData);

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

  // 2. 기존 목록 숨기기                                                        
  const myPlanListElement = document.querySelector(
    '.myPlanList');
  if (myPlanListElement) {
    myPlanListElement.style.display = 'none';

  }

  // 3. 상세 계획 HTML 생성 및 삽입                                             
  const detailHtml = initMyPlanDetail(planData, routeData);
  const collapseBody = document.querySelector(
    '#collapseBody');
  if (collapseBody) {
    collapseBody.innerHTML = detailHtml;
  }
  setTimeout(() => {
    adjustContentWidth();
  }, 0);
}

// --- 이벤트 리스너 및 헬퍼 함수 ---

/*
 * Title - 무한 스크롤 이벤트 설정
 */
function setupScrollListener() {
  const planList = document.querySelector('.plan-list');
  if (!planList) return;

  scrollListener = () => {
    const isAtBottom = planList.scrollTop + planList.clientHeight >= planList.scrollHeight - 150; // 150px의 버퍼를 둠

    if (isAtBottom && !isLoading && !isLastPage) {
      console.log('Fetching next page...');
      fetchAndAppendPlans(currentPage + 1);
    }
  };

  planList.addEventListener('scroll', scrollListener);
}

/*
* Title - 새로 추가된 계획 아이템에 이벤트를 부여
*/
export function attachClickListenersToNewItems() {
  const newItems = document.querySelectorAll('.plan-item:not([data-event-attached="true"])');
  newItems.forEach(item => {
    item.setAttribute('data-event-attached', 'true');
    item.addEventListener('click', async () => {
      console.log('Plan item clicked:', item.getAttribute('data-plan-id'));
      await loadPlan(item.getAttribute('data-plan-id'));
    });
  });
}

/*
 * Title - 상세 계획 UI HTML
 * @param {object} plan - PlanResponseDto 형식의 계획 정보
 * @param {Array<object>} routes - List<RouteResponseDto> 형식의 경로 정보 배열
 * @returns {string} - 생성된 HTML 문자열
 */
export function initMyPlanDetail(plan, routes) {
  let detailHtml = `<div class="planDetail-container">`;
  detailHtml += `<h2 class="planDetail-title">${plan.title}</h2>`;
  detailHtml += `<ol class="planDetail-list-box">`;

  routes.forEach((route, index) => {
    const place = route.place;
    const memo = route.memo;

    const placeCardHtml = `
      <li class="planDetail-card planDetail-place-card">
        <div class="myPlan-card-body">
          <span class="planDetail-day-svg-box">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48"><g fill="#c7d5ef"><circle cx="24" cy="24" r="12" fill-opacity="0.5" /></g><g fill="#575757"><circle cx="24" cy="24" r="6" /></g></svg>
            </div>
          </span>
          <div class="planDetail-day-card-content-grid">
            <div class="planDetail-place-details">
              <span class="planDetail-keyword-badge">관광</span>
              <div class="planDetail-main-content">${place.name}</div>
              <div class="planDetail-sub-content">체류시간: ${route.stayTime}분</div>
            </div>
            <div class="planDetail-memo-display">
              ${memo ? memo.replace(/\n/g, '<br>') : '<span class="planDetail-no-memo">작성된 메모가 없습니다.</span>'}
            </div>
          </div>
        </div>
      </li>
    `;
    detailHtml += placeCardHtml;

    if (index < routes.length - 1) {
      const nextRoute = routes[index + 1];
      const transportIcon = getTransportIcon(route.transportMode);

      const transportCardHtml = `
        <li class="planDetail-card planDetail-transport-card">
          <div class="myPlan-card-body">
            <span class="planDetail-day-svg-box">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48"><g fill="#c7d5ef"><circle cx="24" cy="24" r="12" fill-opacity="0.5" /></g><g fill="#575757"><circle cx="24" cy="24" r="6" /></g></svg>
              </div>
            </span>
            <div class="planDetail-day-card-content-grid">
              <div class="planDetail-transport-icon-box">${transportIcon}</div>
              <div class="planDetail-transport-details">
                <div class="planDetail-transport-mode">${route.transportMode || '이동'}</div>
                <div class="planDetail-transport-route">${place.name} → ${nextRoute.place.name}</div>
                <div class="planDetail-transport-time">예상 소요시간: ${route.travelTime ?? '?'}분</div>
              </div>
            </div>
          </div>
        </li>
      `;
      detailHtml += transportCardHtml;
    }
  });

  detailHtml += `</ol></div>`;
  return detailHtml;
}