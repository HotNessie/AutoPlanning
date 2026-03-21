// main.js
import { initMap } from './map/initMap.js';
import { initAutocomplete } from './handleGoogleApi/autocomplete.js';
import { findBySearch } from './handleGoogleApi/findBySearch.js';
import { getDynamicElements } from './page/selfPage/selfContent/Event/formEvent.js';
import { collapseButtonEvent, initControls } from './ui/state-manager.js';
import { fetchHtmlContent } from './core/apiService.js';
import { API } from './core/config.js';
import { initializeSelfContentPage } from './page/selfPage/selfContent/initializer/selfContent-initializer.js';
import { initializeMyPlanPage } from './page/myPage/myPlan/myPlan-initializer.js';
import { initializeSearchPlansPage } from './page/findPage/findPlans-initializer.js';
import { bookMarkButtonControllerInstance } from './bookMarkButton/bookmark.js';
import { loadPlan } from './page/myPage/myPlan/myPlan.js';

export const cleanupFunctions = [];

async function bootstrap() {
  console.log('bootstrap');
  await initMap();
  collapseButtonEvent();
  // initAutocomplete(); // 요청 너무 많아서 임시 주석
  initControls();
  bookMarkButtonControllerInstance.getMyBookmarkPlanList(); //북마크 플랜 리스트 가져오기

  // --- URL 파라미터 확인: 특정 계획 열기 요청 처리 ---
  const urlParams = new URLSearchParams(window.location.search);
  const openPlanId = urlParams.get('openPlanId');
  if (openPlanId) {
    const searchPlansButton = document.getElementById('searchPlansButton');
    if (searchPlansButton) {
      searchPlansButton.click(); // 1. 메뉴 전환
      setTimeout(() => loadPlan(openPlanId), 300); // 2. 지연 후 로드
    }
  }

  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');

  if (searchButton && searchInput) {
    searchButton.addEventListener('click', () => {
      findBySearch(searchInput.id);
    });

    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        if (event.isComposing) return;
        findBySearch(searchInput.id);
      }
    });
  }

  // 메뉴 전환 로직
  const pageInitializers = {
    [API.LOAD_SELF_CONTENT]: initializeSelfContentPage,
    [API.LOAD_MY_PLAN_LIST]: initializeMyPlanPage,
    [API.LOAD_SEARCH_PLANS]: initializeSearchPlansPage,
  };

  const loadContent = async url => {
    cleanupEvents();//메뉴 이동시 이전 이벤트 정리
    const data = await fetchHtmlContent(url);
    const collapseBody = document.getElementById('collapseBody');
    if (data && collapseBody) {
      collapseBody.innerHTML = data;
      const initializer = pageInitializers[url];
      if (initializer) {
        initializer();
      }
    }
  };

  const observer = new MutationObserver(mutations => {
    if (mutations.some(m => m.addedNodes.length && document.querySelector('.selfContent'))) {
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // 메뉴 버튼 이벤트 바인딩
  const menus = [
    { id: 'hotButton', url: API.LOAD_HOT_CONTENT, list: 'hot_content_list', svg: 'hot_menuSvg', span: 'hot_content_span' },
    { id: 'autoButton', url: API.LOAD_AUTO_CONTENT, list: 'auto_content_list', svg: 'auto_menuSvg', span: 'auto_content_span' },
    { id: 'selfButton', url: API.LOAD_SELF_CONTENT, list: 'self_content_list', svg: 'self_menuSvg', span: 'self_content_span' },
    { id: 'myPlanListButton', url: API.LOAD_MY_PLAN_LIST, list: 'bookmark_content_list', svg: 'bookmark_menuSvg', span: 'bookmark_content_span' },
    { id: 'searchPlansButton', url: API.LOAD_SEARCH_PLANS, list: 'searchPlans', svg: 'searchPlans_menuSvg', span: 'searchPlans_content_span' },
  ];

  menus.forEach(menu => {
    const element = document.querySelector(`#${menu.id}`);
    element.addEventListener('click', () => {
      console.log('click menu');
      loadContent(menu.url);
      selectMenu(menu.list, menu.svg, menu.span);
    });
  });


  // 메뉴 선택 스타일 변경
  const selectMenu = (listId, svgId, spanId) => {
    document.querySelectorAll('.content_list').forEach(button => button.classList.remove('selected'));
    document.querySelectorAll('.menu_svg').forEach(svg => svg.classList.remove('menu_color'));
    document.querySelectorAll('.navbar_text').forEach(span => span.classList.remove('menu_color'));

    const list = document.getElementById(listId);
    const svg = document.getElementById(svgId);
    const span = document.getElementById(spanId);

    if (list) list.classList.add('selected');
    if (svg) svg.classList.add('menu_color');
    if (span) span.classList.add('menu_color');
  };

  function cleanupEvents() {
    cleanupFunctions.forEach(cleanup => cleanup());
    cleanupFunctions.length = 0;
    console.log('cleanupEvents');
  }

}

document.addEventListener('DOMContentLoaded', bootstrap);