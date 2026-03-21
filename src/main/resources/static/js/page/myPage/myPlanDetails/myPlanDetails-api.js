/**
 * Title - API 요청을 처리하는 범용 래퍼 함수.
 * @param {string} url - 요청 URL
 * @param {object} options - fetch 옵션
 * @param {string} errorMessage - 에러 발생 시 표시할 메시지
 * @returns {Promise<any>}
 */
async function fetchWrapper(url, options, errorMessage = '요청 처리 중 오류가 발생했습니다.') {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(errorMessage);
    }
    // 응답 본문이 있는지 확인 후 파싱
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return response.json();
    }
    return;
  } catch (error) {
    console.error('API Error:', error);
    alert(error.message);
    throw error;
  }
}

/**
 * Title - 경로의 메모를 업데이트합니다.
 */
export const updateRouteMemo = (planId, routeSequence, memo) =>
  fetchWrapper(`/api/private/route/${planId}&${routeSequence}/memo`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memo })
  }, '메모 저장에 실패했습니다.');

/**
 * Title - 계획의 설명을 업데이트합니다.
 */
export const updatePlanDescription = (planId, description) =>
  fetchWrapper(`/api/private/plan/${planId}/description`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description })
  }, '설명 저장에 실패했습니다.');

/**
 * Title - 계획의 키워드를 업데이트합니다.
 */
export const updatePlanKeywords = (planId, keywords) =>
  fetchWrapper(`/api/private/plan/${planId}/keywords`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keywords })
  }, '키워드 저장에 실패했습니다.');

/**
 * Title - 경로의 체류 시간을 업데이트합니다.
 */
export const updateRouteStayTime = (planId, routeSequence, stayTime) =>
  fetchWrapper(`/api/private/route/${planId}&${routeSequence}/stayTime`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stayTime })
  }, '체류시간 저장에 실패했습니다.');

/**
 * Title - 계획의 제목을 업데이트합니다.
 */
export const updatePlanTitle = (planId, title) =>
  fetchWrapper(`/api/private/plan/${planId}/title`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  }, '제목 저장에 실패했습니다.');

/**
 * Title - 새로운 장소를 서버에 저장(생성 또는 업데이트)합니다.
 */
export const savePlace = (placeData) =>
  fetchWrapper('/api/public/places', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(placeData)
  }, '장소 생성/업데이트에 실패했습니다.');

/**
 * Title - 기존 계획에 새로운 장소들을 추가합니다.
 */
export const addPlacesToPlan = (planId, routeInfo) =>
  fetchWrapper(`/api/private/plan/${planId}/add-places`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(routeInfo)
  }, '경로 추가에 실패했습니다.');

/**
 * Title - 계획에서 특정 경로를 삭제하고 경로 재계산을 요청합니다.
 */
export const deleteRouteAndRecalculate = (planId, routeSequence) =>
  fetchWrapper(`/api/private/route/${planId}&${routeSequence}`, {
    method: 'DELETE'
  }, '경로 삭제 및 재계산에 실패했습니다.');

/**
 * Title - 계획의 경로 순서를 업데이트합니다. (재정렬)
 */
export const updateRouteOrder = (planId, routes) =>
  fetchWrapper(`/api/private/plan/${planId}/routes/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(routes)
  }, '경로 순서 저장에 실패했습니다.');