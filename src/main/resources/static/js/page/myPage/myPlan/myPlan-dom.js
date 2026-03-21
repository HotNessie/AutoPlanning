// src/main/resources/static/js/page/myPage/myPlan/myPlan-dom.js
import { createPlanItemHtml, createPlanDetailHtml } from './myPlan-templates.js';
import { adjustContentWidth } from '../../../ui/state-manager.js';
import { initMyPlanDetails } from '../myPlanDetails/myPlanDetails.js';

/**
 * Renders a list of plans into the plan list container.
 * @param {Array<object>} plans - The array of plan data objects.
 */
export function renderPlanList(plans) {
    const planListContainer = document.querySelector('.plan-list');
    if (!planListContainer) return;

    const plansHtml = plans.map(createPlanItemHtml).join('');
    planListContainer.insertAdjacentHTML('beforeend', plansHtml);
}

/**
 * Renders the plan detail view into the main content area.
 * @param {object} planData - The details of the plan.
 * @param {Array<object>} routeData - The route data for the plan.
 */
export function renderPlanDetail(planData, routeData) {
    const myPlanListElement = document.querySelector('.myPlanList');
    if (myPlanListElement) {
        myPlanListElement.style.display = 'none';
    }

    const detailHtml = createPlanDetailHtml(planData, routeData);
    const collapseBody = document.querySelector('#collapseBody');
    if (collapseBody) {
        collapseBody.innerHTML = detailHtml;
    }

    // Post-render actions: initialize event listeners for the new detail view
    setTimeout(() => {
        adjustContentWidth();
        initMyPlanDetails();
    }, 0);
}

/**
 * Renders a view for when there are no plans.
 */
export function renderEmptyPlanList() {
    const planList = document.querySelector('.plan-list');
    if(planList) {
        planList.innerHTML = '<p>아직 생성된 여행 계획이 없습니다.</p>';
    }
    const createPlanButtonBox = document.querySelector('.plan-actions');
    if(createPlanButtonBox) {
        createPlanButtonBox.style.display = 'flex';
    }
}
