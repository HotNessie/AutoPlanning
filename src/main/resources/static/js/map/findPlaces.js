//지정 정보 기반 주변 탐색
//지정 정보 기반 주변 탐색
//지정 정보 기반 주변 탐색
export async function findPlaces(map,) {
    const { Place } = await google.maps.importLibrary("places");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const request = {
        textQuery: "Tacos in Mountain View", //이걸 찾을거
        fields: ["displayName", "location", "businessStatus"],
        includedType: "restaurant", //식당 태크를 포함하는지
        locationBias: { lat: 37.4161493, lng: -122.0812166 }, //이 좌표 기준으로 검색
        isOpenNow: true, //열려있는지
        language: "en-US",  //언어
        maxResultCount: 8,  //최대 표시 식당
        minRating: 3.2,  //최소 평점
        region: "us",  // 지역
        useStrictTypeFiltering: false, //엄격한 필터링
    };



    const { places } = await Place.searchByText(request); //위 정보를 기준으로 search

    if (places.length) {   //넘어온 정보가 있다면
        console.log(places);

        const { LatLngBounds } = await google.maps.importLibrary("core"); //좌표 정보 뽑는 라이브러리겠죠?
        const bounds = new LatLngBounds();

        // Loop through and get all the results.
        places.forEach((place) => {
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