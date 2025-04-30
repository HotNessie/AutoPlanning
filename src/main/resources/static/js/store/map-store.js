// map 정보 관리. SPA에 사용할 싱글톤
let mapInstance = null;

export const setMapInstance = map => {
  mapInstance = map;
};

export const getMapInstance = () => {
  if (!mapInstance) throw new Error('Map instance not initialized');
  return mapInstance;
};