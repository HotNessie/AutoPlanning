/**
 * Title - 쿼리, 지역, 키워드, 페이징을 기반으로 계획을 검색합니다.
 * @param {object} query - 검색 쿼리 매개변수.
 * @param {string} query.title - 검색할 제목.
 * @param {string} query.region - 검색할 지역.
 * @param {string} query.keywords - 검색할 키워드.
 * @param {number} page - 가져올 페이지 번호.
 * @param {number} size - 페이지당 항목 수.
 * @param {string} sort - 정렬 기준.
 * @returns {Promise<any>} - 검색 결과 페이지로 확인되는 프로미스.
 */
export async function searchPlans({ title = '', region = '', keywords = '' }, page = 0, size = 10, sort = 'createdDate,desc') {
  let url = '/api/public/plans/search?';

  if (title) url += `title=${encodeURIComponent(title)}&`;
  if (region) url += `region=${encodeURIComponent(region)}&`;
  if (keywords) url += `keywords=${encodeURIComponent(keywords)}&`;

  url += `page=${page}&size=${size}&sort=${sort}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("계획 검색 실패:", error);
    throw error; // 호출자가 처리하도록 에러를 다시 던집니다.
  }
}
