import { resetCollapseButtonStateWithAutoComplete, adjustContentWidth } from '../../../../ui/state-manager.js';
import { initRouteFormHandler } from '../selfContent.js';
import { initializeSearchEvents, initSearchResults, searchPlaceByInputId } from '../../selfFind.js';
import { removePlace, selectTransport } from '../place-form-manager.js';
import { getDynamicElements } from '../Event/formEvent.js';
import { cleanupFunctions } from '../../../../main.js';

function handleSelfContentActions(event) {
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
}

function applyDynamicElements(configs) {
  configs.forEach(({ selector, events }) => {
    const element = document.querySelector(selector);
    if (element) {
      events.forEach(({ event, callback }) => {
        element.addEventListener(event, callback);
      });
    }
  });
}

export function initializeSelfContentPage() {
  resetCollapseButtonStateWithAutoComplete(true);

  applyDynamicElements(getDynamicElements());

  adjustContentWidth();
  initializeSearchEvents();
  initSearchResults();
  setTimeout(() => initRouteFormHandler(), 100);

  // collapseBody를 직접 찾아서 이벤트 바인딩
  const collapseBody = document.getElementById('collapseBody');
  if (collapseBody) {
    collapseBody.addEventListener('click', handleSelfContentActions);
    cleanupFunctions.push(() => {
      collapseBody.removeEventListener('click', handleSelfContentActions);
    });
  }
}
