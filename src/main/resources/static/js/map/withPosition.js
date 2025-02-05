//현 위치 정의
export function currentPosition(map, infoWindow) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setZoom(18);
                map.setCenter(pos);

                const content =
                    `
                <div style="font-size:14px; line-height:1.5;">
                  <strong style="color:blue;">${place.title}</strong><br>
                  <span>Pin: ${position.lat}, ${position.lng}</span>
                </div>
              `;
                updateInfoWindow(content, pos);
            },
        );
    }

    function updateInfoWindow(content, center) {
        infoWindow.setContent(content);
        infoWindow.setPosition(center);
        infoWindow.open({
            map,
            // anchor: marker,
            shouldFocus: false,
        });
    }
}
// export default {
//     currentPosition
// }
