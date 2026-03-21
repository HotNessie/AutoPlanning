// src/main/resources/static/js/config.js

//지도 설정
export const MAP_SETTINGS = {
  DEFAULT_POS: { lat: 37.65564466099954, lng: 127.06206796919646 },
  MAP_ID: '281ecb2de2a0840c',
  ZOOM_LEVEL: 17,
};

// 검색 설정
export const SEARCH_SETTINGS = {
  MAX_RESULT_COUNT: 1, // API cost issue
  LOCATION_BIAS_RADIUS: 500,
};

// 계획 설정(selfPage에서 사용 - google Routes API 제한 관련. 해결하면 늘릴 수 있음)
export const PLAN_SETTINGS = {
  MAX_PLACES: 7,
  MIN_PLACES: 2,
};

// Call HTML API endpoints
export const API = {
  LOAD_SELF_CONTENT: '/selfContent',
  LOAD_MY_PLAN_LIST: '/myPlanList',
  LOAD_SEARCH_PLANS: '/searchPlans',
  LOAD_HOT_CONTENT: '/hotContent',
  LOAD_AUTO_CONTENT: '/autoContent',
  SUBMIT_PLAN: '/plan/submit', //왜 submit이라 했는지는 모르겠음;;
};
