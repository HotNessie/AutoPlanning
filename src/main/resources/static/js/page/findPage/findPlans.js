import { searchPlans } from './findPlans-api.js';
import { renderPlans, clearPlanList, getSearchQuery } from './findPlans-dom.js';
import { setupFindPlansEventListeners } from './findPlans-events.js';
import { InfiniteScroller } from '../../ui/pagination.js';
import { attachBookmarkEventToItems } from '../myPage/myPlan/myPlan-events.js';
import { cleanupFunctions } from '../../main.js';
import { loadPlan } from '../myPage/myPlan/myPlan.js';
import { bookMarkButtonControllerInstance } from '../../bookMarkButton/bookmark.js';

// --- 페이지 상태 관리 ---
let state = {
  query: { title: '', region: '', keywords: '' },
  sort: 'createdDate,desc',
  scroller: null,
};

/**
 * Title - 새로운 검색을 수행하고 결과를 리셋합니다.
 */
function performSearch() {
  state.query = getSearchQuery(); // DOM에서 현재 검색어 가져오기
  if (state.scroller) {
    state.scroller.reset(); // 스크롤러 상태 및 UI 초기화
    state.scroller.loadMore(0).then(() => {
      // 첫 페이지 로드 후 추가 작업 (필요 시)
    });
  }
}

/**
 * Title - 더 많은 계획을 비동기적으로 로드합니다.
 * InfiniteScroller의 콜백으로 사용됩니다.
 * @param {number} page - 로드할 페이지 번호.
 * @returns {Promise<{isLast: boolean}>} - 마지막 페이지 여부를 포함하는 객체.
 */
async function loadMore(page) {
  try {
    const data = await searchPlans(state.query, page, 10, state.sort);
    if (data.content && data.content.length > 0) {
      renderPlans(data.content);
      //myPlan-events.js의 북마크 이벤트 부여 함수 재사용
      attachBookmarkEventToItems(document.querySelector('#collapseSearchBody'));
    }
    return { isLast: data.last };
  } catch (error) {
    console.error('계획 로드 실패:', error);
    return { isLast: true }; // 에러 발생 시 더 이상 로드하지 않음
  }
}

/**
 * Title - findPlans 페이지의 모든 기능을 초기화합니다.
 */
export function init() {
  const contentBody = document.querySelector('#collapseSearchBody');
  if (!contentBody) {
    console.error('#collapseSearchBody 요소를 찾을 수 없습니다.');
    return;
  }

  // 스크롤러 인스턴스 생성
  state.scroller = new InfiniteScroller({
    scrollContainer: contentBody,
    loadMoreCallback: loadMore,
  });

  // 이벤트 리스너 설정
  const cleanupPageEvents = setupFindPlansEventListeners({
    onSearchClick: performSearch,
    onPlanItemClick: (planId) => {
      console.log(`Plan item ${planId} clicked.`);
      // myPlan 페이지의 loadPlan 함수를 재사용하여 상세 보기 기능 구현
      loadPlan(planId);
    },
    onBookmarkClick: (planId, buttonElement) => {
      // TODO: API 호출 로직 추가 필요
      if (bookMarkButtonControllerInstance.bookmarkPlanList.includes(parseInt(planId))) {
        buttonElement.innerHTML = bookMarkButtonControllerInstance.getnoneClickedBookmarkSvg(planId);
      } else {
        buttonElement.innerHTML = bookMarkButtonControllerInstance.getclickedBookmarkSvg(planId);
      }
    },
  });

  // 초기 데이터 로드 및 스크롤러 시작
  performSearch(); // 페이지 진입 시 초기 검색 실행
  state.scroller.start();

  // 페이지 벗어날 때 정리할 함수들 등록
  cleanupFunctions.push(() => state.scroller.stop());
  cleanupFunctions.push(cleanupPageEvents);
}