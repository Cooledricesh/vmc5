-- 리뷰가 있는 장소 목록 조회 함수
CREATE OR REPLACE FUNCTION get_places_with_reviews()
RETURNS TABLE (
  id INTEGER,
  naver_place_id VARCHAR(255),
  name VARCHAR(255),
  address TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  category VARCHAR(100),
  review_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    p.id,
    p.naver_place_id,
    p.name,
    p.address,
    p.latitude,
    p.longitude,
    p.category,
    COUNT(r.id) as review_count
  FROM places p
  INNER JOIN reviews r ON p.id = r.place_id
  GROUP BY p.id, p.naver_place_id, p.name, p.address, p.latitude, p.longitude, p.category
  ORDER BY review_count DESC;
END;
$$ LANGUAGE plpgsql;
