//selfContent에서 검색
let markers = [];
let currentPlaceInput = null;
let isSearchVisible = false;

//기존 마커 삭제
function clearMarkers() {
  if (markers.length > 0) {
    markers.forEach((marker) => { marker.map = null; });
  }
  markers = [];
}
async function searchPlaceByText(map) {
  const { Place } = await google.maps.importLibrary("places");
  // console.log("searchPlaceByText 호출됨"); // 함수 호출 확인

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

  // clearMarkers();
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
      resultItem.addEventListener("click", () => {
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
            placeIdInput.value = place.id; // Google Places API의 ID 저장
            console.log(`장소 ID ${place.id}가 ${placeIdInput.id}에 저장되었습니다.`); // 디버깅용
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
  // console.log("DOM 로드 완료, map 존재:", !!map);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        const selfContent = document.querySelector(".selfContent");
        if (selfContent) {
          // console.log("selfContent 감지됨");
          initializePlaceEvents(map);
          observer.disconnect(); // 초기화 후 감지 중단
        }
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
});