
//지도 기본 위치
//지도 기본 위치
let map, infoWindow;

async function initMap(){


        const position = {lat: 37.65564466099954, lng:127.06206796919646};

        const {Map} = await google.maps.importLibrary("maps");
        const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");

        map = new Map(document.getElementById("map"),
          {
            center: position,
            zoom: 17,
            mapId: 'DEMO_MAP_ID',
            language: 'ko',
            region: 'kr',
//            mapTypeId: google.maps.MapTypeId.TERRAIN,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
//            zoomControl: false
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
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                    };
                      infoWindow.setPosition(pos);
                      infoWindow.setContent("Location found.");
                      infoWindow.open(map);
                      map.setCenter(pos);
                },
              () => {
                handleLocationError(true, infoWindow, map.getCenter());
              });
//              nearRestaurant();
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
//marker
//marker       개선해야 됨
        const marker = new AdvancedMarkerElement({
            position: position,
            map: map,
            title: 'ezen'
        });

//nearBy
//nearBy
//    const service = new google.maps.places.PlacesService(map);
//    async function nearRestaurant(){
//        service.nearbySearch({
//            location: position,
//            radius: 500,
//            type: ['restaurant']
//        }, (results, status) => {
//            if (status === google.maps.places.PlacesServiceStatus.OK) {
////                for (let i = 0; i < results.length; i++) {
//                for (let i = 0; i < 10; i++) {
//                const marker = new AdvancedMarkerElement({
//                    position: results[i].geometry.location,
//                    map: map
//                });
//                }
//            }
//        });
//
//    }


}

function handleLocationError(browserHasGeolocation, infoWindow, pos){
      infoWindow.setPosition(pos);
      infoWindow.setContent(
          browserHasGeolocation
          ? 'Error: The Geolocation service failed.'
          : 'Error: Your browser doesn\'t support geolocation.'
      );
      infoWindow.open(map);
}

initMap();


//검색문구 추천
//검색문구 추천
let autocomplete;

async function initAutocomplete() {

    const {Autocomplete} = await google.maps.importLibrary("places");

    autocomplete = new Autocomplete(document.getElementById('autocomplete'),
          {
          //옵션
            types: ['establishment'], //검색어 자동 완성 건물명? 기준
            componentRestrictions:{'country':['KOR']},
            fields:['place_id','geometry','name']
          }
    );
    autocomplete.addListener('place_changed', onPlaceChanged);
}
initAutocomplete();

//검색 후
//검색 후
function onPlaceChanged() {

    var place = autocomplete.getPlace();

    if (!place.geometry){
        document.getElementById('autocomplete').placeholder = 'Enter a place';
    }else{
        document.getElementById('details').innerHTML = place.name;
    }

}