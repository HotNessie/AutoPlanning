//marker
//marker
//marker
//marker
export async function marker(map, infoWindow) {
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
    infoWindow.open(marker.map, marker); //이거 3줄 중복아님?

  })
}