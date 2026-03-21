// src/main/resources/static/js/ui/place-form-manager.js

import { markerManager } from '../../../map/marker.js';
import { attachSearchEventToInput } from '../selfFind.js';
import { PLAN_SETTINGS } from '../../../core/config.js';
import { createPlaceInputTemplate } from './template/selfContent-templates.js';

let placeCount = 2; // 초기 장소 개수
let transportSelections = {}; // 선택된 교통 수단 저장

/**
 * Title - 장소 입력란 추가
 * Adds a new place input field to the form.
 */
export function addPlace() {
  console.log("addPlace");
  const placeContainer = document.querySelector('#placeContainer');
  const placeEnd = document.querySelector('#placeEnd');

  if (placeCount < PLAN_SETTINGS.MAX_PLACES) {
    const newPlaceDiv = document.createElement("div");
    newPlaceDiv.className = "placeInput";
    newPlaceDiv.id = `place${placeCount}`;

    newPlaceDiv.innerHTML = createPlaceInputTemplate(placeCount);

    // 항상 도착지 앞에 추가
    placeContainer.insertBefore(newPlaceDiv, placeEnd);
    placeCount++;
    console.log("placeCount:", placeCount);
    const input = newPlaceDiv.querySelector('input[type="text"]');

    attachSearchEventToInput(input); //DB검색 -> 구글 API 검색
  } else {
    placeCount++; // This line seems to be a bug, placeCount should not increase if max places reached.
    placeCount = Math.min(placeCount, PLAN_SETTINGS.MAX_PLACES); // placeCount가 MAX_PLACES를 초과하지 않도록 제한
    console.log("placeCount:", placeCount);
    alert(`최대 ${PLAN_SETTINGS.MAX_PLACES}개 장소까지 추가 가능합니다.`);
  }
}

/**
 * Title - 경유지 삭제
 * Removes a place input field from the form.
 * @param {string} placeId - The ID of the place to remove.
 */
export function removePlace(placeId) {
  const placeDiv = document.querySelector(`#place${placeId}`);
  console.log("이 placeDiv 지워짐:", placeDiv);
  if (placeCount > PLAN_SETTINGS.MIN_PLACES) {
    const placeIdInput = document.querySelector(`#placeId${placeId}`);
    if (placeIdInput && placeIdInput.value) {
      markerManager.removePlaceMarker(placeIdInput.value);
    }
    placeDiv.remove();
    placeCount--;
    console.log("placeCount:", placeCount);
    delete transportSelections[`place${placeId}`];
  }
}

/**
 * Title - 교통 수단 선택
 * Selects a transport option for a given place.
 * @param {string} placeId - The ID of the place.
 * @param {string} transport - The selected transport type (e.g., "DRIVE", "TRANSIT", "WALK").
 */
export function selectTransport(placeId, transport) {
  // 선택된 교통 수단 저장
  transportSelections[placeId] = transport;
  console.log("Selected transport for", placeId, ":", transport);
  console.log("transportSelections", transportSelections);

  // 버튼 스타일 업데이트
  const buttons = document.querySelectorAll(`.place${placeId}`);
  buttons.forEach(button => {
    button.classList.remove('selected_transport'); // 모든 버튼에서 클래스 제거
    if (button.dataset.transport === transport) {
      button.classList.add('selected_transport'); // 선택된 버튼에만 추가
      console.log("button classList:", button.classList);
    }
  });
  const transportInput = document.getElementById(`transport${placeId}`);
  if (transportInput) transportInput.value = transport;
}

