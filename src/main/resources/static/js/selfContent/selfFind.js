// selfContent에서 검색
import { cacheElement, bindEvent } from '../ui/dom-elements.js';
import { getMapInstance } from '../store/map-store.js';
import { createMarker, markerManager } from '../map/marker.js';
import { findBySearch } from '../search/findBySearch.js';

let currentPlaceInput = null;
let isSearchVisible = false;

// placeId로 검색
// searchPlaceByText 합쳐도 될 듯
export function searchPlaceByInputId(inputId) {
  const input = cacheElement("placeName", `#${inputId}`);
  if (!input.value) {
    return;
  }

  // 현재 입력 필드 설정
  currentPlaceInput = input;
  // 검색 실행
  findBySearch().then(() => {
    const searchResultsContainer = cacheElement("searchResultsContainer", "#searchResultsContainer");
    searchResultsContainer.classList.add("visible");
    isSearchVisible = true;
    // collapse 버튼 확장 TODO: 펼치는 버튼 이상하게 펼쳐짐 css조작해얃댐
    const collapseButton = cacheElement("collapseButton", "#collapseButton");
    collapseButton.classList.add("expanded");
  })
}

// initializePlaceEvents
//로드시마다 이벤트를 붙여줌 - 첫 HTML로드시에만 이벤트가 붙음 다시 로드할 때 이벤트가 없는 경우 대비
export function initializePlaceEvents(map) {
  const placeInputs = document.querySelectorAll(".placeInput input[type='text']");
  // console.log("초기 placeInputs 개수:", placeInputs.length);
  placeInputs.forEach(input => {
    if (!input.dataset.eventAttached) {
      bindEvent(input, "keydown", (event) => {
        if (event.key === "Enter" && input.name.startsWith("placeNames")) {
          event.preventDefault();
          searchPlaceByInputId(input.id);
        }
      });
      input.dataset.eventAttached = "true";
    }
  });

  const placeContainer = cacheElement("placeContainer", "#placeContainer");
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      if (m.addedNodes.length) {
        document.querySelectorAll(".placeInput input[type='text']").forEach(input => {
          if (!input.dataset.eventAttached) {
            bindEvent(input, "keydown", (event) => {
              if (event.key === "Enter" && input.name.startsWith("placeNames")) {
                event.preventDefault();
                searchPlaceByInputId(input.id);
              }
            });
            input.dataset.eventAttached = "true";
          }
        });
      }
    });
  });
  observer.observe(placeContainer, { childList: true, subtree: true });
  // console.log("placeContainer 관찰 시작");

  setTimeout(() => {
    document.querySelectorAll(".placeInput input[type='text']").forEach(input => {
      if (!input.value) {
        const nameInput = document.getElementById(input.id.replace('placeId', 'placeName'));
        createMarker(place, map).then(marker => {
          if (marker) {
            markerManager.addPlaceMarker(input.value, marker);
          }
        });
      };
    });
  }, 1000);
}

export function initSearchResults() {
  const searchResults = document.getElementById("searchResults");
  bindEvent(searchResults, "click", async (event) => {
    const resultItem = event.target.closest(".result-item");
    if (resultItem && currentPlaceInput) {
      const placeId = resultItem.dataset.placeId;
      const displayName = resultItem.querySelector(".place-name").textContent;

      currentPlaceInput.value = displayName; // 장소명 입력
      let placeIdInput;
      if (currentPlaceInput.id === "placeNameEnd") {
        placeIdInput = cacheElement("placeIdEnd", "#placeIdEnd");
      } else {
        const placeNum = currentPlaceInput.id.replace('placeName', '');
        placeIdInput = cacheElement(`placeId${placeNum}`, `#placeId${placeNum}`);
      }
      if (placeIdInput) {
        const prevValue = placeIdInput.value;
        placeIdInput.value = placeId;

        const changeEvent = new Event('change', { bubbles: true });
        placeIdInput.dispatchEvent(changeEvent);
        currentPlaceInput.style.border = ""; // 검증 오류 표시 제거
        if (prevValue) {
          markerManager.removePlaceMarker(prevValue);
        }
        const newMarker = await createMarker(placeId, getMapInstance()); //createMarker로 되어있는데 후에 plcaeId로 검색하는 경우는 따로 작성해야 됨
        if (marker) {
          markerManager.addPlaceMarker(placeId, newMarker);
          if (marker.position) {
            getMapInstance().panTo(marker.position);
            getMapInstance().setZoom(15);
          }
        }
        const transportInput = cacheElement(`transport${currentPlaceInput.id.replace('placeName', '')}`, `#transport${currentPlaceInput.id.replace('placeName', '')}`);
        if (transportInput) {
          transportInput.value = transportSelections[currentPlaceInput.id.replace('placeName', '')] || "TRANSIT";
        }
        const searchResultsContainer = cacheElement("searchResultsContainer", "#searchResultsContainer");
        searchResultsContainer.classList.remove("visible");
        const collapseButton = cacheElement("collapseButton", "#collapseButton");
        collapseButton.classList.remove("expanded");
        isSearchVisible = false;
      }
    }
  });
}










// // DOM 로드 후 selfContent 감지
// document.addEventListener("DOMContentLoaded", () => {

//   const observer = new MutationObserver((mutations) => {
//     mutations.forEach(mutation => {
//       if (mutation.addedNodes.length) {
//         const selfContent = document.querySelector(".selfContent");
//         if (selfContent) {
//           initializePlaceEvents(map);

//           // 페이지 로드 시 이미 채워진 placeId가 있으면 마커 생성
//           setTimeout(() => {
//             document.querySelectorAll('input[type="hidden"][name$=".placeId"]').forEach(input => {
//               if (input.value) {
//                 const nameInput = document.getElementById(input.id.replace('placeId', 'placeName'));
//                 createMarkerForPlace(input.value, nameInput ? nameInput.value : "", window.map)
//                   .then(marker => MarkerManager.addPlaceMarker(input.value, marker));
//               }
//             });
//           }, 1000); // 약간의 지연을 줘서 지도가 완전히 로드된 후 마커 생성

//           observer.disconnect(); // 초기화 후 감지 중단
//         }
//       }
//     });
//   });
//   observer.observe(document.body, { childList: true, subtree: true });
// });


// 이전 마커 제거
// export function removePreviousMarker(newPlaceId) {
//   // placeId input 요소 확인
//   const placeIdInputs = document.querySelectorAll('input[type="hidden"][name$=".placeId"]');

//   // 현재 hidden input 요소들의 값을 확인하여 해당 마커만 유지
//   const currentPlaceIds = Array.from(placeIdInputs).map(input => input.value).filter(id => id);

//   // 사용하지 않는 마커 제거
//   MarkerManager.removeUnusedMarkers(currentPlaceIds);
// }

// // 장소 검색 및 결과 표시
// async function searchPlaceByText(map) {
//   const { Place } = await google.maps.importLibrary("places");

//   if (!currentPlaceInput) {
//     alert("장소 입력 필드를 먼저 선택해주세요.");
//     return;
//   }

//   const inputText = currentPlaceInput.value.trim(); // 검색어 가져오기
//   if (inputText === "") {
//     alert("검색어를 입력해주세요.");
//     return;
//   }

//   const request = {
//     textQuery: inputText,
//     fields: [
//       "displayName",
//       "location",
//       "rating",
//       "userRatingCount",
//       "photos"
//     ],
//     maxResultCount: 20,
//   };

//   const { places } = await Place.searchByText(request);
//   console.log("검색 결과:", places); // 임시 확인용

//   // 검색 결과 표시
//   const searchResults = document.getElementById("searchResults");
//   const searchResultsContainer = document.getElementById("searchResultsContainer");
//   searchResults.innerHTML = ""; // 기존 결과 초기화

//   if (places.length) {
//     for (const place of places) {
//       const resultItem = document.createElement("div");
//       resultItem.className = "result-item";
//       resultItem.dataset.placeId = place.id; // placeId 저장
//       const photoURIs = place.photos
//         ? place.photos.slice(0, 3).map(photo => photo.getURI({ maxWidth: 100, maxHeight: 100 }))
//         : [];
//       resultItem.innerHTML = `
//                 <button class="place-name">${place.displayName}</button>
//                 <div class="place-rating">
//                     Rating: ${place.rating || "N/A"} 
//                     (${place.userRatingCount || "N/A"} reviews)
//                 </div>
//                 <div class="place-photos">
//                     ${photoURIs.map(uri => `<img src="${uri}" alt="${place.displayName}">`).join('')}
//                 </div>
//             `;
//       // 클릭 이벤트 추가
//       resultItem.addEventListener("click", async () => {
//         if (currentPlaceInput) {
//           currentPlaceInput.value = place.displayName; // 장소명 입력

//           // placeId를 hidden input에 저장
//           let placeIdInput;
//           if (currentPlaceInput.id === "placeNameEnd") {
//             // 도착지 처리
//             placeIdInput = document.getElementById("placeIdEnd");
//           } else {
//             // 일반 장소 처리 (placeName1, placeName2, ...)
//             const placeNum = currentPlaceInput.id.replace('placeName', '');
//             placeIdInput = document.getElementById(`placeId${placeNum}`);
//           }

//           if (placeIdInput) {
//             // 기존 값 저장
//             const prevValue = placeIdInput.value;

//             // 새 값 저장
//             placeIdInput.value = place.id;
//             console.log(`장소 ID ${place.id}가 ${placeIdInput.id}에 저장되었습니다.`);

//             // validation 상태 업데이트를 위한 change 이벤트 발생
//             const changeEvent = new Event('change', { bubbles: true });
//             placeIdInput.dispatchEvent(changeEvent);

//             // 입력 필드의 테두리 스타일 초기화 (검증 오류 표시 제거)
//             currentPlaceInput.style.border = "";

//             // 이전 마커 제거
//             if (prevValue) {
//               MarkerManager.removePlaceMarker(prevValue);
//             }

//             // 새 마커 생성
//             //이거 place정보를 이미 불러놨기 때문에 marker로 대체 가능해보임
//             const newMarker = await createMarkerForPlace(place.id, place.displayName, window.map);
//             MarkerManager.addPlaceMarker(place.id, newMarker);

//             // 마커가 생성된 위치로 지도 시점 이동 및 확대
//             if (newMarker && newMarker.position) {
//               // 마커 위치로 지도 중심 이동
//               window.map.panTo(newMarker.position);

//               // 적절한 줌 레벨 설정 (필요에 따라 조정)
//               window.map.setZoom(15);
//             }
//           } else {
//             console.error(`placeId를 저장할 input을 찾을 수 없습니다: ${currentPlaceInput.id}`);
//           }

//           const transportInput = document.getElementById(`transport${currentPlaceInput.id.replace('placeName', '')}`);
//           if (transportInput) transportInput.value = transportSelections[currentPlaceInput.id.replace('placeName', '')] || "TRANSIT";
//           searchResultsContainer.classList.remove("visible");
//           const collapseButton = document.getElementById("collapseButton");
//           collapseButton.classList.remove("expanded");
//           isSearchVisible = false;
//         }
//       });
//       searchResults.appendChild(resultItem);
//     }
//     searchResultsContainer.classList.add("visible"); // 컨테이너 보이게
//     isSearchVisible = true;
//   } else {
//     searchResults.innerHTML = "<p>검색 결과가 없습니다.</p>";
//     searchResultsContainer.classList.add("visible");
//     isSearchVisible = true;
//   }
// }



// // 단일 입력 필드에 이벤트 추가
// function attachEventsToSingleInput(input, map) {
//   // console.log("이벤트 추가 - 입력 필드 ID:", input.id);
//   //focus빼자 별로임
//   // input.addEventListener("focus", () => {
//   // currentPlaceInput = input;
//   // console.log("선택된 입력 필드:", currentPlaceInput.id);
//   // });
//   input.addEventListener("keydown", (event) => {
//     if (event.key === "Enter") {
//       if (input.name.startsWith("placeNames")) {
//         event.preventDefault();
//         searchPlaceByText(map);
//         const collapseButton = document.getElementById("collapseButton");
//         collapseButton.classList.add("expanded");
//       }
//     }
//   });
// }