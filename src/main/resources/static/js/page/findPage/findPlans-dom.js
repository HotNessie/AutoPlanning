import { createPlanItemHtml } from '../myPage/myPlan/myPlan-templates.js';

/**
 * Title - 검색된 계획 목록을 DOM에 렌더링합니다.
 * @param {Array<object>} plans - 렌더링할 계획 데이터 배열.
 */
export function renderPlans(plans) {
  const contentBody = document.querySelector('#collapseSearchBody');
  if (!contentBody) {
    console.error('#collapseSearchBody 요소를 찾을 수 없습니다.');
    return;
  }

  const plansHtml = plans.map(createPlanItemHtml).join('');
  contentBody.insertAdjacentHTML('beforeend', plansHtml);
}

/**
 * Title - 계획 목록 컨테이너의 내용을 지웁니다.
 */
export function clearPlanList() {
  const contentBody = document.querySelector('#collapseSearchBody');
  if (contentBody) {
    contentBody.innerHTML = '';
  }
}

/**
 * Title - 검색 입력 필드에서 현재 쿼리 값을 가져옵니다.
 * @returns {{title: string, region: string, keywords: string}}
 */
export function getSearchQuery() {
  const title = document.querySelector('#search-title').value;
  const region = document.querySelector('#search-region').value;
  const keywords = document.querySelector('#search-keywords').value;
  return { title, region, keywords };
}
