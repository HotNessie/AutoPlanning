//장소 세부 가져오기  사진
//장소 세부 가져오기
//장소 세부 가져오기
export async function getPlaceDetails(infoWindow) {
    const { Place } = await google.maps.importLibrary("places");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    // Use place ID to create a new Place instance.
    const place = new Place({
        id: "ChIJN5Nz71W3j4ARhx5bwpTQEGg",  //장소 만들기 위해 필요한 ID
        requestedLanguage: "en", // optional
    });

    // Call fetchFields, passing the desired data fields.
    await place.fetchFields({
        fields: ["displayName", "formattedAddress", "location", "photos", "reviews"],
    });
    // Add the first photo to an img element.
    const photoImg = document.getElementById('image-container'); //사진정보 
    photoImg.src = place.photos[0].getURI({ maxHeight: 400 });  //사진정보 
    let name = place.photos[0].authorAttributions[0].displayName;  //사진정보 
    let url = place.photos[0].authorAttributions[0].uri;  //사진정보 
    let authorPhoto = place.photos[0].authorAttributions[0].photoURI; //사진정보

    if (place.reviews && place.reviews.length > 0) {
        // Get info for the first review.
        let reviewRating = place.reviews[0].rating;
        let reviewText = place.reviews[0].text;
        let authorName = place.reviews[0].authorAttribution.displayName;
        let authorUri = place.reviews[0].authorAttribution.uri;
        //publishTime(날짜) 및 relativePublishTimeDescription(현재 시간과 관련된 검토 시간(예: '한 달 전'))
        //장소의 전체 평점을 가져오려면 Place.rating 속성을 사용하세요 (fetchFields() 요청 매개변수에서 rating 필드를 요청해야 함).



        // Format the review using HTML.
        contentString = `
              <div id="title"><b>${place.displayName}</b></div>
              <div id="address">${place.formattedAddress}</div>
              <a href="${authorUri}" target="_blank">Author: ${authorName}</a>
              <div id="rating">Rating: ${reviewRating} stars</div>
              <div id="rating"><p>Review: ${reviewText}</p></div>`;
    } else {
        contentString = "No reviews were found for " + place.displayName + ".";
    }
    // Create an infowindow to display the review.
    infoWindow = new InfoWindow({
        content: contentString,
        ariaLabel: place.displayName,
    });

    // Log the result
    console.log(place.displayName);  //장소의 정보를 이렇게 뽑을 수 있음
    console.log(place.formattedAddress);

    // Add an Advanced Marker
    const marker = new AdvancedMarkerElement({
        map,
        position: place.location,
        title: place.displayName,
    });
}