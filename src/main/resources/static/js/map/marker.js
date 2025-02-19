//marker
export async function marker(map, place) {
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

  // const scaleElement = new PinElement({
  // scale: 2,
  // });

  const infoWindow = new google.maps.InfoWindow();

  let photoUri = "";
  if (place.photos && place.photos.length > 0) {
    photoUri = await place.photos[0].getURI();
  }

  const content = `
            <div>
                ${photoUri ? `<img src="${photoUri}" alt="Photo" style="width: 100px; height: 100px;">` : ""}
            </div>
            <div style="font-size:14px; line-height:1.5;">
                <strong style="color:blue;">${place.displayName}</strong><br>
                <span>Rating: ${place.rating} (${place.userRatingCount} reviews)</span>
                <span>lat: ${place.location.lat()}, lng: ${place.location.lng()}</span>
            </div>
            `;

  const marker = new AdvancedMarkerElement({
    position: place.location,
    map: map,
    title: place.displayName,
    // gmpClickable: true,
    // gmpDraggable: true,
    // content: scaleElement.element
  });

  marker.addListener('click', ({ domEvent, latLng }) => {
    infoWindow.setContent(content)
    console.log(infoWindow)

    infoWindow.open(map, marker);
  });

  marker.addListener('mouseover', ({ domEvent, latLng }) => { //왜 안대....
    infoWindow.setContent(content)
    console.log(infoWindow)
    infoWindow.open(map, marker);
    console.log(infoWindow)
  });

  marker.addListener("mouseout", () => {
    infoWindow.close();
  });
  return marker;
}


// marker.addListener('dragend', (event) => {
//   const position = marker.position;
//   const content = `
//               <div style="font-size:14px; line-height:1.5;">
//                 <strong style="color:blue;">${marker.title}</strong><br>
//                 <span>Pin: ${position.lat}, ${position.lng}</span>
//               </div>
//             `;
//   infoWindow.close();
//   infoWindow.setContent(content);
//   infoWindow.open(marker.map, marker);
// })