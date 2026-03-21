import { bookMarkButtonControllerInstance } from '../../bookMarkButton/bookmark.js';

/**
 * findPlans 페이지에 대한 위임된 이벤트 리스너를 설정합니다.
 * @param {object} callbacks - 다른 액션에 대한 콜백 함수를 포함하는 객체.
 * @param {Function} callbacks.onSearchClick - 검색 버튼이 클릭될 때 호출됩니다.
 * @param {Function} callbacks.onPlanItemClick - 계획 아이템이 클릭될 때 호출됩니다.
 * @param {Function} callbacks.onBookmarkClick - 북마크 버튼이 클릭될 때 호출됩니다.
 * @returns {Function} - 이벤트 리스너를 제거하는 정리 함수.
 */
export function setupFindPlansEventListeners({ onSearchClick, onPlanItemClick, onBookmarkClick }) {
  const container = document.querySelector('.searchPlans');
  if (!container) {
    console.error('.searchPlans 컨테이너를 찾을 수 없습니다.');
    return () => { }; // 비어있는 정리 함수를 반환합니다.
  }

  const eventHandler = (event) => {
    const target = event.target;

    // 검색 버튼 클릭 처리
    const searchButton = target.closest('#search-plans-button');
    if (searchButton) {
      if (onSearchClick) {
        onSearchClick();
      }
      return;
    }

    // 북마크 버튼 클릭 처리
    const bookmarkButton = target.closest('.bookmark-button');
    if (bookmarkButton) {
      event.stopPropagation(); // 부모 요소의 클릭 이벤트 방지
      const planId = bookmarkButton.id.replace('bookMark-button', '');
      if (onBookmarkClick) {
        onBookmarkClick(planId, bookmarkButton);
      }
      return;
    }

    // 계획 아이템 클릭 처리
    const planItem = target.closest('.plan-item');
    if (planItem && onPlanItemClick) {
      const planId = planItem.dataset.planId;
      onPlanItemClick(planId);
      return;
    }
  };

  container.addEventListener('click', eventHandler);

  // 정리 함수를 반환합니다.
  return () => {
    console.log('findPlans 페이지 클릭 리스너를 정리합니다.');
    container.removeEventListener('click', eventHandler);
  };
}
