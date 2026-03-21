/**
 * Title - for form validation error handling
 */
export function clearValidationError(inputField) {
  if (inputField) {
    inputField.style.border = "";
    const routeForm = inputField.closest('form'); // Find the closest form element
    if (routeForm) {
      const errorMessage = routeForm.querySelector(".error-message");
      if (errorMessage) {
        errorMessage.remove();
      }
    }
  }
};

/**
 * Title - 경로 요청 form validation
 * @param {HTMLFormElement} routeForm - The form element to validate.
 * @returns {boolean} - True if validation passes, false otherwise.
 */
export function validateRouteForm(routeForm) {
  // 기존 오류 메시지 제거
  const existingError = routeForm.querySelector(".error-message");
  if (existingError) existingError.remove();

  const placeIdInputs = routeForm.querySelectorAll(".placeInput input[type='hidden'][name$='.placeId']");
  let hasError = false;

  // 모든 입력 필드의 테두리 스타일 초기화
  routeForm.querySelectorAll(".placeInput input[type='text']").forEach(input => {
    input.style.border = "";
  });

  placeIdInputs.forEach(input => {
    if (!input.value) {
      hasError = true;
      const textInput = input.closest('.placeInput').querySelector('input[type="text"]');
      if (textInput) textInput.style.border = '1px solid red';
    }
  });

  if (hasError) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.color = "red";
    errorDiv.style.fontSize = "14px";
    errorDiv.style.marginBottom = "10px";
    errorDiv.textContent = "검색을 통해 정확한 장소를 선택해 주세요.";
    routeForm.prepend(errorDiv);
    return false; // 유효성 검사 실패
  }

  return true; // 유효성 검사 성공
}