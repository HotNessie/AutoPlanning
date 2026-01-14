import { extractKeywords } from "../hashtag/hashtag.js";
import { currentMyPlanAndRoutes, loadPlan } from './myPlanList.js';
import { googleSearchResultsManager } from '../selfContent/searchResult.js';

/* 
Title - myPlanDetails 페이지에서 메모 및 설명 편집 처리
*/

export function editMyPlanDetails() {

  const planContainer = document.querySelector('.planDetail-container');

  if (!planContainer || planContainer.dataset.memoListenerAttatched === "true") return;

  planContainer.dataset.memoListenerAttatched = "true";

  const planId = planContainer.getAttribute('data-plan-id');
  // Escape 키로 포커스 아웃
  planContainer.addEventListener('keyup', (e) => {
    if (e.key === 'Escape' && e.target.matches('.planDetail-memo-display')) {
      e.target.blur();
    }
  });

  let previousTitle = '';
  let previousMemo = '';
  let previousDescription = '';
  let previousKeywords = [];
  let previousStayTime = '';


  planContainer.addEventListener('focusin', (event) => {

    // 기존 값을 저장
    if (event.target.matches('.planDetail-memo-display')) {
      const memoDiv = event.target;
      previousMemo = memoDiv.innerText;
    } else if (event.target.matches('#myPlanDescription')) {
      const editor = document.querySelector('#myPlanDescription');
      previousDescription = editor.innerHTML;
      previousKeywords = extractKeywords(editor);
    } else if (event.target.matches('[id^="planDetail-stay-time"]')) {
      previousStayTime = event.target.innerText;
    } else if (event.target.matches('#planDetail-title')) {
      previousTitle = event.target.innerText;
    }
  });

  planContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      //블러처리 (포커스 아웃)
      if (e.target.matches('[contenteditable="true"]')) {
        e.target.blur();
      }
    }
  });

  // 포커스 아웃 시 메모 저장
  planContainer.addEventListener('blur', (event) => {

    if (event.target.matches('.planDetail-memo-display')) {

      const memoDiv = event.target;

      if (previousMemo === memoDiv.innerText) return;

      const routeSequence = memoDiv.closest('.planDetail-day-card-content-grid').getAttribute('data-route-id');
      const memo = memoDiv.innerText;
      console.log('Focused on memo for routeId:', routeSequence, 'Current memo:', memo);

      //서버에 메모 저장
      fetch(`/api/private/route/${planId}&${routeSequence}/memo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          memo: memo
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('메모 저장에 실패했습니다.');
          }
        })
        .then(() => {
          console.log('메모가 성공적으로 저장되었습니다.:', planId, routeSequence, memo);
        })
        .catch(error => {
          console.error('Error:', error);
          alert('메모 저장 중 오류가 발생했습니다.');
        })
    }
    // 설명 수정
    else if (event.target.matches('#myPlanDescription')) {
      const editor = document.querySelector('#myPlanDescription');
      if (!editor) return;
      if (previousDescription === editor.innerHTML) return;

      fetch(`/api/private/plan/${planId}/description`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: editor.innerHTML
        })
      }).then(response => {
        if (!response.ok) {
          throw new Error('설명 저장에 실패했습니다.');
        }
      });
      // 키워드 저장
      const currentKeywords = extractKeywords(editor);
      if (previousKeywords === currentKeywords) return;
      fetch(`/api/private/plan/${planId}/keywords`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keywords: currentKeywords
        })
      }).then(response => {
        if (!response.ok) {
          throw new Error('키워드 저장에 실패했습니다.');
        }
      });
    }
    // 체류시간 수정
    else if (event.target.matches('[id^="planDetail-stay-time"]')) {
      const subContentDiv = event.target;
      const routeSequence = subContentDiv.closest('.planDetail-day-card-content-grid').getAttribute('data-route-id');
      const newStayTime = subContentDiv.innerText;
      if (previousStayTime === newStayTime || Number.isFinite(newStayTime)) return;

      fetch(`/api/private/route/${planId}&${routeSequence}/stayTime`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stayTime: newStayTime
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('체류시간 저장에 실패했습니다.');
          }
        })
    }
    // 제목 수정
    else if (event.target.matches('#planDetail-title')) {
      const titleElement = event.target;
      const newTitle = titleElement.innerText;
      if (previousTitle === newTitle) return;

      fetch(`/api/private/plan/${planId}/title`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newTitle
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('제목 저장에 실패했습니다.');
          }
        })
    }
  }, true);
}

export function addPlace() {
  const addPlaceBtn = `
  <button id="myPlanDetail-add-place-btn" class="myPlanDetail-add-place-btn"
    popovertarget="myPlanDetail-add-place-modal">+</button>

  <div id="myPlanDetail-add-place-modal" class="myPlanDetail-add-place-modal" popover>
    <div id="myPlanDetail-add-place-modal-title" class="myPlanDetail-add-place-modal-title">장소 검색</div>
    <input type="text" id="myPlanDetail-add-place-input" class="myPlanDetail-add-place-input"
      placeholder="장소 이름을 입력하세요." />

    <div id="myPlanDetail-add-place-search-result" class="myPlanDetail-add-place-search-result">
      <ol id="myPlanDetail-add-place-result-list" class="myPlanDetail-add-place-result-list" style="padding:0">
      </ol>
    </div>

    <section id="myPlanDetail-add-place-selected-place-section">
      <ol id="myPlanDetail-add-place-selected-place" class="myPlanDetail-add-place-selected-place" style="padding:0">
        <div id="myPlanDetail-add-place-selected-place-title" class="myPlanDetail-add-place-selected-place-title">선택된 장소
        </div>
      </ol>
  
      <div id="myPlanDetail-add-place-action-btns" class="myPlanDetail-add-place-action-btns">
        <button id="myPlanDetail-add-place-cancel-btn" class="myPlanDetail-add-place-cancel-btn"
          popovertarget="myPlanDetail-add-place-modal">취소</button>
        <button id="myPlanDetail-add-place-confirm-btn" class="myPlanDetail-add-place-confirm-btn"
          popovertarget="myPlanDetail-add-place-modal">추가</button>
      </div>
    </section>
  </div>
  `;
  setTimeout(() => {
    attachAddPlaceForMyPlanDetail();
  }, 0);

  return addPlaceBtn;
}

//Title - myPlanDetails 모달에서 장소 추가 처리
function attachAddPlaceForMyPlanDetail() {
  // 장소 검색
  async function searchPlaces() {
    const inputText = document.getElementById('myPlanDetail-add-place-input').value;
    console.log("검색어:", inputText);

    const { Place } = await google.maps.importLibrary('places');

    const request = {
      textQuery: inputText,
      fields: [
        'displayName',
        "location",
        "rating",
        "userRatingCount",
        "formattedAddress"
      ],
      maxResultCount: 1,
    };
    const { places } = await Place.searchByText(request);

    // 검색 결과를 googleSearchResultsManager에 설정
    googleSearchResultsManager.setResults(places);
    console.log("googleSearchResultsManager:", googleSearchResultsManager.getAllResults());

    return places;
  }

  // 엔터키 입력 시 장소 검색
  document.querySelector('#myPlanDetail-add-place-input').addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (event.isComposing) return;
      const places = await searchPlaces();
      console.log("검색 결과:", places);

      const resultList = document.getElementById('myPlanDetail-add-place-result-list');
      resultList.innerHTML = '';

      // 검색 결과 fragment 생성
      const fragment = document.createDocumentFragment();
      places.forEach((place, index) => {
        const listItem = document.createElement('li');
        listItem.id = `myPlanDetail-add-place-result-item-${index}`;
        listItem.style = "list-style:none;"
        listItem.textContent = `${place.displayName} - ${place.formattedAddress}`;
        listItem.dataset.index = index;
        fragment.appendChild(listItem);
      });
      resultList.appendChild(fragment);
    }
  });

  // 선택된 장소 관리 클래스
  class SelectedPlace {
    selectedItems = [];

    addItem(item) {
      this.selectedItems.push(item);
    }
    removeItem(index) {
      this.selectedItems = this.selectedItems.filter(i => i !== index);
    }
    getItems() {
      return this.selectedItems;
    }
  }
  const selectedPlaceList = new SelectedPlace();

  // 검색 결과에서 장소 선택 시
  // 선택된 장소를 selectedPlaceList에 추가
  document.getElementById('myPlanDetail-add-place-result-list').addEventListener('click', (event) => {
    const selectedPlace = document.querySelector('#myPlanDetail-add-place-selected-place');

    if (event.target.tagName === 'LI') {

      const index = event.target.dataset.index;
      console.log("선택된 장소 인덱스:", index);

      selectedPlaceList.addItem(googleSearchResultsManager.getResults(index));
      console.log("선택된 장소 목록:", selectedPlaceList.getItems());

      //selectedItem 추가
      const selectedItem = `
        <li class="myPlanDetail-add-place-selected-item" style="list-style:none;">${event.target.textContent.split(' - ')[0]}
          <button class="myPlanDetail-add-place-remove-btn" data-index="${index}">x</button>
          </li>
          `;
      selectedPlace.innerHTML += selectedItem;
    }
  });

  // 선택된 장소에서 제거 버튼 클릭 시
  document.getElementById('myPlanDetail-add-place-selected-place').addEventListener('click', (event) => {
    if (event.target.classList.contains('myPlanDetail-add-place-remove-btn')) {
      const selectedList = document.querySelectorAll('.myPlanDetail-add-place-selected-item');

      const deleteList = event.target.parentNode;
      selectedList.forEach((item, index) => {
        if (item === deleteList) {
          selectedPlaceList.removeItem(index);
          console.log('selectedPlaceList:', selectedPlaceList.getItems());
          console.log('삭제된 항목 인덱스:', index);
        }
      });
      deleteList.remove();
    }
  });

  // 추가 버튼 클릭 시
  document.querySelector('#myPlanDetail-add-place-confirm-btn').addEventListener('click', async () => {
    const selectedPlacesFromGoogle = selectedPlaceList.getItems();
    const plan = currentMyPlanAndRoutes.getCurrentPlan();

    if (!plan || !plan.planId) {
      console.error('Plan 정보가 없습니다. API 호출을 중단합니다.');
      return;
    }

    try {
      // 1단계: 모든 장소를 생성/업데이트
      const placeCreatePromises = selectedPlacesFromGoogle.map(place => {
        const placeCreateDto = {
          placeId: place.id,
          name: place.displayName,
          address: place.formattedAddress,
          latitude: place.location.lat(), // 메서드 호출
          longitude: place.location.lng() // 메서드 호출
        };
        return fetch('/api/public/places', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(placeCreateDto)
        });
      });

      const responses = await Promise.all(placeCreatePromises);

      // 모든 장소 생성/업데이트가 성공했는지 확인
      for (const response of responses) {
        if (!response.ok) {
          throw new Error('장소 생성/업데이트에 실패했습니다: ' + await response.text());
        }
      }
      console.log('모든 장소 DB에 저장/업데이트 성공!');

      // 2단계: 경로 추가 및 계획 업데이트
      const routeInfo = {
        placeNames: selectedPlacesFromGoogle.map(place => ({
          placeId: place.id,
          name: place.displayName,
          time: 60, // TODO: 체류 시간 입력 필드 추가 필요
          transport: 'TRANSIT', // TODO: 추후 교통수단 선택 기능 추가하면 수정필요
          location: {
            latitude: place.location.lat(),
            longitude: place.location.lng()
          }
        })),
        units: 'METRIC'
      };

      const addPlacesResponse = await fetch(`/api/private/plan/${plan.planId}/add-places`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(routeInfo)
      });

      if (addPlacesResponse.ok) {
        console.log('장소 추가 및 경로 업데이트 성공!');
        loadPlan(plan.planId);
      } else {
        throw new Error('경로 추가에 실패했습니다: ' + await addPlacesResponse.text());
      }

    } catch (error) {
      console.error('장소 추가 프로세스 중 오류 발생:', error);
    }
  });

}