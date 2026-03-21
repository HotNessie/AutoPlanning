/*
*My 메뉴 기능 
*/
import { bindDynamicElements } from "../../../ui/dom-elements.js";
import { initRouteFormHandler } from "../../selfPage/selfContent/selfContent.js";
import { getDynamicElements } from "../../selfPage/selfContent/Event/formEvent.js";
import { resetCollapseButtonStateWithAutoComplete } from "../../../ui/state-manager.js";
import { getTransportIcon } from "../../selfPage/selfPlanningDetails/selfPlan.js";
import { initializeSearchEvents, initSearchResults } from "../../selfPage/selfFind.js";
import { adjustContentWidth } from "../../../ui/state-manager.js";
import { getMapInstance } from "../../../core/store.js";
import { hashtaggingver5 } from "../../../core/hashtag.js";
import { displayRoute } from "../../../map/commonRoute.js";
import { markerManager, createMarker } from "../../../map/marker.js";
import { editMyPlanDetails, addPlace } from "../myPlanDetails/myPlanDetails.js";
import { bookMarkButtonControllerInstance } from "../../../bookMarkButton/bookmark.js";

// --- 페이징 상태 관리 변수 ---
let currentPage = 0;
let isLastPage = false;
let isLoading = false;
let scrollListener = null; // 스크롤 리스너 참조 저장

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
      attachBookmarkEventToItems();
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

        <div id="plan-item-header" class="plan-item-header">
          <div id="bookMark-button${plan.planId}" style="display: inline">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white">
              <g id="_01_align_center" data-name="01 align center">
                <path d="M19.467,23.316,12,17.828,4.533,23.316,7.4,14.453-.063,9H9.151L12,.122,14.849,9h9.213L16.6,14.453ZM12,15.346l3.658,2.689-1.4-4.344L17.937,11H13.39L12,6.669,10.61,11H6.062l3.683,2.691-1.4,4.344Z" />
                </g>
              </svg>
            </div>
            <h4>${plan.title}</h4>
          </div>
          <div class="plan-details">
            <span>${plan.regionName}</span>
            <span>${formatDate(plan.startTime)} ~ ${formatDate(plan.endTime)}</span>
          </div>
          <div class="plan-keywords">
            ${plan.planKeywords.map(k => `<span>#${k}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');
}
//       <div>${plan.travelDistance}</div>
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
    resetCollapseButtonStateWithAutoComplete(true); //selfContent에서 autocomplete 숨김
    initializeSearchEvents(); //self 검색 이벤트
    initSearchResults();// searchResult 이벤트
    initRouteFormHandler(); //self form 설정
  });

}

// //Title - 특정 planId로 계획 불러오기
// export async function loadPlan(planId) {
//   console.log('Load plan with ID:', planId);
//   const planResponse = await fetch(`/api/public/plan/${planId}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//   });
//   const planData = await planResponse.json();
//   const routeResponse = await fetch(`/api/public/routes/${planId}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//   });
//   const routeData = await routeResponse.json();
//   console.log("routeData:", routeData);

//   // commonRoute.js의 displayRoute가 예상하는 데이터 구조로 변환
//   const transformedRouteData = {
//     routes: [
//       {
//         legs: routeData.map(route => ({
//           polyline: {
//             encodedPolyline: route.polyline
//           }
//         }))
//       }
//     ]
//   };

//   await displayRoute(transformedRouteData);

//   markerManager.clearMarkers();
//   const markerPromises = routeData.map((route, index) => {
//     const originalPlace = route.place;
//     const transformedPlace = {
//       location: {
//         lat: originalPlace.latitude,
//         lng: originalPlace.longitude
//       },
//       displayName: originalPlace.name,
//       formattedAddress: originalPlace.address || '',
//       placeId: originalPlace.placeId || ''
//     };
//     return createMarker(transformedPlace, getMapInstance(), index + 1);
//   });
//   await Promise.all(markerPromises);

//   // 2. 기존 목록 숨기기                                                        
//   const myPlanListElement = document.querySelector(
//     '.myPlanList');
//   if (myPlanListElement) {
//     myPlanListElement.style.display = 'none';

//   }

//   // 3. 상세 계획 HTML 생성 및 삽입                                             
//   const detailHtml = initMyPlanDetail(planData, routeData);
//   const collapseBody = document.querySelector(
//     '#collapseBody');
//   if (collapseBody) {
//     collapseBody.innerHTML = detailHtml;
//   }
//   setTimeout(() => {
//     adjustContentWidth();
//     editMyPlanDetails();
//     const myPlanEditor = document.getElementById('myPlanDescription');
//     if (myPlanEditor) {
//       myPlanEditor.addEventListener('keyup', (e) => {
//         if (e.key === 'Escape') {
//           e.target.blur();
//         } else if (e.key === 'Enter' || e.key === ' ') {
//           requestAnimationFrame(() => {
//             hashtaggingver5(myPlanEditor);
//           });
//         }
//       });
//     }
//     hashtaggingver5(myPlanEditor);
//   }, 0);
// }

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
* Title - 북마크 이벤트 부여
*/
export function attachBookmarkEventToItems() {
  const bookmarkButtons = document.querySelectorAll('[id^="bookMark-button"]:not([data-bookmark-event-attached="true"])');
  bookmarkButtons.forEach(button => {
    const planId = button.id.replace('bookMark-button', '');
    if (bookMarkButtonControllerInstance.bookmarkPlanList.includes(parseInt(planId))) {
      button.innerHTML = bookMarkButtonControllerInstance.clickedBookmarkSvg
    }
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      if (bookMarkButtonControllerInstance.bookmarkPlanList.includes(parseInt(planId))) {
        button.innerHTML = bookMarkButtonControllerInstance.getnoneClickedBookmarkSvg(planId);
      } else {
        button.innerHTML = bookMarkButtonControllerInstance.getclickedBookmarkSvg(planId);
      }
    });
    button.setAttribute('data-bookmark-event-attached', 'true');
  });
}

/*
 * Title - 상세 계획 UI HTML
 * @param {object} plan - PlanResponseDto 형식의 계획 정보
 * @param {Array<object>} routes - List<RouteResponseDto> 형식의 경로 정보 배열
 * @returns {string} - 생성된 HTML 문자열
 */
export function initMyPlanDetail(plan, routes) {
  currentMyPlanAndRoutes.setCurrentPlan(plan);
  currentMyPlanAndRoutes.setCurrentRoutes(routes);
  let detailHtml = `<div class="planDetail-container" data-plan-id="${plan.planId}">`;
  detailHtml += `<h2 id="planDetail-title" class="planDetail-title" contenteditable="true">${plan.title}</h2>`;

  detailHtml += `<ol class="planDetail-list-box">`;

  routes.forEach((route, index) => {
    const place = route.place;
    const memo = route.memo;

    const placeCardHtml = `
      <li class="planDetail-card planDetail-place-card" >
        <div class="myPlan-card-body">
          <span class="planDetail-day-svg-box">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48"><g fill="#c7d5ef"><circle cx="24" cy="24" r="12" fill-opacity="0.5" /></g><g fill="#575757"><circle cx="24" cy="24" r="6" /></g></svg>
            </div>
          </span>
          <div class="planDetail-day-card-content-grid"  data-route-id="${route.sequence}">
            <div class="planDetail-place-details">
              <span class="planDetail-keyword-badge">장소</span>
              <div class="planDetail-main-content">${place.name}</div>
              <div class="planDetail-sub-content">체류시간: <span id="planDetail-stay-time${route.sequence}" contenteditable="true"> ${route.stayTime}</span>분</div>
            </div>
            <div class="planDetail-memo-display" contenteditable="true">
              ${memo.trim() === '' ? '<span class="planDetail-no-memo">작성된 메모가 없습니다.</span>' : memo.replace(/\n/g, '<br>')}
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

  detailHtml += addPlace(); // 장소 추가 버튼 및 모달 HTML 추가
  detailHtml += `</ol>`;

  detailHtml += `<div id="myPlanDescription" contenteditable="true" class="editable-textarea" style="margin-bottom: 12px;"> ${plan.description.trim() === '' ? '<span class="planDetail-no-description">설명이 없습니다.</span>' : plan.description}</div>`;


  detailHtml += `</div>`;
  return detailHtml;
}




//Title - 빈 계획 리스트 처리
function emptyMyPlanList() {
  const planList = document.querySelector('.plan-list');
  const collapseBody = document.querySelector('#collapseBody');
  planList.innerHTML = `
    <div class="empty-plan-list">
      <p>+</p>
    </div>
    `;
  setTimeout(() => {
    const emptyPlanList = document.querySelector('.empty-plan-list');
    emptyPlanList.addEventListener('click', async () => {
      const response = await fetch('/selfContent');
      const data = await response.text();
      collapseBody.innerHTML = data;
      bindDynamicElements(getDynamicElements());
      initSelfContent();
      initializeSearchEvents();
      initSearchResults();
      initRouteFormHandler();
    });
  }, 0);
};