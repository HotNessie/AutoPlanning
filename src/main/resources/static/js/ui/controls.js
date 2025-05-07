// Event 관리
import { getMapInstance } from '../store/map-store.js';
import { centerMapToCurrentPosition } from '../map/position.js';
import { fitAllMarkers, markerManager } from '../map/marker.js';
import { bindEvent } from './dom-elements.js';

export function initControls() {
  const map = getMapInstance();

  bindEvent('currentPosition', 'click', () => {
    console.log();
    centerMapToCurrentPosition(map);
  })
  bindEvent('zoomIn', 'click', () => map.setZoom(map.getZoom() + 2));
  bindEvent('zoomOut', 'click', () => map.setZoom(map.getZoom() - 2));
  bindEvent('fitMarkers', 'click', () => fitAllMarkers());
  bindEvent('clearRoutes', 'click', () => {
    markerManager.clearMarkers();
    // clearAllRoutes()는 selfContent.js에서 관리, 나중에 통합
  });
}