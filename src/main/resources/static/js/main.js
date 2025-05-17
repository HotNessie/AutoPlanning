// main.js
import { initMap } from './map/initMap.js';
import { initAutocomplete } from './search/autocomplete.js';
import { findBySearch } from './search/findBySearch.js';
import { initControls } from './ui/controls.js';
import { initDomElements, cacheElement, elements, bindEvent, bindDynamicElements } from './ui/dom-elements.js';
import { initSelfContent, initRouteFormHandler, addPlace, removePlace, selectTransport, resetConstentState, getDynamicElements } from './selfContent/selfContent.js';
import { initializePlaceEvents, initSearchResults, searchPlaceByInputId } from './selfContent/selfFind.js';
import { initUIState, resetUIState } from './ui/state-manager.js';

export const cleanupFunctions = [];

async function bootstrap() {
  console.log('bootstrap');
  await initMap();
  initDomElements();
  initUIState();
  // initAutocomplete(); // 요청 너무 많아서 임시 주석
  initControls();
  initSelfContent();//selfContent.js
  // initSearchResults();//selfFind.js
  initializePlaceEvents();//selfFind.js
  elements.searchButton.addEventListener('click', () => findBySearch(searchInput.id));//autocomplete
  elements.searchInput.addEventListener('keydown',
    (event) => { if (event.key === 'Enter') { findBySearch(searchInput.id); } })//autocomplete

  // 메뉴 전환 로직
  // 메뉴 전환 로직
  // 메뉴 전환 로직
  const loadContent = async url => {

    try {
      cleanupEvents();
      const response = await fetch(url);
      if (!response.ok) throw new Error('응답 안함');
      const data = await response.text();
      collapseBody.innerHTML = data;

      if (url === '/selfContent') {
        resetUIState(url === '/selfContent');
        // resetConstentState();  아직 안함
        bindDynamicElements(getDynamicElements());
        initSelfContent();
        initializePlaceEvents();
        initSearchResults();
        setTimeout(() => initRouteFormHandler(), 100);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const observer = new MutationObserver(mutations => {
    if (mutations.some(m => m.addedNodes.length && document.querySelector('.selfContent'))) {
      // bindDynamicElements(dynamicElements);
      bindDynamicElements(getDynamicElements());
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // 메뉴 버튼 이벤트 바인딩
  // 메뉴 버튼 이벤트 바인딩
  // 메뉴 버튼 이벤트 바인딩
  const menus = [
    { id: 'hotButton', url: '/hotContent', list: 'hot_content_list', svg: 'hot_menuSvg', span: 'hot_content_span' },
    { id: 'autoButton', url: '/autoContent', list: 'auto_content_list', svg: 'auto_menuSvg', span: 'auto_content_span' },
    { id: 'selfButton', url: '/selfContent', list: 'self_content_list', svg: 'self_menuSvg', span: 'self_content_span' },
    { id: 'bookmarkButton', url: '/bookmarkContent', list: 'bookmark_content_list', svg: 'bookmark_menuSvg', span: 'bookmark_content_span' },
    { id: 'historyButton', url: '/historyContent', list: 'history_content_list', svg: 'history_menuSvg', span: 'history_content_span' },
  ];

  menus.forEach(menu => {
    const element = document.querySelector(`#${menu.id}`);
    element.addEventListener('click', () => {
      console.log('click menu');
      // cleanupEvents();
      loadContent(menu.url);
      selectMenu(menu.list, menu.svg, menu.span);
    });
  });


  // 메뉴 선택 스타일 변경
  // 메뉴 선택 스타일 변경
  // 메뉴 선택 스타일 변경
  const selectMenu = (listId, svgId, spanId) => {
    document.querySelectorAll('.content_list').forEach(button => button.classList.remove('selected'));
    document.querySelectorAll('.menu_svg').forEach(svg => svg.classList.remove('menu_color'));
    document.querySelectorAll('.navbar_text').forEach(span => span.classList.remove('menu_color'));

    cacheElement(listId, `#${listId}`).classList.add('selected');
    cacheElement(svgId, `#${svgId}`).classList.add('menu_color');
    cacheElement(spanId, `#${spanId}`).classList.add('menu_color');
  };

  //collapse with SelfContent
  collapseBody.addEventListener('click', event => {
    if (event.isComposing) return;
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    const placeId = target.dataset.placeId;
    const inputId = target.dataset.inputId;
    const transport = target.dataset.transport;

    if (action === 'removePlace') { removePlace(placeId); console.log('click removeButton', action); }
    else if (action === 'selectTransport') { selectTransport(placeId, transport); console.log('click transportBtn', action); }
    else if (action === 'searchPlaceBtn') { searchPlaceByInputId(inputId); console.log('click searchBtn', action); }
  });

  collapseBody.addEventListener('keydown', event => {
    if (event.isComposing) return;
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    const inputId = target.id;

    if (event.key === 'Enter' && action === 'searchPlace') {
      event.preventDefault();
      searchPlaceByInputId(inputId);
      console.log('Enter searchBtn inputId:', inputId);
    }
  });

  function cleanupEvents() {
    cleanupFunctions.forEach(cleanup => cleanup());
    cleanupFunctions.length = 0;
    console.log('cleanupEvents');
  }

  console.log('elements', elements);
}

document.addEventListener('DOMContentLoaded', bootstrap);