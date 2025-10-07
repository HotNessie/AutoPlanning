// 여행 경로 결과 페이지의 스크립트

// 선택된 키워드를 저장할 객체
const selectedKeywords = {
  purpose: null,
  mood: null
};

// 키워드 선택 함수
function selectKeyword(button, type) {
  // 같은 타입의 모든 버튼에서 selected 클래스 제거
  const buttons = document.querySelectorAll(`.${type}-keywords .keyword-btn`);
  buttons.forEach(btn => btn.classList.remove('selected'));

  // 현재 버튼에 selected 클래스 추가
  button.classList.add('selected');

  // 선택된 키워드 저장
  selectedKeywords[type] = button.getAttribute('data-value');
}

// 키워드 저장 함수
function saveKeywords() {
  if (!selectedKeywords.purpose || !selectedKeywords.mood) {
    alert('목적과 분위기 키워드를 모두 선택해주세요.');
    return;
  }

  // 첫번째 장소 ID 가져오기
  const placeId = document.querySelector('[data-place-id]')?.getAttribute('data-place-id');

  if (!placeId) {
    alert('장소 정보를 찾을 수 없습니다.');
    return;
  }

  // 키워드 저장 API 호출
  fetch('/api/place-keyword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      placeId: placeId,
      purposeKeyword: selectedKeywords.purpose,
      moodKeyword: selectedKeywords.mood
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('키워드 저장에 실패했습니다.');
      }
      return response.json();
    })
    .then(data => {
      alert('키워드가 성공적으로 저장되었습니다.');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('키워드 저장 중 오류가 발생했습니다.');
    });
}

// 계획 수정 화면으로 돌아가기
function backToEdit() {
  loadContent('/selfContent');
}

// 전역 스코프로 함수 노출
window.selectKeyword = selectKeyword;
window.saveKeywords = saveKeywords;
window.backToEdit = backToEdit;
