//selfContent에서 검색
let markers = [];
let placeMarkers = {}; // placeId를 키로 하는 마커 객체 저장
let currentPlaceInput = null;
let isSearchVisible = false;

//기존 마커 삭제
function clearMarkers() {
  if (markers.length > 0) {
    markers.forEach((marker) => { marker.map = null; });
  }
  markers = [];
}

// 모든 장소 마커 제거
function clearAllPlaceMarkers() {
  for (const placeId in placeMarkers) {
    if (placeMarkers[placeId]) {
      placeMarkers[placeId].map = null;
    }
  }
  placeMarkers = {};
  console.log("모든 장소 마커가 지워졌습니다.");
}

// 전역에서 접근 가능하도록 설정
window.clearAllPlaceMarkers = clearAllPlaceMarkers;

// 마커 생성 함수
async function createMarkerForPlace(placeId, placeName) {
  try {
    // 이미 해당 placeId의 마커가 있으면 제거
    removePreviousMarker(placeId);

    // Geocoder 인스턴스 생성
    const geocoder = new google.maps.Geocoder();

    // Geocoder로 placeId를 좌표로 변환
    const result = await new Promise((resolve, reject) => {
      geocoder.geocode({ 'placeId': placeId }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            resolve(results[0]);
          } else {
            reject(new Error('No results found'));
          }
        } else {
          reject(new Error(`Geocoder failed: ${status}`));
        }
      });
    });

    // Places API를 사용하여 장소에 대한 더 자세한 정보 가져오기
    const placesService = new google.maps.places.PlacesService(window.map);
    const placeDetails = await new Promise((resolve, reject) => {
      placesService.getDetails(
        { placeId: placeId, fields: ['name', 'formatted_address', 'rating', 'user_ratings_total', 'photos'] },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(place);
          } else {
            // 상세 정보를 가져오지 못해도 기본 정보로 진행
            resolve({
              name: placeName || result.formatted_address,
              formatted_address: result.formatted_address
            });
          }
        }
      );
    });

    // 마커 생성
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const marker = new AdvancedMarkerElement({
      map: window.map,
      position: result.geometry.location,
      title: placeDetails.name || placeName || result.formatted_address
    });

    // 인포윈도우 생성
    const infoWindow = new google.maps.InfoWindow();

    // 인포윈도우 내용 설정
    let photoHtml = '';
    if (placeDetails.photos && placeDetails.photos.length > 0) {
      const photoUrl = placeDetails.photos[0].getUrl({ maxWidth: 150, maxHeight: 150 });
      photoHtml = `<img src="${photoUrl}" alt="${placeDetails.name}" style="width:150px;height:auto;margin-bottom:8px;">`;
    }

    const content = `
      <div style="padding: 5px; max-width: 250px;">
        ${photoHtml}
        <div style="font-size:14px; line-height:1.5;">
          <strong style="color:#c154ec;">${placeDetails.name || placeName}</strong>
          ${placeDetails.formatted_address ? `<p style="margin: 5px 0; font-size: 12px;">${placeDetails.formatted_address}</p>` : ''}
          ${placeDetails.rating ? `<div>★ ${placeDetails.rating.toFixed(1)} (${placeDetails.user_ratings_total || 0})</div>` : ''}
        </div>
      </div>
    `;

    // 'gmp-click' 이벤트 리스너 추가
    marker.addListener('gmp-click', () => {
      infoWindow.setContent(content);
      infoWindow.open({
        anchor: marker,
        map: window.map
      });
    });

    // 마커 저장
    placeMarkers[placeId] = marker;

    return marker;
  } catch (error) {
    console.error('마커 생성 중 오류:', error);
    return null;
  }
}

// 이전 마커 제거
function removePreviousMarker(newPlaceId) {
  // placeId input 요소 확인
  const placeIdInputs = document.querySelectorAll('input[type="hidden"][name$=".placeId"]');

  // 현재 hidden input 요소들의 값을 확인하여 해당 마커만 유지
  const currentPlaceIds = Array.from(placeIdInputs).map(input => input.value);

  // 더 이상 사용되지 않는 마커 제거
  for (const placeId in placeMarkers) {
    // 새로 추가하는 placeId이거나 현재 input에 없는 placeId인 경우 마커 제거
    if (placeId !== newPlaceId && !currentPlaceIds.includes(placeId)) {
      if (placeMarkers[placeId]) {
        placeMarkers[placeId].map = null;
        delete placeMarkers[placeId];
      }
    }
  }
}

async function searchPlaceByText(map) {
  const { Place } = await google.maps.importLibrary("places");

  if (!currentPlaceInput) {
    alert("장소 입력 필드를 먼저 선택해주세요.");
    return;
  }

  const inputText = currentPlaceInput.value.trim(); // 검색어 가져오기
  if (inputText === "") {
    alert("검색어를 입력해주세요.");
    return;
  }

  const request = {
    textQuery: inputText,
    fields: [
      "displayName",
      "location",
      "rating",
      "userRatingCount",
      "photos"
    ],
    maxResultCount: 20,
  };

  const { places } = await Place.searchByText(request);
  console.log("검색 결과:", places); // 임시 확인용

  // 검색 결과 표시
  const searchResults = document.getElementById("searchResults");
  const searchResultsContainer = document.getElementById("searchResultsContainer");
  searchResults.innerHTML = ""; // 기존 결과 초기화

  if (places.length) {
    for (const place of places) {
      const resultItem = document.createElement("div");
      resultItem.className = "result-item";
      resultItem.dataset.placeId = place.id; // placeId 저장
      const photoURIs = place.photos
        ? place.photos.slice(0, 3).map(photo => photo.getURI({ maxWidth: 100, maxHeight: 100 }))
        : [];
      resultItem.innerHTML = `
                <div class="place-name">${place.displayName}</div>
                <div class="place-rating">
                    Rating: ${place.rating || "N/A"} 
                    (${place.userRatingCount || "N/A"} reviews)
                </div>
                <div class="place-photos">
                    ${photoURIs.map(uri => `<img src="${uri}" alt="${place.displayName}">`).join('')}
                </div>
            `;
      // 클릭 이벤트 추가
      resultItem.addEventListener("click", async () => {
        if (currentPlaceInput) {
          currentPlaceInput.value = place.displayName; // 장소명 입력

          // placeId를 hidden input에 저장
          let placeIdInput;
          if (currentPlaceInput.id === "placeNameEnd") {
            // 도착지 처리
            placeIdInput = document.getElementById("placeIdEnd");
          } else {
            // 일반 장소 처리 (placeName1, placeName2, ...)
            const placeNum = currentPlaceInput.id.replace('placeName', '');
            placeIdInput = document.getElementById(`placeId${placeNum}`);
          }

          if (placeIdInput) {
            // 기존 값 저장
            const prevValue = placeIdInput.value;

            // 새 값 저장
            placeIdInput.value = place.id;
            console.log(`장소 ID ${place.id}가 ${placeIdInput.id}에 저장되었습니다.`);

            // 이전 마커 제거
            if (prevValue && placeMarkers[prevValue]) {
              placeMarkers[prevValue].map = null;
              delete placeMarkers[prevValue];
            }

            // 새 마커 생성
            await createMarkerForPlace(place.id, place.displayName);
          } else {
            console.error(`placeId를 저장할 input을 찾을 수 없습니다: ${currentPlaceInput.id}`);
          }

          const transportInput = document.getElementById(`transport${currentPlaceInput.id.replace('placeName', '')}`);
          if (transportInput) transportInput.value = transportSelections[currentPlaceInput.id.replace('placeName', '')] || "TRANSIT";
          searchResultsContainer.classList.remove("visible");
          const collapseButton = document.getElementById("collapseButton");
          collapseButton.classList.remove("expanded");
          isSearchVisible = false;
        }
      });
      searchResults.appendChild(resultItem);
    };
    searchResultsContainer.classList.add("visible"); // 컨테이너 보이게
    isSearchVisible = true;
  } else {
    searchResults.innerHTML = "<p>검색 결과가 없습니다.</p>";
    searchResultsContainer.classList.add("visible");
    isSearchVisible = true;
  }
}

// 단일 입력 필드에 이벤트 추가
function attachEventsToSingleInput(input, map) {
  // console.log("이벤트 추가 - 입력 필드 ID:", input.id);
  input.addEventListener("focus", () => {
    currentPlaceInput = input;
    // console.log("선택된 입력 필드:", currentPlaceInput.id);
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (input.name.startsWith("placeNames")) {
        event.preventDefault();
        searchPlaceByText(map);
        const collapseButton = document.getElementById("collapseButton");
        collapseButton.classList.add("expanded");
      }
    }
  });
}

function initializePlaceEvents(map) {
  const placeInputs = document.querySelectorAll(".placeInput input[type='text']");
  // console.log("초기 placeInputs 개수:", placeInputs.length);
  placeInputs.forEach(input => {
    if (!input.dataset.eventAttached) {
      attachEventsToSingleInput(input, map);
      input.dataset.eventAttached = "true";
    }
  });

  const placeContainer = document.getElementById("placeContainer");
  if (placeContainer) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          const newPlaceInputs = document.querySelectorAll(".placeInput input[type='text']");
          // console.log("동적 추가 후 placeInputs 개수:", newPlaceInputs.length);
          newPlaceInputs.forEach(input => {
            if (!input.dataset.eventAttached) {
              attachEventsToSingleInput(input, map);
              input.dataset.eventAttached = "true";
            }
          });
        }
      });
    });
    observer.observe(placeContainer, { childList: true, subtree: true });
    // console.log("placeContainer 관찰 시작");
  }
}

// DOM 로드 후 selfContent 감지
document.addEventListener("DOMContentLoaded", () => {
  const map = window.map;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        const selfContent = document.querySelector(".selfContent");
        if (selfContent) {
          initializePlaceEvents(map);

          // 페이지 로드 시 이미 채워진 placeId가 있으면 마커 생성
          setTimeout(() => {
            document.querySelectorAll('input[type="hidden"][name$=".placeId"]').forEach(input => {
              if (input.value) {
                const nameInput = document.getElementById(input.id.replace('placeId', 'placeName'));
                createMarkerForPlace(input.value, nameInput ? nameInput.value : "");
              }
            });
          }, 1000); // 약간의 지연을 줘서 지도가 완전히 로드된 후 마커 생성

          // form이 제출될 때 모든 마커 제거
          // const routeForm = document.getElementById("routeForm");
          // if (routeForm) {
          //   routeForm.addEventListener("submit", () => {
          //     clearAllPlaceMarkers();
          //   });
          // }

          observer.disconnect(); // 초기화 후 감지 중단
        }
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
});