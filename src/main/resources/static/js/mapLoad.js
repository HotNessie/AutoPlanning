    //var mapOptions = {
    //    center: new naver.maps.LatLng(37.5666103, 126.9783882)
    //};

    var map = new naver.maps.Map('map',{
        center: new naver.maps.LatLng(37.5666805, 126.9784147),
        zoom: 17,
        mapTypeId: naver.maps.MapTypeId.NORMAL
    });
    //----------------------------------------------------------------

    //onload를 통해서 페이지 진입 시 현재 위치를 보여주는 코드
    //onload를 통해서 페이지 진입 시 현재 위치를 보여주는 코드
    //onload를 통해서 페이지 진입 시 현재 위치를 보여주는 코드
    var infowindow = new naver.maps.InfoWindow();

    function adjustCenterWithOffset(x, y) {
        // 지도 중심을 px 단위로 이동
        map.panBy(x, y);
    }

    function onSuccessGeolocation(position) {
        var location = new naver.maps.LatLng(position.coords.latitude,
                                             position.coords.longitude);

        map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
        map.setZoom(18); // 지도의 줌 레벨을 변경합니다.

        adjustCenterWithOffset(-190, 0); // 지도 위치 조정용 이거 맨날 적기 싫은데 방법 없나...

        infowindow.setContent('<div style="padding:20px;">' + 'geolocation.getCurrentPosition() 위치' + '</div>');

        infowindow.open(map, location);
        //console.log('Coordinates: ' + location.toString());
    }

    function onErrorGeolocation() {
        var center = map.getCenter();

        infowindow.setContent('<div style="padding:20px;">' +
            '<h5 style="margin-bottom:5px;color:#f00;">Geolocation failed!</h5>'+
            "latitude: "+ center.lat() +"<br />longitude: "+ center.lng() +'</div>');

        infowindow.open(map, center);
    }

window.addEventListener("load", function() {
    if (navigator.geolocation) {
        /**
         * navigator.geolocation 은 Chrome 50 버젼 이후로 HTTP 환경에서 사용이 Deprecate 되어 HTTPS 환경에서만 사용 가능 합니다.
         * http://localhost 에서는 사용이 가능하며, 테스트 목적으로, Chrome 의 바로가기를 만들어서 아래와 같이 설정하면 접속은 가능합니다.
         * chrome.exe --unsafely-treat-insecure-origin-as-secure="http://example.com"
         */
        navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
    } else {
        var center = map.getCenter();
        infowindow.setContent('<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5></div>');
        infowindow.open(map, center);

         adjustCenterWithOffset(-190, 0);
    }
});


    //----------------------------------------------------------------

    //비동기
    //var map = null;

    //function initMap() {
    //    map = new naver.maps.Map(document.querySelector('.map'), {
    //        center: new naver.maps.LatLng(37.3595704, 127.105399),
    //        zoom: 10
    //    });
    //}

    //지도 호출 실패
    window.navermap_authFailure = function () {
        console.log('fail to load navermap');
    }