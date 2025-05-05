//검색, marker, bound지정
// import domElements from '../../ui/dom-elements.js';
// import { marker, MarkerManager } from '../marker.js';
import { cacheElement } from '../ui/dom-elements.js';
import { markerManager, createMarker } from '../map/marker.js';
import { getMapInstance } from '../store/map-store.js';

// export async function findBySearch(Place, map) {
export async function findBySearch() {
    const { Place } = await google.maps.importLibrary('places');
    const map = getMapInstance();
    const input = cacheElement('searchInput', '#searchInput');
    const suggestion = cacheElement('suggestion', '#suggestion');

    const inputText = input.value.trim(); // 검색어 가져오기

    suggestion.style.display = "none";

    if (!inputText) {
        alert("검색어를 입력해주세요.");
        return;
    }

    //요청 정보
    const request = {
        textQuery: inputText, // 검색어
        fields: [
            "displayName",
            "location",
            "rating",
            "userRatingCount",
            "photos",
            "formattedAddress" // 주소 정보 추가
        ], // 가져올 필드
        maxResultCount: 20,
        locationBias: {
            center: map.getCenter(),
            radius: 500,
        }
    };

    const { places } = await Place.searchByText(request);

    // 기존 마커 지우기
    markerManager.clearMarkers();


    //하나씩 마커 찍어주기
    if (places.length) {
        const bounds = new google.maps.LatLngBounds();

        const markerPromises = places.map(async (place) => {
            // 마커 생성
            const marker = await createMarker(place, map);
            //zoom레벨 설정을 위한
            bounds.extend(place.location);
            return marker;
        });
        await Promise.all(markerPromises);
        if (!bounds.isEmpty()) {
            map.fitBounds(bounds, {
                top: 100,
                right: 100,
                bottom: 100,
                left: 100
            });
            google.maps.event.addListenerOnce(map, "bounds_changed", () => {
                if (map.getZoom() > 17) {
                    map.setZoom(17);
                }
            });
        }
    } else {
        alert("검색 결과가 없습니다.");
    }
}