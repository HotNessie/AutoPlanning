//지도 기본 위치
//지도 기본 위치
let map, infoWindow;

async function initMap() {

  const { Map } = await google.maps.importLibrary("maps");
  const { ColorScheme } = await google.maps.importLibrary("core");

  const position = { lat: 37.65564466099954, lng: 127.06206796919646 };

  //Default location  
  map = new Map(document.getElementById("map"),
    {
      center: position,
      zoom: 17,
      mapId: 'DEMO_MAP_ID',
      language: 'ko',
      region: 'kr',
      //            mapTypeId: google.maps.MapTypeId.TERRAIN,
      disableDefaultUI: true,
      colorScheme: ColorScheme.DARK
    }
  );

  infoWindow = new google.maps.InfoWindow();

  //현재위치 버튼
  //현재위치 버튼
  const locationButton = document.querySelector(".customCurrentPosition");
  const customZoomInButton = document.querySelector(".customZoomIn");
  const customZoomOutButton = document.querySelector(".customZoomOut");

  //현재위치 이동 이벤트 리스너
  //현재위치 이동 이벤트 리스너
  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");

          infoWindow.open(map);
          //                      map.setCenter(pos);
          map.panTo(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
  customZoomInButton.addEventListener("click", () => {
    map.setZoom(map.getZoom() + 1);
  });
  customZoomOutButton.addEventListener("click", () => {
    map.setZoom(map.getZoom() - 1);
  });
}










//marker
//marker       개선해야 됨
async function marker() {
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

  //        const scaleElement = new PinElement({
  //          scale: 2,
  //        });

  const marker = new AdvancedMarkerElement({
    position: map.getCenter(),
    map: map,
    title: 'test',
    gmpClickable: true,
    gmpDraggable: true,
    //            content: scaleElement.element
  });

  marker.addListener('click', ({ domEvent, latLng }) => {
    //          const { target } = domEvent;
    const position = marker.position;
    const content = `
              <div style="font-size:14px; line-height:1.5;">
                <strong style="color:blue;">${marker.title}</strong><br>
                <span>Pin: ${position.lat}, ${position.lng}</span>
              </div>
            `;
    infoWindow.close();
    infoWindow.setContent(content)
    infoWindow.open(marker.map, marker);
  });

  marker.addListener('dragend', (event) => {
    const position = marker.position;
    const content = `
              <div style="font-size:14px; line-height:1.5;">
                <strong style="color:blue;">${marker.title}</strong><br>
                <span>Pin: ${position.lat}, ${position.lng}</span>
              </div>
            `;
    infoWindow.close();
    infoWindow.setContent(content);
    infoWindow.open(marker.map, marker);

  })
}









//주변 장소 테스트
//주변 장소 테스트
async function findPlaces() {
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



  //이거 비활성 됐대 대체제 찾으셈
  //이거 비활성 됐대 대체제 찾으셈
  //이거 비활성 됐대 대체제 찾으셈
  //이거 비활성 됐대 대체제 찾으셈
  //이거 비활성 됐대 대체제 찾으셈
  //이거 비활성 됐대 대체제 찾으셈
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

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : 'Error: Your browser doesn\'t support geolocation.'
  );
  infoWindow.open(map);
}







initMap()
  .then(() => marker())
// .then(() => findPlaces())







//검색문구 추천
//검색문구 추천
let autocomplete;

async function initAutocomplete() {

  const { Autocomplete } = await google.maps.importLibrary("places");

  autocomplete = new Autocomplete(document.getElementById('autocomplete'),
    {
      //옵션
      types: ['establishment'], //검색어 자동 완성 건물명? 기준
      componentRestrictions: { 'country': ['KOR'] },
      fields: ['place_id', 'geometry', 'name']
    }
  );
  autocomplete.addListener('place_changed', onPlaceChanged);
}
initAutocomplete();

//검색 후
//검색 후
function onPlaceChanged() {

  var place = autocomplete.getPlace();

  if (!place.geometry) {
    document.getElementById('autocomplete').placeholder = 'Enter a place';
  } else {
    document.getElementById('details').innerHTML = place.name;
  }

}