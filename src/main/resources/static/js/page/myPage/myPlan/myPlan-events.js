// src/main/resources/static/js/page/myPage/myPlan/myPlan-events.js
import { bookMarkButtonControllerInstance } from "../../../bookMarkButton/bookmark.js"; // This dependency seems specific to bookMarkButton

/**
 * Title - myPlan 페이지 이벤트 리스너 설정 (이벤트 붙이는 틀임)
 * @param {HTMLElement} container - 이벤트 붙일 컨테이너 요소
 * @param {object} callbacks - An object containing callback functions for different actions.
 * @param {Function} callbacks.onPlanItemClick - 클릭 plan item 호출 함수.
 * @param {Function} callbacks.onBookmarkClick - 북마크 버튼 클릭 호출 함수.
 * @param {Function} callbacks.onCreatePlanClick - 플랜 생성 버튼 클릭 호출 함수.
 */
export function setupMyPlanEventListeners(container, { onPlanItemClick, onBookmarkClick, onCreatePlanClick }) {
  if (!container) {
    console.error('Event container not found for myPlan page.');
    return () => { }; // Return a no-op cleanup function
  }

  const eventHandler = async (event) => {
    const target = event.target;

    // 북마크 버튼 클릭 처리 (자식 요소를 먼저 확인)
    const bookmarkButton = target.closest('.bookmark-button');
    if (bookmarkButton) {
      event.stopPropagation(); // 아이템 클릭 방지
      const planId = bookmarkButton.id.replace('bookMark-button', '');
      if (onBookmarkClick) {
        onBookmarkClick(planId, bookmarkButton);
      } else { //설정한 콜백이 없을 때 기본 동작 지금은 둘이 같음(바꿀 일이 있나?)
        // Default bookmark toggle if no specific callback is provided
        if (bookMarkButtonControllerInstance.bookmarkPlanList.includes(parseInt(planId))) {
          bookmarkButton.innerHTML = bookMarkButtonControllerInstance.getnoneClickedBookmarkSvg(planId);
        } else {
          bookmarkButton.innerHTML = bookMarkButtonControllerInstance.getclickedBookmarkSvg(planId);
        }
      }
      return;
    }

    // 아이템 클릭 처리
    const planItem = target.closest('.plan-item');
    if (planItem) {
      const planId = planItem.dataset.planId;
      if (onPlanItemClick) {
        onPlanItemClick(planId);
      }
      return;
    }

    // Handle 'Create Plan' button click
    const createPlanButton = target.closest('.plan-actions > button');
    if (createPlanButton) {
      if (onCreatePlanClick) {
        onCreatePlanClick();
      }
      return;
    }
  };

  container.addEventListener('click', eventHandler);

  // Return a cleanup function
  return () => {
    console.log('Cleaning up myPlan page click listeners.');
    container.removeEventListener('click', eventHandler);
  };
}

/**
 * Title - 새로 로드한 플랜 아이템에 이벤트 부여
 * @param {HTMLElement} container - 새 아이템이 추가된 컨테이너 요소
 */
export function attachBookmarkEventToItems(container) {
  const bookmarkButtons = container.querySelectorAll('[id^="bookMark-button"]:not([data-bookmark-event-attached="true"])');
  bookmarkButtons.forEach(button => {
    const planId = button.id.replace('bookMark-button', '');
    if (bookMarkButtonControllerInstance.bookmarkPlanList.includes(parseInt(planId))) {
      button.innerHTML = bookMarkButtonControllerInstance.clickedBookmarkSvg
    }
    // Mark as attached to prevent re-attaching
    button.setAttribute('data-bookmark-event-attached', 'true');
  });
}
