
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
            mapTypeControl: false

          }
        );
        infoWindow = new google.maps.InfoWindow();

//현재위치 버튼
//현재위치 버튼
        const locationButton = document.createElement("button");
        const locationButton_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const locationButton_path = document.createElementNS("http://www.w3.org/2000/svg", "path");

        locationButton_svg.setAttribute('viewBox', '0 0 24 24'); // SVG 뷰박스 설정
        locationButton_path.setAttribute('d', 'M12,7c-2.757,0-5,2.243-5,5s2.243,5,5,5,5-2.243,5-5-2.243-5-5-5Zm0,9c-2.206,0-4-1.794-4-4s1.794-4,4-4,4,1.794,4,4-1.794,4-4,4Zm11.5-4.5h-1.513c-.253-5.117-4.37-9.234-9.487-9.487V.5c0-.276-.224-.5-.5-.5s-.5,.224-.5,.5v1.513C6.383,2.266,2.266,6.383,2.013,11.5H.5c-.276,0-.5,.224-.5,.5s.224,.5,.5,.5h1.513c.253,5.117,4.37,9.234,9.487,9.487v1.513c0,.276,.224,.5,.5,.5s.5-.224,.5-.5v-1.513c5.117-.253,9.234-4.371,9.487-9.487h1.513c.276,0,.5-.224,.5-.5s-.224-.5-.5-.5Zm-11.5,9.5c-4.962,0-9-4.037-9-9S7.038,3,12,3s9,4.037,9,9-4.038,9-9,9Z'); // 경로 데이터 설정

        locationButton.appendChild(locationButton_svg);
        locationButton_svg.appendChild(locationButton_path);

        locationButton.classList.add("custom-map-control-button"); //class
        map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(locationButton);

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
            } else {
            handleLocationError(false, infoWindow, map.getCenter());
          }
        });
//marker
//marker
        const marker = new AdvancedMarkerElement({
            position: position,
            map: map,
            title: 'ezen'
        });
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