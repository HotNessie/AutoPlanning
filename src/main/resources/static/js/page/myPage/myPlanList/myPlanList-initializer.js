// src/main/resources/static/js/myPlan/myPlanList-initializer.js

import { resetCollapseButtonStateWithAutoComplete, adjustContentWidth } from '../../../ui/state-manager.js';
import { loadMyPlanList } from './myPlanList.js';

let clickHandler;

export function initializeMyPlanListPage() {
  resetCollapseButtonStateWithAutoComplete(true);
  adjustContentWidth();
  loadMyPlanList();
}

/**
 * Title - myPlanList 페이지에 이벤트 붙이기
 * @param {HTMLElement} container - 이벤트를 붙일 컨테이너 요소
 */
export function attachEventMyPlanList(container) {

  clickHandler = (event) => {
    //이벤트 class로 이벤트 부여 ex) myPlanEvent.event(event)
  };

  container.addEventListener('click', clickHandler);

  return () => {
    container.removeEventListener('click', clickHandler);

    container.replaceChildren(); // 컨테이너 내부 요소 모두 제거
  };

}
