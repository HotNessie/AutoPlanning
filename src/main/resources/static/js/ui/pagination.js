/**
 * Title - 무한 스크롤러 클래스
 */
/**
 * @param {Object} options
 * @param {HTMLElement} options.scrollContainer - 스크롤 이벤트를 감지할 컨테이너 요소.
 * @param {Function} options.loadMoreCallback - 다음 페이지 데이터를 불러오는 콜백 함수.
 * @param {number} [options.scrollOffset=150] - 스크롤 감지 오프셋 (픽셀 단위).
*/
export class InfiniteScroller {
  constructor({ scrollContainer, loadMoreCallback, scrollOffset = 150 }) {
    if (!scrollContainer || !loadMoreCallback) {
      throw new Error('scrollContainer and loadMoreCallback are required.');
    }
    this.container = scrollContainer;
    this.loadMore = loadMoreCallback;
    this.offset = scrollOffset;
    this.isLoading = false;
    this.isLastPage = false;
    this.scrollListener = this.handleScroll.bind(this);
    this.currentPage = 0;
  }

  /**
   * 스크롤 시작
   */
  start() {
    this.container.addEventListener('scroll', this.scrollListener);
    console.log('Infinite scroll listener started.');
  }

  /**
   * 스크롤 중지
   */
  stop() {
    this.container.removeEventListener('scroll', this.scrollListener);
    console.log('Infinite scroll listener stopped.');
  }

  /**
   * 리셋
   */
  reset() {
    this.isLoading = false;
    this.isLastPage = false;
    this.currentPage = 0;
    this.container.innerHTML = '';
    this.stop(); // Stop any existing listeners before resetting
    console.log('Infinite scroller reset.');
  }

  /**
   * 스크롤 이벤트
   */
  handleScroll() {
    // 맨 아래임?
    const isAtBottom = this.container.scrollTop + this.container.clientHeight >= this.container.scrollHeight - this.offset;

    // 다음 페이지 로드 중이 아니고 마지막 페이지가 아니면 로드
    if (isAtBottom && !this.isLoading && !this.isLastPage) {
      console.log('Fetching next page...');
      this.isLoading = true;
      this.currentPage++;
      // 설정한 loadMore 콜백 호출 (정렬, 필터링 등은 콜백 내부에서 처리)
      this.loadMore(this.currentPage).then(result => {
        if (result) {
          this.isLastPage = result.isLast;
        }
        this.isLoading = false;
      }).catch(() => {
        this.isLoading = false; // 에러 시에도 로딩 상태 해제
      });
    }
  }
}
