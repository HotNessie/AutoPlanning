//지도 기본 위치
// import { handleSearch } from './handlingSearch/handleSearch.js';
// import { findBySearch } from '../search/findBySearch.js';
// import { selectSuggestion, handleEmptyInput } from './handlingSearch/selectSuggestionEvent.js';
import { setMapInstance, getMapInstance } from '../store/map-store.js';
import { getCurrentPosition } from './position.js';
// import domElements from '../ui/dom-elements.js';;

const DEFAULT_POS = { lat: 37.65564466099954, lng: 127.06206796919646 }; //default 위치 상수처리

export async function initMap(containerId = "map") {
  // let map, infoWindow; //전역에서 함수 내부로 이동시킴

  const { Map } = await google.maps.importLibrary("maps");
  const { ColorScheme } = await google.maps.importLibrary("core");
  // const { Place, AutocompleteSessionToken, AutocompleteSuggestion } = await google.maps.importLibrary("places");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  // const { Geometry } = await google.maps.importLibrary("geometry");
  // window.googleGeometry = Geometry; // 전역에서 사용 가능하도록 저장

  // infoWindow = new google.maps.InfoWindow();

  //이거 기본값 어디드라
  // const defaultPos = { lat: 37.65564466099954, lng: 127.06206796919646 };

  //Default(current) location  
  // navigator.geolocation.getCurrentPosition(
  //   (position) => {
  //     const pos = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //     };
  //     createMap(pos);
  //     console.log(pos)
  //   }, () => {
  //     console.log("cannot get location");
  //     createMap(defaultPos);
  //   });  //현 위치 가져오기 실패하면..

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

  // function createMap(position) {
  //   map = new Map(document.getElementById("map"),
  //     {
  //       center: position,
  //       zoom: 17,
  //       mapId: '281ecb2de2a0840c',
  //       // mapId: 'CURRENT_POS',
  //       language: 'ko',
  //       region: 'kr',
  //       disableDefaultUI: true,
  //       colorScheme: ColorScheme.DARK,
  //     });
  // window.map = map; map도 전역화 했는데 이거 수정해야됨 일단 주석

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


//---------------------AutoComplete---------------------
//---------------------AutoComplete---------------------
//---------------------AutoComplete---------------------
// const token = new AutocompleteSessionToken();
// // const searchInput = document.getElementById("searchInput");

// //개발단계에서 너무 많은 api요청으로 임시 주석
// //개발단계에서 너무 많은 api요청으로 임시 주석
// //개발단계에서 너무 많은 api요청으로 임시 주석
// //개발단계에서 너무 많은 api요청으로 임시 주석
// domElements.getSearchInput().addEventListener("input", () => handleSearch(AutocompleteSuggestion, token, map));

// // searchInput.addEventListener("keydown", selectSuggestion);
// // searchInput.addEventListener("keyup", handleEmptyInput);
// // const suggestion = document.getElementById("suggestion");

// //searchButton을 통해 searchInput의 텍스트를 검색
// domElements.getSearchButton().addEventListener("click", () => findBySearch(Place, map, infoWindow));


// //---------------------------------------------------
// //---------------------------------------------------
// //---------------------------------------------------

// //커스텀 버튼 모음
// document.querySelector(".customCurrentPosition").addEventListener("click", () => currentPosition(map));
// document.querySelector(".customZoomIn").addEventListener("click", () => map.setZoom(map.getZoom() + 2));
// document.querySelector(".customZoomOut").addEventListener("click", () => map.setZoom(map.getZoom() - 2));
// }


// initMap();