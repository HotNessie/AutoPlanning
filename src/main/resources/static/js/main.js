// main.js
import { initMap } from './map/initMap.js';
import { initAutocomplete } from './search/autocomplete.js';
import { findBySearch } from './search/findBySearch.js';
import { initControls } from './ui/controls.js';
import { initDomElements, cacheElement, elements, bindEvent, bindDynamicElements } from './ui/dom-elements.js';
import { initSelfContent, initRouteFormHandler, addPlace, removePlace, selectTransport, resetConstentState } from './selfContent/selfContent.js';
import { initializePlaceEvents, initSearchResults, searchPlaceByInputId } from './selfContent/selfFind.js';
import { initUIState } from './ui/state-manager.js';

export const cleanupFunctions = [];

async function bootstrap() {
  console.log('bootstrap');
  await initMap();
  initDomElements();
  // initAutocomplete(); // 요청 너무 많아서 임시 주석
  initControls();
  initSelfContent();//selfContent.js
  // initSearchResults();//selfFind.js
  initializePlaceEvents();//selfFind.js
  elements.searchButton.addEventListener('click', () => findBySearch(searchInput.id));//autocomplete
  elements.searchInput.addEventListener('keydown',
    (event) => { if (event.key === 'Enter') { findBySearch(searchInput.id); } })//autocomplete

  // 동적 요소 정의 파일 다른데서 관리하는게 좋지 않을까? 되나?
  const dynamicElements = [
    { id: 'addPlace', selector: '#addPlaceBtn', events: [{ event: 'click', callback: addPlace }] },
    { id: 'routeForm', selector: '#routeForm', events: [] },
    { id: 'placeContainer', selector: '#placeContainer', events: [] },
    { id: 'searchResults', selector: '#searchResults', events: [{}] },
    { id: 'searchResultsContainer', selector: '#searchResultsContainer', events: [] },
    { id: 'collapseButton', selector: '#collapseButton', events: [] },
  ];

  // 메뉴 전환 로직
  // 메뉴 전환 로직
  // 메뉴 전환 로직
  const loadContent = async url => {
    const collapseBody = elements.collapseBody;
    const content = elements.content;
    const rightArrow = elements.rightArrow;
    const leftArrow = elements.leftArrow;
    const collapseButton = elements.collapseButton;
    const autocomplete = elements.autocomplete;

    try {
      cleanupEvents();
      const response = await fetch(url);
      if (!response.ok) throw new Error('응답 안함');
      const data = await response.text();
      // collapseBody.innerHTML = data;
      collapseBody.innerHTML = data;

      if (content.classList.contains('hide')) {
        content.classList.remove('hide');
        rightArrow.style.display = 'none';
        leftArrow.style.display = 'inline';
      }
      collapseButton.style.left = '100%';

      if (url === '/selfContent') {
        // resetConstentState();
        bindDynamicElements(dynamicElements);
        initSelfContent();
        initializePlaceEvents();
        initSearchResults();
        setTimeout(() => initRouteFormHandler(), 100);
      } else {
        autocomplete.classList.remove('autoComplete_displayNone');
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const observer = new MutationObserver(mutations => {
    if (mutations.some(m => m.addedNodes.length && document.querySelector('.selfContent'))) {
      bindDynamicElements(dynamicElements);
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
      cleanupEvents();
      loadContent(menu.url);
      selectMenu(menu.list, menu.svg, menu.span);
    });
  });

  // menus.forEach(menu => {
  //   bindEvent(menu.id, 'click', () => {
  //     console.log('click menu');
  //     cleanupEvents();
  //     loadContent(menu.url);
  //     selectMenu(menu.list, menu.svg, menu.span);
  //   });
  // });



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

  // 토글 버튼 with collapse
  collapseButton.addEventListener('click', () => {
    console.log('click collapseButton');

    const content = elements.content;
    const rightArrow = elements.rightArrow;
    const leftArrow = elements.leftArrow;
    const autoComplete = elements.autocomplete;
    const collapseButton = elements.collapseButton;
    const searchResultsContainer = document.querySelector('#searchResultsContainer');

    const isSelfContent = document.querySelector('.selfContent') !== null;

    content.classList.toggle('hide');
    console.log('click collapseButton');

    if (content.classList.contains('hide')) { //접혀있으면
      rightArrow.style.display = 'inline';
      leftArrow.style.display = 'none';
      collapseButton.style.left = '100%';
      console.log("searchResultsContainer", searchResultsContainer);
      if (isSelfContent && autoComplete) { //selfContent에서
        autoComplete.classList.remove('autoComplete_displayNone'); //autoComplete 안보이게
      }
      if (searchResultsContainer) {//접힌 상태에서 검색 결과가 있으면
        searchResultsContainer.classList.remove('visible'); //검색 결과 안보이게
        // collapseButton.classList.remove('expanded');
      }
    } else { //펼쳐져있으면
      rightArrow.style.display = 'none';
      leftArrow.style.display = 'inline';
      if (isSelfContent && autoComplete) {
        autoComplete.classList.add('autoComplete_displayNone');
      }
      // if (searchResultsContainer) {//펼쳐진 상태에서 검색 결과가 있으면
      //   searchResultsContainer.classList.add('visible');
      //   collapseButton.classList.add('expanded');
      // }
    }
    if (collapseButton.classList.contains('expanded')) { //collapseButton가 펼쳐져있으면 무조건 닫기
      collapseButton.classList.remove('expanded');
    }
  });

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

  // bindEvent('collapseBody', 'click', event => {
  //   const removeBtn = event.target.closest('.removePlaceBtn');
  //   const transportBtn = event.target.closest('.transport-btn'); //이거 addPlace로 새로 생긴 element에는 이벤트 적용 안됨
  //   const searchBtn = event.target.closest('.search-place-btn');
  //   if (removeBtn) {
  //     console.log('click removeButton', removeBtn);
  //     removePlace(removeBtn.dataset.placeId);
  //   } else if (transportBtn) {
  //     console.log('click transportBtn', transportBtn);
  //     selectTransport(transportBtn.dataset.placeid, transportBtn.dataset.transport);
  //   } else if (searchBtn) {


  //     console.log('click searchBtn', searchBtn);
  //     searchPlaceByInputId(searchBtn.dataset.inputId);
  //   }
  //   console.log('Click target:', event.target);
  // });

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


  // cacheElement('addPlace', '#addPlaceBtn');
  // bindEvent('addPlace', 'click', addPlace);
  console.log('elements', elements);
}

document.addEventListener('DOMContentLoaded', bootstrap);