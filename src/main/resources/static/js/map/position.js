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


export async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }),
                error => reject(error)
            );
        } else {
            reject(new Error('Geolocation not supported'));
        }
    });
}

export async function centerMapToCurrentPosition(map) {
    try {
        const pos = await getCurrentPosition();
        map.setZoom(18);
        map.setCenter(pos);
    } catch (error) {
        console.error('Failed to center map:', error);
    }
}