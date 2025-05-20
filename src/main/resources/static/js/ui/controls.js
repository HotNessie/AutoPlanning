// Event 관리
import { getMapInstance } from '../store/map-store.js';
import { centerMapToCurrentPosition } from '../map/position.js';
import { fitAllMarkers, markerManager } from '../map/marker.js';
import { bindEvent, elements } from './dom-elements.js';

export function initControls() {
  const map = getMapInstance();

  bindEvent('currentPosition', 'click', () => {
    console.log();
    centerMapToCurrentPosition(map);
  })
  elements.zoomIn.addEventListener('click', () => map.setZoom(map.getZoom() + 2));
  elements.zoomOut.addEventListener('click', () => map.setZoom(map.getZoom() - 2));
  elements.fitMarkers.addEventListener('click', () => fitAllMarkers());
  elements.clearRoutes.addEventListener('click', () => {
    markerManager.clearMarkers();
    // clearAllRoutes()는 selfContent.js에서 관리, 나중에 통합
  });
}