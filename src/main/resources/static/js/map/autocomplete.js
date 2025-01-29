let map;
let marker;
let infoWindow;

async function initMap() {
    // Request needed libraries.
    //@ts-ignore
    const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary("marker"),    //마커 쓸거임
        google.maps.importLibrary("places"),    //플레이스 쓸거임
    ]);


    //@ts-ignore
    const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement(); //자동완성

    //@ts-ignore
    placeAutocomplete.id = "place-autocomplete-input";

    const card = document.getElementById("autocomplete");

    //@ts-ignore
    card.appendChild(placeAutocomplete);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

    // Create the marker and infowindow
    😀😀😀marker = new google.maps.marker.AdvancedMarkerElement({  //마커 속성
        map,
    });
    infoWindow = new google.maps.InfoWindow({});
    // Add the gmp-placeselect listener, and display the results on the map.
    //@ts-ignor

    placeAutocomplete.addEventListener("gmp-placeselect", async ({ place }) => {
        await place.fetchFields({
            fields: ["displayName", "formattedAddress", "location"],
        });
        // If the place has a geometry, then present it on a map.
        if (place.viewport) {
            map.fitBounds(place.viewport);
        } else {
            map.setCenter(place.location);
            map.setZoom(17);
        }

        let content =
            '<div id="infowindow-content">' +
            '<span id="place-displayname" class="title">' +
            place.displayName +
            "</span><br />" +
            '<span id="place-address">' +
            place.formattedAddress +
            "</span>" +
            "</div>";

        updateInfoWindow(content, place.location);
        😀😀😀marker.position = place.location;
    });
}


initMap();