// main.js
import { initMap } from './map/initMap.js';
import { initAutocomplete } from './search/autocomplete.js';
import { findBySearch } from './search/findBySearch.js';
import { initControls } from './ui/controls.js';
import { initDomElements, cacheElement, elements, bindEvent } from './ui/dom-elements.js';
import { initSelfContent, initRouteFormHandler, addPlace, removePlace, selectTransport } from './selfContent/selfContent.js';
import { initializePlaceEvents, initSearchResults, searchPlaceByInputId } from './selfContent/selfFind.js';

async function bootstrap() {
  console.log('bootstrap');
  await initMap();
  initDomElements();
  // initAutocomplete(); // 요청 너무 많아서 임시 주석
  initControls();
  initSelfContent();
  initSearchResults();
  initSearchResults();
  searchButton.addEventListener('click', findBySearch);

  // 메뉴 전환 로직
  const loadContent = async url => {
    const contentDiv = cacheElement('collapseBody', '#collapseBody');
    const content = cacheElement('content', '#content');
    const rightArrow = cacheElement('rightArrow', '#rightArrow');
    const leftArrow = cacheElement('leftArrow', '#leftArrow');
    const collapseButton = cacheElement('collapseButton', '#collapseButton');
    const autoComplete = cacheElement('autocomplete', '#autocomplete');

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('응답 안함');

      const data = await response.text();
      contentDiv.innerHTML = data;

      if (content.classList.contains('hide')) {
        content.classList.remove('hide');
        rightArrow.style.display = 'none';
        leftArrow.style.display = 'inline';
      }
      collapseButton.style.left = '100%';

      if (url === '/selfContent') {
        initializePlaceEvents();
        initSearchResults();
        setTimeout(() => initRouteFormHandler(), 100);
      } else {
        autoComplete.classList.remove('autoComplete_displayNone');
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  // 메뉴 버튼 이벤트 바인딩
  const menus = [
    { id: 'hotButton', url: '/hotContent', list: 'hot_content_list', svg: 'hot_menuSvg', span: 'hot_content_span' },
    { id: 'autoButton', url: '/autoContent', list: 'auto_content_list', svg: 'auto_menuSvg', span: 'auto_content_span' },
    { id: 'selfButton', url: '/selfContent', list: 'self_content_list', svg: 'self_menuSvg', span: 'self_content_span' },
    { id: 'bookmarkButton', url: '/bookmarkContent', list: 'bookmark_content_list', svg: 'bookmark_menuSvg', span: 'bookmark_content_span' },
    { id: 'historyButton', url: '/historyContent', list: 'history_content_list', svg: 'history_menuSvg', span: 'history_content_span' },
  ];

  menus.forEach(menu => {
    bindEvent(menu.id, 'click', () => {
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

    cacheElement(listId, `#${listId}`).classList.add('selected');
    cacheElement(svgId, `#${svgId}`).classList.add('menu_color');
    cacheElement(spanId, `#${spanId}`).classList.add('menu_color');
  };

  cacheElement('collapseButton', '#collapseButton');
  // 토글 버튼
  bindEvent('collapseButton', 'click', () => {
    console.log('click collapseButton');
    const content = cacheElement('content', '#content');
    const rightArrow = cacheElement('rightArrow', '#rightArrow');
    const leftArrow = cacheElement('leftArrow', '#leftArrow');
    const autoComplete = cacheElement('autocomplete', '#autocomplete');
    const isSelfContent = document.querySelector('.selfContent') !== null;

    content.classList.toggle('hide');
    console.log('click collapseButton');

    if (content.classList.contains('hide')) {
      rightArrow.style.display = 'inline';
      leftArrow.style.display = 'none';
      collapseButton.style.left = '100%';
      if (isSelfContent && autoComplete) {
        autoComplete.classList.remove('autoComplete_displayNone');
      }
    } else {
      rightArrow.style.display = 'none';
      leftArrow.style.display = 'inline';
      if (isSelfContent && autoComplete) {
        autoComplete.classList.add('autoComplete_displayNone');
      }
    }
  });

  //mutationObserver 후에 해야 될 듯?
  document.addEventListener('click', event => {
    const removeBtn = event.target.closest('.removePlaceBtn');
    const transportBtn = event.target.closest('.transport-Btn');
    const searchBtn = event.target.closest('.search-place-btn');
    console.log('click Button', removeBtn);
    if (removeBtn) {
      removePlace(removeBtn.dataset.placeId);
    } else if (transportBtn) {
      selectTransport(transportBtn.dataset.placeId, transportBtn.dataset.transport);
    } else if (searchBtn) {
      searchPlaceByInputId(searchBtn.dataset.inputId);
    }
  });

  cacheElement('addPlace', '#addPlaceBtn');
  bindEvent('addPlace', 'click', addPlace);//이거 addPlaceButton 할당 안했음
  console.log('elements', elements);
}

document.addEventListener('DOMContentLoaded', bootstrap);