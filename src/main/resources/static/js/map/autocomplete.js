let map;
let marker;
let infoWindow;

async function initMap() {
    // Request needed libraries.
    //@ts-ignore
    const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary("marker"),    //마커 쓸거임
        google.maps.importLibrary("places"),    //플레이스 쓸거임
    ]);

    // Initialize the map.
    map = new google.maps.Map(document.getElementById("map"), { //map 기본
        center: { lat: 40.749933, lng: -73.98633 },
        zoom: 13,
        mapId: "4504f8b37365c3d0",
        mapTypeControl: false,
    });








    //@ts-ignore
    const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement(); //자동완성

    //@ts-ignore
    placeAutocomplete.id = "place-autocomplete-input";

    const card = document.getElementById("autocomplete");

    //@ts-ignore
    card.appendChild(placeAutocomplete);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);







    // Create the marker and infowindow
    😀😀😀marker = new google.maps.marker.AdvancedMarkerElement({  //마커 속성
        map,
    });
    infoWindow = new google.maps.InfoWindow({});
    // Add the gmp-placeselect listener, and display the results on the map.
    //@ts-ignore




    placeAutocomplete.addEventListener("gmp-placeselect", async ({ place }) => {
        await place.fetchFields({
            fields: ["displayName", "formattedAddress", "location"],
        });
        // If the place has a geometry, then present it on a map.
        if (place.viewport) {
            map.fitBounds(place.viewport);
        } else {
            map.setCenter(place.location);
            map.setZoom(17);
        }

        let content =
            '<div id="infowindow-content">' +
            '<span id="place-displayname" class="title">' +
            place.displayName +
            "</span><br />" +
            '<span id="place-address">' +
            place.formattedAddress +
            "</span>" +
            "</div>";

        updateInfoWindow(content, place.location);
        😀😀😀marker.position = place.location;
    });




}

// Helper function to create an info window.
function updateInfoWindow(content, center) {
    infoWindow.setContent(content);
    infoWindow.setPosition(center);
    infoWindow.open({
        map,
        anchor: marker,
        shouldFocus: false,
    });
}

initMap();




function initMap() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // 위치 정보를 받은 후에 Map 생성
            const map = new google.maps.Map(document.getElementById("map"), {
                center: pos,
                zoom: 17,
                mapId: 'DEMO_MAP_ID',
                language: 'ko',
                region: 'kr',
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
            });

            // 현재 위치에 마커 추가
            new google.maps.Marker({
                position: pos,
                map: map,
                title: "현재 위치",
            });
        },
        () => {
            // 위치 정보 가져오기 실패 시 기본 위치 사용
            console.error("위치 정보를 가져올 수 없습니다.");
            const defaultPos = { lat: 37.5665, lng: 126.9780 }; // 서울 시청 기준

            const map = new google.maps.Map(document.getElementById("map"), {
                center: defaultPos,
                zoom: 17,
                mapId: 'DEMO_MAP_ID',
                language: 'ko',
                region: 'kr',
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
            });

            new google.maps.Marker({
                position: defaultPos,
                map: map,
                title: "기본 위치 (서울 시청)",
            });
        }
    );
}
