// src/main/resources/static/js/page/myPage/myPlan/myPlan-initializer.js
import { checkLoginStatus, fetchMyPlans } from './apiService.js';
import { InfiniteScroller } from '../../../ui/pagination.js';
import { renderPlanList, renderEmptyPlanList } from './myPlan-dom.js';
import { setupMyPlanEventListeners, attachBookmarkEventToItems } from './myPlan-events.js';
import { resetCollapseButtonStateWithAutoComplete, adjustContentWidth } from '../../../ui/state-manager.js';
import { loadPlan, handleCreatePlanClick } from './myPlan.js';
import { fetchHtmlContent } from '../../../core/apiService.js'; // Needed for navigateToSelfContent
import { cleanupFunctions } from '../../../main.js';

/**
 * Title - myPlan 진입 시
 */
export async function initializeMyPlanPage() {
  console.log('initializeMyPlanPage 초기화');
  const planListContainer = document.querySelector('.plan-list');
  const myPlanListElement = document.querySelector('.myPlanList');
  const collapseBody = document.querySelector('#collapseBody');

  if (!planListContainer || !myPlanListElement || !collapseBody) {
    console.error('Required DOM elements not found for myPlan page.');
    return;
  }

  resetCollapseButtonStateWithAutoComplete(false);
  adjustContentWidth();

  // 로그인 상태 확인
  const isLoggedIn = await checkLoginStatus();
  if (!isLoggedIn) {
    alert('로그인이 필요합니다.');
    renderEmptyPlanList();
    //TODO: 빈 페이지 출력하지 말고 로그인 페이지로 이동 혹은 모달 출력
    return;
  }

  // 무한 스크롤러 설정
  const scroller = new InfiniteScroller({
    scrollContainer: planListContainer,
    loadMoreCallback: async (page) => {
      try {
        const data = await fetchMyPlans(page);
        if (data.content && data.content.length > 0) {
          // 플랜 리스트 렌더링 및 북마크 이벤트 부여
          renderPlanList(data.content);
          attachBookmarkEventToItems(planListContainer);
        } else if (page === 0) {
          // 첫 페이지에서 플랜이 없을 경우 빈 리스트 렌더링
          renderEmptyPlanList();
        }
        return { isLast: data.last };
      } catch (error) {
        console.error('Error loading more plans:', error);
        return { isLast: true }; // 에러 시 로딩 중지
      }
    }
  });

  // 스크롤러 시작
  scroller.reset();
  await scroller.loadMore(0); // 첫 페이지 로드
  scroller.start(); // 스크롤 리스너 부착
  cleanupFunctions.push(() => scroller.stop()); // Add scroller cleanup

  // SelfContent 페이지로 이동하는 함수 - 새로운 계획 생성 버튼 클릭 시 사용됨
  const navigateToSelfContent = async () => {
    const data = await fetchHtmlContent('/selfContent'); // Use the API service to fetch content
    if (data) {
      collapseBody.innerHTML = data;
      // TODO : 필요한 경우 selfContent 페이지에 대한 추가 초기화는 여기로 이동
      // 걍 초기화 부르면 되는거 아닌가? initializeSelfContentPage <- 이거 호출하면 되도록 하자
    }
  };

  // 이벤트 위임 설정
  const cleanupPageEvents = setupMyPlanEventListeners(myPlanListElement, {
    onPlanItemClick: async (planId) => {
      await loadPlan(planId); //특정 계획 불러오기 이벤트 부여
    },
    // 북마크 이벤트도 있어용 -> myPlan-events.js 참고 기본값으로 설정함
    onCreatePlanClick: () => {
      handleCreatePlanClick(navigateToSelfContent);
    }
  });
  cleanupFunctions.push(cleanupPageEvents);
}
