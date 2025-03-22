//marker
export async function marker(map, place) {
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

  // const scaleElement = new PinElement({
  // scale: 2,
  // });

  const infoWindow = new google.maps.InfoWindow();

  // 장소 정보에서 사진 가져오기
  let photoHtml = "";
  if (place.photos && place.photos.length > 0) {
    try {
      const photoUri = await place.photos[0].getURI({ maxWidth: 150, maxHeight: 150 });
      photoHtml = `<img src="${photoUri}" alt="${place.displayName}" style="width:150px;height:auto;margin-bottom:8px;">`;
    } catch (error) {
      console.warn("사진을 가져오는 데 실패했습니다:", error);
    }
  }

  // 인포윈도우 내용 설정
  const content = `
    <div style="padding: 5px; max-width: 250px;">
      ${photoHtml}
      <div style="font-size:14px; line-height:1.5;">
        <strong style="color:#c154ec;">${place.displayName}</strong>
        ${place.formattedAddress ? `<p style="margin: 5px 0; font-size: 12px;">${place.formattedAddress}</p>` : ''}
        ${place.rating ? `<div>★ ${place.rating.toFixed(1)} (${place.userRatingCount || 0})</div>` : ''}
      </div>
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

  // 'gmp-click' 이벤트 사용
  marker.addListener('gmp-click', () => {
    infoWindow.setContent(content);
    infoWindow.open({
      anchor: marker,
      map: map
    });
  });

  // 'gmp-mouseover' 이벤트
  marker.addListener('gmp-mouseover', () => {
    infoWindow.setContent(content);
    infoWindow.open({
      anchor: marker,
      map: map
    });
  });

  // 'gmp-mouseout' 이벤트
  marker.addListener("gmp-mouseout", () => {
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