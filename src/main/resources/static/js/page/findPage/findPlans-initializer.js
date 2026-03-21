import { resetCollapseButtonStateWithAutoComplete, adjustContentWidth } from '../../ui/state-manager.js';
import { init as initFindPlans } from './findPlans.js';

/**
 * Title - findPlans 페이지 진입 시 실행되는 초기화 함수.
 * UI 상태를 리셋하고, findPlans 모듈의 주 초기화 함수를 호출합니다.
 */
export function initializeSearchPlansPage() {
  resetCollapseButtonStateWithAutoComplete(true);
  adjustContentWidth();
  initFindPlans();
}
