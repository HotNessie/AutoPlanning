

let map;

  async function initMap(){

        const position = {lat: 37.65564466099954, lng:127.06206796919646};

        const {Map} = await google.maps.importLibrary("maps");
        const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");

        map = new Map(document.getElementById("map"),
          {
            center: position,
            zoom: 17,
            mapId: 'DEMO_MAP_ID',
          }
        );
        const marker = new AdvancedMarkerElement({
            position: position,
            map: map,
            title: 'ezen'
        });
    }
  initMap();

  let autocomplete;

  function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete'),
        {
          types: ['establishment'],
          componentRestrictions:{'country':['KOR']},
          fields:['place_id','geometry','name']
        }
    );
  }