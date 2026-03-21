/**
 * 평점에 따른 별점 HTML 생성 (소수점 대응)
 */
function renderStars(rating) {
  const percentage = (rating / 5) * 100;
  return `
    <div class="star-rating-container">
      <div class="stars-outer">
        <div class="stars-inner" style="width: ${percentage}%"></div>
      </div>
    </div>
  `;
}

/**
 * 장소 상세 정보 페이지의 메인 렌더링 템플릿 (최신 Place API 대응)
 * @param {google.maps.places.Place} place - Google Places API 결과 객체
 * @returns {string} - 생성된 HTML 문자열
 */
export function createPlaceDetailTemplate(place) {
  // 최신 API 필드명 대응: displayName, formattedAddress 등
  const name = place.displayName || '이름 정보 없음';
  const address = place.formattedAddress || '주소 정보 없음';
  const rating = place.rating || 0;
  const ratingCount = place.userRatingCount || 0;

  const photoHtml = place.photos && place.photos.length > 0
    ? `
        <div class="custom-carousel" id="placeCarousel">
            <div class="carousel-track-container">
                <ul class="carousel-track">
                    ${place.photos.map((photo, index) => `
                        <li class="carousel-slide ${index === 0 ? 'active' : ''}">
                            <img src="${photo.getURI({ maxWidth: 1000 })}" class="hero-img" alt="${name} 사진 ${index + 1}">
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <button class="carousel-btn btn-prev" aria-label="Previous">
                <img src="/icon/left_arr.svg" alt="Previous" class="carousel-icon">
            </button>
            <button class="carousel-btn btn-next" aria-label="Next">
                <img src="/icon/right_arr.svg" alt="Next" class="carousel-icon">
            </button>
            
            <div class="carousel-nav">
                ${place.photos.map((_, index) => `
                    <button class="carousel-indicator ${index === 0 ? 'active' : ''}" aria-label="Go to slide ${index + 1}"></button>
                `).join('')}
            </div>
        </div>`
    : `<div class="hero-img-container"><img src="/img/서울.jpg" alt="${name}" class="hero-img"></div>`;

  return `
        <div class="detail-content-card">
            <div class="detail-layout">
                <!-- 메인 컨텐츠 영역 -->
                <div class="main-column">
                    ${photoHtml}
                    
                    <div class="place-title-row">
                        <div>
                            <h2 class="place-name">${name}</h2>
                            <div class="rating-box">
                                ${renderStars(rating)}
                                <span class="rating-count">${rating} (${ratingCount}개의 리뷰)</span>
                            </div>
                        </div>
                        <button class="plan-btn" onclick="location.href='/plan?placeId=${place.id}'">
                            이 장소로 계획 세우기
                        </button>
                    </div>

                    <div class="info-list">
                        <!-- 주소 -->
                        <div class="info-item">
                            <div class="info-icon">📍</div>
                            <div class="info-content">
                                <div class="info-label">주소</div>
                                <div class="info-value">${address}</div>
                            </div>
                        </div>

                        <!-- 영업 시간 (Opening Hours) -->
                        <div class="info-item">
                            <div class="info-icon">⏰</div>
                            <div class="info-content">
                                <div class="info-label">영업 상태</div>
                                <div class="info-value">
                                    ${place.regularOpeningHours ? `
                                        <div class="status-row ${place.isOpen() ? 'open' : 'closed'}">
                                            ${place.isOpen() ? '🟢 영업 중' : '🔴 영업 종료'}
                                        </div>
                                        <div class="weekday-list">
                                            ${place.regularOpeningHours.weekdayDescriptions.map((desc, idx) => {
    const isToday = idx === (new Date().getDay() + 6) % 7; // 요일 맞춤 (월요일 0번 기준인 경우 등 조정 필요)
    return `<div class="weekday-item ${isToday ? 'today' : ''}">${desc}</div>`;
  }).join('')}
                                        </div>
                                    ` : '영업 시간 정보 없음'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 리뷰 섹션 -->
                    <div class="reviews-section">
                        <div class="section-header">
                            <h3 class="section-title">최근 리뷰</h3>
                            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${place.id}" 
                              target="_blank" 
                              class="more-reviews-btn">
                                구글 리뷰 더 보기 ↗
                            </a>
                        </div>
                        <div class="review-list">
                            ${place.reviews ? place.reviews.map(review => `
                                <div class="review-card">
                                    <div class="review-header">
                                        <span class="review-author">${review.authorAttribution?.displayName || '익명'}</span>
                                        ${renderStars(review.rating)}
                                    </div>
                                    <p class="review-text">${review.text || ''}</p>
                                    <span class="review-time">${review.relativePublishTimeDescription || ''}</span>
                                </div>
                            `).join('') : '<p class="empty-msg">제공된 리뷰가 없습니다.</p>'}
                        </div>
                    </div>
                </div>

                <!-- 사이드바 영역 -->
                <div class="map-column">
                    <div class="map-card">
                        <div class="map-header">위치 미리보기</div>
                        <div id="detail-map-preview" class="map-container"></div>
                    </div>
                    
                    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${place.id}" 
                      target="_blank" 
                      class="external-map-btn">
                        Google 지도에서 더 보기
                    </a>

                    <!-- 관련 여행 계획 섹션 -->
                    <div class="related-plans-card">
                        <div class="map-header">이 장소가 포함된 계획</div>
                        <div id="related-plans-root" class="related-plans-list">
                            <div class="loading-small">불러오는 중...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 관련 여행 계획 목록 HTML 생성
 */
export function createRelatedPlansTemplate(plans) {
  return plans.map(plan => `
        <div class="mini-plan-card" onclick="openPlanInMainTab('${plan.planId}')">
            <div class="mini-plan-info">
                <div class="mini-plan-title">${plan.title || '제목 없음'}</div>
                <div class="mini-plan-meta">
                    <span class="meta-item">👤 ${plan.member?.username || '여행자'}</span>
                    <span class="meta-item">
                        <svg class="star-icon" viewBox="0 0 24 24" fill="#ffc107" width="16" height="16">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                        ${plan.bookmarks || 0}
                    </span>
                </div>
            </div>
            <div class="mini-plan-arrow">〉</div>
        </div>
    `).join('');
}
