import { createPlaceDetailTemplate } from './placeDetail-templates.js';
import { loadGoogleMaps } from '../../core/googleMapsLoader.js';
import { initAutocomplete } from '../../handleGoogleApi/autocomplete.js';
import { searchPlacesByText, getHeaders } from '../../core/apiService.js';
import { setMapInstance } from '../../core/store.js';

// 템플릿에서 호출할 수 있도록 전역으로 등록 (항상 새 탭에서 열기)
window.openPlanInMainTab = (planId) => {
  window.open(`/plan?openPlanId=${planId}`, '_blank');
};

/**
 * 장소 상세 정보를 가져와 렌더링하는 핵심 클래스 (최신 google.maps.places.Place API 사용)
 */
class PlaceDetailManager {
  constructor() {
    this.rootElement = document.getElementById('place-detail-root');
    this.searchInput = document.getElementById('placeDetail-search-input');
    this.searchButton = document.getElementById('searchButton');
    this.map = null;
  }

  /**
   * 상세 페이지 이동 헬퍼 함수
   */
  navigateToDetail(placeId) {
    if (placeId) {
      window.location.href = `/placeDetail?placeId=${placeId}`;
    }
  }

  /**
   * 초기화 실행: 구글 지도 API 로딩 완료 후 상세 정보 처리
   */
  async init() {
    try {
      // 1. 구글 지도 공통 로더를 호출하여 로딩 완료 대기
      await loadGoogleMaps();

      // 2. 필요한 라이브러리 동적 로드
      const [{ Place }, { Map }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary("places"),
        google.maps.importLibrary("maps"),
        google.maps.importLibrary("marker")
      ]);

      // 3. 커스텀 Autocomplete 초기화 (선택 시 바로 이동하도록 콜백 등록)
      initAutocomplete('placeDetail-search-input', 'results', 'suggestion', (placeId) => {
        this.navigateToDetail(placeId);
      });

      // 검색 버튼 클릭 시 첫 번째 검색 결과로 이동
      this.searchButton.addEventListener('click', async () => {
        const inputText = this.searchInput.value.trim();
        if (inputText) {
          const places = await searchPlacesByText(inputText);
          if (places && places.length > 0) {
            this.navigateToDetail(places[0].id);
          } else {
            alert("검색 결과가 없습니다.");
          }
        }
      });

      const urlParams = new URLSearchParams(window.location.search);
      const placeId = urlParams.get('placeId');

      if (!placeId) {
        this.showError('유효한 장소 ID가 없습니다.');
        return;
      }

      try {
        // 4. 최신 Place 객체 생성 및 데이터 Fetch
        const place = new Place({ id: placeId });

        // 필요한 필드 요청 (비용 효율을 위해 필드 제한)
        await place.fetchFields({
          fields: ['displayName', 'formattedAddress', 'location', 'rating', 'userRatingCount', 'photos', 'reviews', 'regularOpeningHours']
        });
        console.log('Fetched place data:', place);
        // 5. 렌더링 및 미니맵 초기화
        this.render(place);
        this.initMiniMap(place, Map, AdvancedMarkerElement);

        // 6. 관련 계획 로드
        this.loadRelatedPlans(placeId);
      } catch (error) {
        console.error('Failed to fetch place data:', error);
        this.showError('장소 정보를 불러오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('Initialization failed:', error);
      this.showError('시스템을 초기화하는 중 오류가 발생했습니다.');
    }
  }

  /**
   * 해당 장소가 포함된 여행 계획 목록 로드
   */
  async loadRelatedPlans(placeId) {
    const plansContainer = document.getElementById('related-plans-root');
    if (!plansContainer) return;

    try {
      const response = await fetch(`/api/public/plans/by-place/${placeId}`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch plans');

      const plans = await response.json();

      if (plans && plans.length > 0) {
        import('./placeDetail-templates.js').then(module => {
          plansContainer.innerHTML = module.createRelatedPlansTemplate(plans);
        });
      } else {
        plansContainer.innerHTML = '<p class="empty-msg">이 장소가 포함된 공개된 계획이 아직 없습니다.</p>';
      }
    } catch (error) {
      console.error('Related plans load error:', error);
      plansContainer.innerHTML = '<p class="empty-msg">아직 이 장소가 포함된 계획이 없습니다.</p>';
    }
  }

  /**
   * 가져온 데이터를 템플릿을 통해 화면에 렌더링
   */
  render(place) {
    this.rootElement.innerHTML = createPlaceDetailTemplate(place);
    this.initCarousel();
  }

  /**
   * 커스텀 캐러셀 동작 초기화
   */
  initCarousel() {
    const carousel = document.getElementById('placeCarousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const nextButton = carousel.querySelector('.btn-next');
    const prevButton = carousel.querySelector('.btn-prev');
    const indicators = Array.from(carousel.querySelectorAll('.carousel-indicator'));

    if (slides.length <= 1) {
      if (nextButton) nextButton.style.display = 'none';
      if (prevButton) prevButton.style.display = 'none';
      return;
    }

    let currentIdx = 0;

    const updateCarousel = (newIdx) => {
      if (slides.length === 0) return;

      // 인디케이터 업데이트
      indicators[currentIdx].classList.remove('active');

      currentIdx = (newIdx + slides.length) % slides.length;

      // 슬라이드 이동 (컨테이너의 너비를 기준으로 계산)
      const slideWidth = carousel.querySelector('.carousel-track-container').offsetWidth;
      track.style.transform = `translateX(-${slideWidth * currentIdx}px)`;

      indicators[currentIdx].classList.add('active');
    };

    if (nextButton) {
      nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        updateCarousel(currentIdx + 1);
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        updateCarousel(currentIdx - 1);
      });
    }

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', (e) => {
        e.preventDefault();
        updateCarousel(index);
      });
    });

    // 화면 크기 조정 시 위치 재계산
    window.addEventListener('resize', () => {
      const slideWidth = carousel.querySelector('.carousel-track-container').offsetWidth;
      track.style.transform = `translateX(-${slideWidth * currentIdx}px)`;
    });
  }

  /**
   * 상세 페이지 내 미니맵 초기화
   */
  initMiniMap(place, Map, AdvancedMarkerElement) {
    const mapContainer = document.getElementById('detail-map-preview');
    if (!mapContainer || !place.location) return;

    this.map = new Map(mapContainer, {
      center: place.location,
      zoom: 16,
      disableDefaultUI: true,
      zoomControl: true,
      mapId: 'DEMO_MAP_ID'
    });

    setMapInstance(this.map); // 검색 시 현재 위치를 참고할 수 있게 등록합니다.

    new AdvancedMarkerElement({
      position: place.location,
      map: this.map,
      title: place.displayName
    });
  }

  /**
   * 에러 메시지 표시
   */
  showError(message) {
    this.rootElement.innerHTML = `
            <div class="alert-box">
                <h4>오류 발생</h4>
                <p>${message}</p>
                <button onclick="window.history.back()" class="btn-back">이전으로</button>
            </div>
        `;
  }
}

// DOM 콘텐츠가 모두 로드되면 실행
window.addEventListener('DOMContentLoaded', () => {
  const manager = new PlaceDetailManager();
  manager.init();
});
