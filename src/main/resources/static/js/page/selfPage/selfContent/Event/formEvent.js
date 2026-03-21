import { clearValidationError, validateRouteForm } from '../validation/formValidation.js';
import { adjustPlaceIndices } from '../routeRequest/selfRouteRequest.js';
import { addPlace } from '../place-form-manager.js';

/**
 * Title - form hidden input change event
 */
export const setupValidationClearEvents = () => {
  const placeIdInputs = document.querySelectorAll(".placeInput input[type='hidden'][name$='.placeId']");
  placeIdInputs.forEach(input => {
    // hidden input의 값이 변경되면 관련 텍스트 입력 필드의 오류 스타일 제거
    input.addEventListener('change', () => {
      console.log("hidden input changed");
      const textInput = input.closest('.placeInput').querySelector('input[type="text"]');
      clearValidationError(textInput);
    });

    // 관련 텍스트 입력 필드에도 검색 선택 후 이벤트 리스너 추가
    const textInput = input.closest('.placeInput').querySelector('input[type="text"]');
    if (textInput && !textInput.dataset.validationListenerAdded) {
      textInput.addEventListener('change', () => {
        console.log("text input changed");
        if (input.value) clearValidationError(textInput);
      });
      textInput.dataset.validationListenerAdded = 'true';
    }
  });
};

/**
 * Title - form submit event with validation
 * @param {HTMLFormElement} form - The form element.
 * @param {Function} onSuccess - The callback function to execute on successful validation.
 */
export function addSubmitListener(form, onSuccess) {
  form.addEventListener('submit', async (event) => {
    console.log("submit routeForm");
    event.preventDefault();
    if (event.isComposing) return;

    // 유효성 검사
    if (validateRouteForm(form)) {
      adjustPlaceIndices();
      onSuccess();
    }
  });
}

/**
 * Title - 동적 요소 설정
* @returns {Array<Object>} - An array of dynamic element configurations.
*/
export function getDynamicElements() {
  return [
    { id: 'addPlace', selector: '#addPlaceBtn', events: [{ event: 'click', callback: addPlace }] },
    { id: 'routeForm', selector: '#routeForm', events: [] },
    { id: 'placeContainer', selector: '#placeContainer', events: [] },
    { id: 'searchResults', selector: '#searchResults', events: [] },
    { id: 'collapseButton', selector: '#collapseButton', events: [] },
  ];
}
