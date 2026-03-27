import { getMapInstance, getAccessToken, setAccessToken } from './store.js';
import { SEARCH_SETTINGS, API } from './config.js';

/**
 * reissueToken - Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.
 * @returns {Promise<string|null>} 새로운 토큰 또는 실패 시 null
 */
export async function reissueToken() {
  try {
    const response = await fetch('/reissue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        setAccessToken(data.token);
        console.log('[Auth] Token reissued successfully');
        return data.token;
      }
    } else {
      console.warn('[Auth] Failed to reissue token. User might need to login.');
      setAccessToken(null);
    }
  } catch (error) {
    console.error('[Auth] Error during token reissue:', error);
  }
  return null;
}

/**
 * 헬퍼 함수: 요청 헤더를 생성합니다. (JWT 인증 토큰 포함)
 * @param {Object} customHeaders - 추가할 커스텀 헤더
 * @returns {Object} 헤더 객체
 */
export const getHeaders = (customHeaders = {}) => {
  const token = getAccessToken();
  const headers = {
    ...customHeaders,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

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
    const response = await fetch(url, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error);
    return null;
  }
}