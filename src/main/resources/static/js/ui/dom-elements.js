// export default {
//   getSearchInput: () => document.getElementById("searchInput"),
//   getResultsElement: () => document.getElementById("results"),
//   getSuggestion: () => document.getElementById("suggestion"),
//   getSearchButton: () => document.getElementById("searchButton"),
// };

// dom-elements 캐싱
const elements = {};

export const cacheElement = (id, selector) => {
  elements[id] = document.querySelector(selector);
  return elements[id];
};

export const bindEvent = (id, event, callback) => {
  const element = elements[id];
  if (element) {
    element.addEventListener(event, callback);
    return () => element.removeEventListener(event, callback); // Cleanup function
  }
};

export const getElement = id => elements[id];

// 초기 캐싱
export function initDomElements() {
  cacheElement('searchInput', '#searchInput');
  cacheElement('results', '#results');
  cacheElement('suggestion', '#suggestion');
  cacheElement('searchButton', '#searchButton');
  cacheElement('currentPosition', '.customCurrentPosition');
  cacheElement('zoomIn', '.customZoomIn');
  cacheElement('zoomOut', '.customZoomOut');
  cacheElement('fitMarkers', '#fitMarkersBtn');
  cacheElement('clearRoutes', '.clearRoutesBtn');
}