// 북마크 관리

class bookMarkButtonController {

  // bookmarkState = false; // false: none clicked, true: clicked
  bookmarkPlanList = [];

  noneClickedBookmarkSvg =
    `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white">
          <g id="_01_align_center" data-name="01 align center">
            <path
              d="M19.467,23.316,12,17.828,4.533,23.316,7.4,14.453-.063,9H9.151L12,.122,14.849,9h9.213L16.6,14.453ZM12,15.346l3.658,2.689-1.4-4.344L17.937,11H13.39L12,6.669,10.61,11H6.062l3.683,2.691-1.4,4.344Z" />
          </g>
        </svg>`
  clickedBookmarkSvg =
    `
    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20" height="20" fill="yellow">
      <path d="M19.467,23.316,12,17.828,4.533,23.316,7.4,14.453-.063,9H9.151L12,.122,14.849,9h9.213L16.6,14.453Z" />
    </svg>
  `
  //TITLE - 뷱마크 삭제
  getnoneClickedBookmarkSvg(planId) {
    this.bookmarkPlanList.splice(this.bookmarkPlanList.indexOf(planId), 1);
    fetch(`/api/private/bookmarks/${planId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(data => {
        console.log('북마크 삭제 성공:', data);
      })
    console.log('bookmarkPlanList:', this.bookmarkPlanList);
    return this.noneClickedBookmarkSvg;
  }

  //TITLE - 북마크 생성
  getclickedBookmarkSvg(planId) {
    this.bookmarkPlanList.push(parseInt(planId));
    fetch(`/api/private/bookmarks/${planId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(data => {
        console.log('북마크 생성 성공:', data);
      })
    console.log('bookmarkPlanList:', this.bookmarkPlanList);
    return this.clickedBookmarkSvg;
  }

  //TITLE - 로그인 하면 내 북마크 플랜 리스트 가져오기
  async getMyBookmarkPlanList() {

    const response = await fetch('/api/private/bookmarks/my', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json();
    this.bookmarkPlanList = data.map(bookmark => bookmark.planId);
    console.log('bookmarkPlanList:', this.bookmarkPlanList);
  }
}
export const bookMarkButtonControllerInstance = new bookMarkButtonController();
