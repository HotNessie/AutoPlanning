// src/main/resources/static/js/page/myPage/myPlanDetails/myPlanDetails-templates.js

/**
 * '장소 추가' 버튼과 모달의 HTML을 생성합니다.
 * @returns {string} - 생성된 HTML 문자열.
 */
export function createAddPlaceModalHtml() {
    return `
      <button id="myPlanDetail-add-place-btn" class="myPlanDetail-add-place-btn" popovertarget="myPlanDetail-add-place-modal">+</button>

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
}
