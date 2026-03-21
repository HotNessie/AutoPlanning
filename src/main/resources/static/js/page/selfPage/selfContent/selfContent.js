import {
  requestRoute
} from './routeRequest/selfRouteRequest.js';
import { initPlanContent } from '../selfPlanningDetails/selfPlan.js';
import { setupValidationClearEvents, addSubmitListener } from './Event/formEvent.js';
import { API } from '../../../core/config.js';


//Title - getPlanFragment
async function getPlanFragment() {
  const collapseBody = document.querySelector('#collapseBody');
  try {
    const response = await fetch(API.SUBMIT_PLAN, {
      method: 'GET',
      headers: {
        'Content-Type': 'Text/HTML',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch plan fragment: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    if (html) {
      collapseBody.innerHTML = html;
      console.log("added event listener to submitButton");
      initPlanContent();
    }
  } catch (error) {
    console.error("Error fetching plan fragment:", error);
  }
};



// Title - routeForm control
/* selfContent form설정 */
export function initRouteFormHandler() {
  //계획 구성 form
  const routeForm = document.querySelector('#routeForm');
  if (!routeForm || routeForm.dataset.listenerAdded) return;

  // 초기 설정 및 동적으로 추가된 장소에 대한 이벤트 설정
  setupValidationClearEvents();

  //selfForm 제출시 이벤트 리스너 추가
  const submissionCallback = () => {
    requestRoute(routeForm, true).then(getPlanFragment);
  };
  //유효성 검사 성공하면 requestRotue 실행
  addSubmitListener(routeForm, submissionCallback);

  routeForm.dataset.listenerAdded = "true"; // 중복 추가 방지
}