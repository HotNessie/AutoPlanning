/**
 * 지도 인스턴스 및 애플리케이션 상태 관리 스토어
 */
const state = {
  mapInstance: null,
  currentPlan: [],
};

export const setMapInstance = map => {
  state.mapInstance = map;
};

export const getMapInstance = () => {
  return state.mapInstance;
};

export const setCurrentPlan = plan => {
  state.currentPlan = plan;
};

export const getCurrentPlan = () => {
  return state.currentPlan;
};

export const getState = () => {
  return state;
};
