// src/main/resources/static/js/page/myPage/myPlan/myPlan-templates.js
import { getTransportIcon } from "../../selfPage/selfPlanningDetails/selfPlan.js";
import { createAddPlaceModalHtml } from "../myPlanDetails/myPlanDetails-templates.js";

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
}

/**
 * Title - myPlanList의 각 계획 아이템 HTML 생성
 * @param {object} plan - plan data
 */
export function createPlanItemHtml(plan) {
  return `
      <div class="plan-item" data-plan-id="${plan.planId}" data-event-attached="false">
        <div class="plan-item-content">
          <div id="plan-item-header" class="plan-item-header">
            <div id="bookMark-button${plan.planId}" class="bookmark-button" style="display: inline">
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
}

/**
 * Title - myPlanDetail의 상세 뷰 HTML 생성
 * @param {object} plan - PlanResponseDto
 * @param {Array<object>} routes - List<RouteResponseDto>
 * @returns {string} - The HTML string for the detail view.
 */
export function createPlanDetailHtml(plan, routes) {
  let detailHtml = `<div class="planDetail-container" data-plan-id="${plan.planId}">`;
  detailHtml += `<h2 id="planDetail-title" class="planDetail-title" contenteditable="true">${plan.title}</h2>`;

  detailHtml += `<ol class="planDetail-list-box">`;

  routes.forEach((route, index) => {
    const place = route.place;
    const memo = route.memo;

    const placeCardHtml = `
      <li class="planDetail-card planDetail-place-card" draggable="true">
        <div class="myPlan-card-body">
          <span class="planDetail-day-svg-box">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48"><g fill="#c7d5ef"><circle cx="24" cy="24" r="12" fill-opacity="0.5" /></g><g fill="#575757"><circle cx="24" cy="24" r="6" /></g></svg>
            </div>
          </span>
          <div class="planDetail-day-card-content-grid" data-route-id="${route.routeId}">
            <div class="planDetail-place-details">
              <span class="planDetail-keyword-badge">장소</span>
              <div class="planDetail-main-content">
                <a href="/placeDetail?placeId=${place.placeId}" target="_blank" class="planDetail-place-link">${place.name}</a>
              </div>
              <div class="planDetail-sub-content">체류시간: <span id="planDetail-stay-time${route.routeId}" contenteditable="true"> ${route.stayTime}</span>분</div>
            </div>
            <div class="planDetail-memo-display" contenteditable="true">
              ${memo.trim() === '' ? '<span class="planDetail-no-memo">작성된 메모가 없습니다.</span>' : memo.replace(/\n/g, '<br>')}
            </div>
            <div id="deleteRouteButton" class="delete-route-button">
              <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 512.021 512.021" width="12" height="12">
                <g>
                  <path d="M301.258,256.01L502.645,54.645c12.501-12.501,12.501-32.769,0-45.269c-12.501-12.501-32.769-12.501-45.269,0l0,0   L256.01,210.762L54.645,9.376c-12.501-12.501-32.769-12.501-45.269,0s-12.501,32.769,0,45.269L210.762,256.01L9.376,457.376   c-12.501,12.501-12.501,32.769,0,45.269s32.769,12.501,45.269,0L256.01,301.258l201.365,201.387   c12.501,12.501,32.769,12.501,45.269,0c12.501-12.501,12.501-32.769,0-45.269L301.258,256.01z"/>
                </g>
              </svg>
            </div>
        </div>
      </li>
    `;
    detailHtml += placeCardHtml;

    const nextRoute = routes[index + 1];
    const transportIcon = getTransportIcon(route.transportMode);
    const isLast = index === routes.length - 1;

    const transportCardHtml = `
      <li class="planDetail-card planDetail-transport-card" ${isLast ? 'style="display: none;"' : ''}>
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
              <div class="planDetail-transport-route">${place.name} → ${nextRoute ? nextRoute.place.name : ''}</div>
              <div class="planDetail-transport-time">예상 소요시간: ${route.travelTime ?? '?'}분</div>
            </div>
          </div>
        </div>
      </li>
    `;
    detailHtml += transportCardHtml;
  });

  detailHtml += `<li id="add-place-sentinel" style="list-style: none;">${createAddPlaceModalHtml()}</li>`; // 장소 추가 버튼 및 모달 HTML 추가
  detailHtml += `</ol>`;
  detailHtml += `<div id="myPlanDescription" contenteditable="true" class="editable-textarea" style="margin-bottom: 12px;"> ${plan.description.trim() === '' ? '<span class="planDetail-no-description">설명이 없습니다.</span>' : plan.description}</div>`;
  detailHtml += `</div>`;
  return detailHtml;
}
