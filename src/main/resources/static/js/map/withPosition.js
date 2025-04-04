//현 위치 정의
export function currentPosition(map) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setZoom(18);
                map.setCenter(pos);
            },
        );
    }
}
