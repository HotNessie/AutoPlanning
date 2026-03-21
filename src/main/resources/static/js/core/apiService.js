import { getMapInstance } from './store.js';
import { SEARCH_SETTINGS, API } from './config.js';

/**
 * searchPlacesByText - Google Maps Places API를 사용하여 텍스트로 장소 검색
 * fetchHtmlContent - main에서 loadContent로 사용중
 */

/**
 * Title - google Maps Places API로 텍스트 검색
 * @param {string} textQuery - 검색어
 * @returns {Promise<google.maps.places.Place[]>}
 */
export async function searchPlacesByText(textQuery) {
  if (!textQuery) {
    alert("검색어를 입력해주세요.");
    return [];
  }

  const { Place } = await google.maps.importLibrary('places');
  const map = getMapInstance();

  const request = {
    textQuery,
    fields: [
      "displayName",
      "location",
      "rating",
      "userRatingCount",
      "formattedAddress"
    ],
    maxResultCount: SEARCH_SETTINGS.MAX_RESULT_COUNT,
  };

  // 지도가 있을 경우에만 위치 편향(locationBias)을 설정합니다.
  if (map) {
    request.locationBias = {
      center: map.getCenter(),
      radius: SEARCH_SETTINGS.LOCATION_BIAS_RADIUS,
    };
  }

  try {
    const { places } = await Place.searchByText(request);
    console.log("검색 결과:", places);
    return places;
  } catch (error) {
    console.error("Error searching places:", error);
    alert("장소 검색 중 오류가 발생했습니다.");
    return [];
  }
}

/**
 * Title - HTML 콘텐츠를 지정된 URL에서 가져옵니다.
 * @param {string} url - 콘텐츠를 가져올 URL입니다.
 * @returns HTML 반환
 */
export async function fetchHtmlContent(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error);
    return null;
  }
}