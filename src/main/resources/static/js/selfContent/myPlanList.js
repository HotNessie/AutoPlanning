//myPlanList fragment 호출시 로드 우선

/*
*My 메뉴 기능 
 */

import { bindDynamicElements } from "../ui/dom-elements.js";
import { initSelfContent, getDynamicElements, initRouteFormHandler } from "./selfContent.js";
import { initializeSearchEvents, initSearchResults } from "./selfFind.js";

//계획 리스트 불러오기
export async function loadMyPlanList() {
  //TODO:계획 리스트 불러와서 HTML구성
  console.log('loadMyPlanList');
  // const response = await fetch('/myPlanList',
  //   {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   });
  // if (!response.ok) {
  //   throw new Error('Network response was not ok');
  // }
  // const data = await response.json();
  // const planList = document.querySelector('planList');

  // if (data.length === 0) {
  //   emptyMyPlanList();
  // } else {
  //   //TODO:title이전에 image추가해주기
  //   //description에 몇박인지 만들기. 우선 Plan Entitiy에 몇박도 카운트 가능하도록 수정해야 함.
  //   planList.innerHTML = data.map(plan => `
  //     < class="plan-item">
  //       <h3>${plan.title}</h3>
  //       <div class="description">
  //         <div>${plan.travelTime}</div>
  //         <div>${plan.travelDistance}</div>
  //       </div>
  //       <div class="plan-keywords">
  //         ${plan.keywords.map(keyword => `<span class="keyword">${keyword}</span>`)}
  //       </div>
  //     </div>
  //     `);
  // }

  const response = await fetch('/api/private/my-plans'
    , {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
  const data = await response.json();
  if (!data || data.length === 0) { //반환 없으면 없다고 표시.
    emptyMyPlanList();
    return;
  }
  console.log('Fetched plans:', data);
  // initMyPlanList(data);

  // emptyMyPlanList();
  attachEventListeners();
}

//Title - 빈 계획 리스트 처리
function emptyMyPlanList() {
  //TODO: 만약 내 계획 리스트가 비어있다면
  //? ㄴ>뭔소리임???이게 왜 todo야????
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

//Title - 내 계획 리스트가 있는 경우 보여줄 html구성
function initMyPlanList(response) {
  const planList = document.querySelector('.plan-list');
  planList.innerHTML = response.map(plan => `
    <div class="plan-item">
      <h3>${plan.title}</h3>
      <div class="description">
        <div>${plan.travelTime}</div>
        <div>${plan.travelDistance}</div>
      </div>
      <div class="plan-keywords">
        ${plan.keywords.map(keyword => `<span class="keyword">${keyword}</span>`)}
      </div>
    </div>
  `).join('');
}

//Title - 동적 요소에 이벤트 리스너 부착
function attachEventListeners() {
  const createPlanButton = document.querySelector('.plan-actions>button');
  const collapseBody = document.querySelector('#collapseBody');
  createPlanButton.addEventListener('click', async () => {
    const response = await fetch('/selfContent');
    //selfContent로 이동하고 이벤트 부여 및 초기화
    collapseBody.innerHTML = '';
    const data = await response.text();
    collapseBody.innerHTML = data;
    bindDynamicElements(getDynamicElements());
    initSelfContent();
    initializeSearchEvents();
    initSearchResults();
    initRouteFormHandler();
  });

}