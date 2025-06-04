-- Region 데이터 (created_at, updated_at 컬럼 제거)
INSERT INTO region (name, type) VALUES 
('서울특별시', 'CITY'),
('부산광역시', 'CITY'),
('제주특별자치도', 'CITY');

-- Place 데이터
INSERT INTO place (place_id, name, address, latitude, longitude, search_count, region_id, average_stay_time) VALUES 
('place_001', '노원역', '서울특별시 종로구 사직로 161', 37.5796, 126.9770, 15, 1, 7200),
('place_002', '부산 해운대해수욕장', '부산광역시 해운대구 우동', 35.1588, 129.1603, 25, 2, 14400),
('place_003', '성산일출봉', '제주특별자치도 서귀포시 성산읍', 33.4584, 126.9422, 30, 3, 5400),
('place_004', '명동거리', '서울특별시 중구 명동', 37.5636, 126.9834, 40, 1, 10800),
('place_005', '감천문화마을', '부산광역시 사하구 감내2로', 35.0978, 129.0107, 20, 2, 9000);

-- PlaceKeyword 데이터 (목적 키워드)
INSERT INTO place_keyword (place_id, purpose_keyword, mood_keyword, count) VALUES 
(1, 'DATE', NULL, 10),
(1, 'DATE', NULL, 8),
(2, 'DATE', NULL, 15),
(2, 'DATE', NULL, 12),
(3, 'DATE', NULL, 20),
(4, 'DATE', NULL, 25),
(5, 'DATE', NULL, 18);

-- PlaceKeyword 데이터 (분위기 키워드)
INSERT INTO place_keyword (place_id, purpose_keyword, mood_keyword, count) VALUES 
(1, NULL, 'TRENDY', 12),
(2, NULL, 'TRENDY', 20),
(3, NULL, 'TRENDY', 25),
(4, NULL, 'TRENDY', 30),
(5, NULL, 'TRENDY', 15);

-- 상위 키워드 테이블 데이터
INSERT INTO place_top_purpose_keywords (place_id, top_purpose_keyword) VALUES 
(1, 'DATE'),
(1, 'DATE'),
(2, 'DATE'),  
(2, 'DATE'),
(3, 'DATE'),
(4, 'DATE'),
(5, 'DATE');

INSERT INTO place_top_mood_keywords (place_id, top_mood_keyword) VALUES 
(1, 'TRENDY'),
(2, 'TRENDY'),
(3, 'TRENDY'),
(4, 'TRENDY'),
(5, 'TRENDY');
