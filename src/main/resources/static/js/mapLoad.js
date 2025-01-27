
//지도 기본 위치
//지도 기본 위치
let map, infoWindow;

async function initMap(){


        const position = {lat: 37.65564466099954, lng:127.06206796919646};

        const {Map} = await google.maps.importLibrary("maps");
        const {AdvancedMarkerElement, PinElement} = await google.maps.importLibrary("marker");
        const {ColorScheme} = await google.maps.importLibrary("core");

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
//                      map.setCenter(pos);
                      map.panTo(pos);
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
//        const scaleElement = new PinElement({
//          scale: 2,
//        });

        const marker = new AdvancedMarkerElement({
            position: position,
            map: map,
            title: 'ezen',
//            content: scaleElement.element
            gmpClickable: true,
            gmpDraggable: true,
        });

        marker.addListener('click', ({domEvent, latLng}) => {
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

        map.addListener('dragend',(event) => {
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