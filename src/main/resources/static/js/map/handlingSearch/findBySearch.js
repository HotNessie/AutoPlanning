//검색, marker, bound지정
import { searchInput, suggestion } from '../dom-elements.js';
import { marker, markerManager } from '../marker.js';

export async function findBySearch(Place, map) {
    const inputText = searchInput.value.trim(); // 검색어 가져오기
    suggestion.style.display = "none";

    if (inputText === "") {
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
            // place 객체에 formattedAddress 속성 직접 추가 (없는 경우 대비)
            if (!place.formattedAddress && place.location) {
                try {
                    // 지오코딩으로 주소 가져오기
                    const geocoder = new google.maps.Geocoder();
                    const response = await new Promise((resolve) => {
                        geocoder.geocode({ 'location': place.location }, (results, status) => {
                            if (status === google.maps.GeocoderStatus.OK && results[0]) {
                                resolve(results[0].formatted_address);
                            } else {
                                resolve("");
                            }
                        });
                    });
                    place.formattedAddress = response;
                } catch (error) {
                    console.warn("주소를 가져오는 데 실패했습니다:", error);
                }
            }

            // 마커 생성
            const newMarker = await marker(map, place);
            markerManager.addMarker(newMarker);

            //zoom레벨 설정을 위한
            bounds.extend(place.location);

            return newMarker;
        });
        await Promise.all(markerPromises);
        // bounds 유효성 검사 후 적용
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