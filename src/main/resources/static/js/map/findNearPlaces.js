//주변 장소 검색 with 현재위치
//주변 장소 검색 with 현재위치
//주변 장소 검색 with 현재위치
//주변 장소 검색 with 현재위치
export async function nearbySearch(map,) {
    //@ts-ignore
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places",);

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    // Restrict within the map viewport.
    let center = new google.maps.LatLng(52.369358, 4.889258);
    const request = {
        // required parameters
        fields: ["displayName", "location", "businessStatus"],
        locationRestriction: {
            center: center,  //기준점
            radius: 500,    //500 범위
        },
        // optional parameters
        includedPrimaryTypes: ["restaurant"], //음식점 
        maxResultCount: 5,  //최대 5개
        rankPreference: SearchNearbyRankPreference.POPULARITY, //유명한거 기준
        language: "en-US",  // 언어설정 
        region: "us",  //지역
    };
    //@ts-ignore
    const { places } = await Place.searchNearby(request); //주변 검색 (request)를 기준으로

    if (places.length) { //값이 있으면
        console.log(places);

        const { LatLngBounds } = await google.maps.importLibrary("core"); //좌표 라이브러리  **확인 필요**
        const bounds = new LatLngBounds();

        // Loop through and get all the results.
        places.forEach((place) => {   //각 장소마다 마커 찍어줄거임
            const markerView = new AdvancedMarkerElement({
                map,
                position: place.location,
                title: place.displayName,
            });

            bounds.extend(place.location);
            console.log(place);
        });
        map.fitBounds(bounds);
    } else {
        console.log("No results");
    }
}