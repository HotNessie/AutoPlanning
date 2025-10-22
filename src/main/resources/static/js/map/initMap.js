//지도 기본 위치
import { setMapInstance } from '../store/map-store.js';
import { getCurrentPosition } from './position.js';

const DEFAULT_POS = { lat: 37.65564466099954, lng: 127.06206796919646 }; //default 위치 상수처리

export async function initMap(containerId = "map") {

  const { Map } = await google.maps.importLibrary("maps");
  const { ColorScheme } = await google.maps.importLibrary("core");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  let position;
  try {
    position = await getCurrentPosition();
  } catch {
    position = DEFAULT_POS;
    alert("위치정보를 가져올 수 없습니다. 기본 위치로 설정합니다.");
  }

  const map = new Map(document.getElementById(containerId), {
    center: position,
    zoom: 17,
    mapId: '281ecb2de2a0840c',
    language: 'ko',
    region: 'kr',
    disableDefaultUI: true,
    colorScheme: ColorScheme.DARK,
  });

  setMapInstance(map); //map정보 싱글톤으로 저장

  const parser = new DOMParser();
  const pinSvgString =
    `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <g fill="#c7d5ef">
          <circle cx="24" cy="24" r="12" fill-opacity="0.5"/>
        </g>
        <g fill="#fff">
          <circle cx="24" cy="24" r="6.5"/>
        </g>
        <g fill="#4284f4">
          <circle cx="24" cy="24" r="6"/>
        </g>
      </svg>
      `;
  const currentSvg = parser.parseFromString(
    pinSvgString,
    "image/svg+xml",
  ).documentElement;

  new AdvancedMarkerElement({
    position: map.getCenter(),
    map: map,
    content: currentSvg,
  });
  console.log(`${map.getCenter()}`);
  return map;
}