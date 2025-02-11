//검색, marker, bound지정
import { searchInput, suggestion } from '../dom-elements.js';
import { marker } from '../marker.js';

let markers = [];

//기존 마커 삭제
function clearMarkers() {
    if (markers.length > 0) {
        markers.forEach((marker) => { marker.setMap(null); })
    }
    markers = [];
}

export async function findBySearch(Place, map, infoWindow) {
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
            // "currentOpeningHours.weekdayDescriptions",
            "photos"
        ], // 가져올 필드
        maxResultCount: 20,
        locationBias: {
            center: map.getCenter(),
            radius: 500,
        }
        // useStrictTypeFiltering: true, //빡씬 제한 (includedType를 기준으로 제한하는거임)
    };

    const { places } = await Place.searchByText(request);

    clearMarkers();

    //하나씩 마커 찍어주기
    if (places.length) {
        const bounds = new google.maps.LatLngBounds();

        const markerPromises = places.map(async (place) => {
            //marker
            let photoUri = "";

            if (place.photos && place.photos.length > 0) {
                photoUri = await place.photos[0].getURI();
            }
            const content = `
            <div>
                ${photoUri ? `<img src="${photoUri}" alt="Photo" style="width: 100px; height: 100px;">` : ""}
            </div>
            <div style="font-size:14px; line-height:1.5;">
                <strong style="color:blue;">${place.displayName}</strong><br>
                <span>Rating: ${place.rating} (${place.userRatingCount} reviews)</span>
            </div>
            `;
            const newMarker = await marker(map, place.location, place.displayName, infoWindow, content);
            markers.push(newMarker);

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