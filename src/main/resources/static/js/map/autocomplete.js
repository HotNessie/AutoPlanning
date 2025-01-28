//검색문구 추천
//검색문구 추천
let autocomplete;

export async function initAutocomplete() {

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