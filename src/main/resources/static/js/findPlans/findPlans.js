
import { createPlansHtml } from '../myPlan/myPlanList.js';
import { attachClickListenersToNewItems } from '../myPlan/myPlanList.js';

/* 
* Title - 계획 검색 메뉴 진입 초기화
*/
let currentPage = 0;
const pageSize = 10;
let currentSort = 'createdDate,desc';
let isLoading = false;
let isLastPage = false;
let currentQuery = { title: '', region: '', keywords: '' };

export function initSearchPlans() {
  const contentBody = document.querySelector('#collapseSearchBody');
  const searchButton = document.querySelector('#search-plans-button');

  resetAndLoad();

  contentBody.addEventListener('scroll', () => {
    if (contentBody.scrollTop + contentBody.clientHeight >= contentBody.scrollHeight - 100) {
      if (!isLoading && !isLastPage) {
        loadMorePlans();
      }
    }
  });

  searchButton.addEventListener('click', () => {
    currentQuery.title = document.querySelector('#search-title').value;
    currentQuery.region = document.querySelector('#search-region').value;
    currentQuery.keywords = document.querySelector('#search-keywords').value;
    resetAndLoad();
  });

  function resetAndLoad() {
    const contentBody = document.querySelector('#collapseSearchBody');
    contentBody.innerHTML = '';
    currentPage = 0;
    isLastPage = false;
    loadMorePlans();
  }
}

async function loadMorePlans() {
  if (isLoading || isLastPage) return;
  isLoading = true;

  let url;
  const hasQuery = currentQuery.title || currentQuery.region || currentQuery.keywords;
  if (hasQuery) {
    url = '/api/public/plans/search?';
  } else {
    url = '/api/public/plans?';
  }
  if (currentQuery.title) url += `title=${currentQuery.title}&`;
  if (currentQuery.region) url += `region=${currentQuery.region}&`;
  if (currentQuery.keywords) url += `keywords=${currentQuery.keywords}&`;
  url += `page=${currentPage}&size=${pageSize}&sort=${currentSort}`;

  const contentBody = document.querySelector('#collapseSearchBody');

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const plansPage = await response.json();

    isLastPage = plansPage.last;
    const plans = plansPage.content;

    const plansHtml = createPlansHtml(plans);

    contentBody.innerHTML += plansHtml;
    currentPage++;

    attachClickListenersToNewItems();
  } catch (error) {
    console.error("Failed to load plans:", error);
  } finally {
    isLoading = false;
  }
}