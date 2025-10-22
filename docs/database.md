# 데이터베이스 설계 문서: 맛집 리뷰 플랫폼

## 1. 데이터베이스 개요

본 문서는 네이버 지도 SDK와 네이버 검색 API를 활용한 맛집 리뷰 플랫폼의 데이터베이스 설계를 정의합니다.

### 기술 스택
- **DBMS**: PostgreSQL (Supabase)
- **인증**: 닉네임 + 4자리 숫자 비밀번호 (bcrypt 해싱)
- **RLS**: 비활성화 (Supabase RLS 사용 안 함)

### 설계 원칙
- 최소 스펙으로 설계 (유저플로우에 명시된 데이터만 포함)
- 정규화된 테이블 구조 (장소와 리뷰 분리)
- 인덱스를 통한 조회 성능 최적화
- 비밀번호 해싱을 통한 보안 강화

---

## 2. 데이터플로우 요약

### 2.1 리뷰 작성 플로우
```
네이버 검색 API 응답 (장소 정보)
  ↓
places 테이블에 장소 저장 (UPSERT)
  ↓
reviews 테이블에 리뷰 저장
  - 닉네임, 별점, 텍스트
  - 비밀번호 해싱하여 저장
```

### 2.2 지도 마커 표시 플로우
```
리뷰가 있는 장소 조회 (DISTINCT place_id)
  ↓
places 테이블과 조인하여 좌표 정보 가져오기
  ↓
지도에 마커 표시
```

### 2.3 장소 세부정보 조회 플로우
```
장소 ID로 places 테이블 조회
  ↓
장소 ID로 reviews 테이블 조회 (최신순 정렬)
  ↓
평균 별점 계산 (AVG 집계)
  ↓
장소 정보 + 리뷰 목록 + 평균 별점 표시
```

### 2.4 리뷰 수정/삭제 플로우
```
사용자 입력 (닉네임, 비밀번호)
  ↓
비밀번호 해싱
  ↓
reviews 테이블에서 닉네임 + 해싱된 비밀번호 일치 확인
  ↓
인증 성공 시 UPDATE 또는 DELETE 수행
```

---

## 3. ERD (Entity Relationship Diagram)

```
┌─────────────────────────┐
│       places            │
│─────────────────────────│
│ id (PK, SERIAL)         │
│ naver_place_id (UNIQUE) │  ← 네이버 검색 API에서 받은 고유 ID
│ name                    │
│ address                 │
│ latitude                │
│ longitude               │
│ category (nullable)     │
│ created_at              │
│ updated_at              │
└─────────────────────────┘
            │
            │ 1:N
            │
┌─────────────────────────┐
│       reviews           │
│─────────────────────────│
│ id (PK, SERIAL)         │
│ place_id (FK)           │  → places.id
│ nickname                │
│ password_hash           │  ← bcrypt 해싱된 비밀번호
│ rating                  │  ← NUMERIC(2,1) CHECK (rating >= 1.0 AND rating <= 5.0)
│ review_text (nullable)  │
│ created_at              │
│ updated_at              │
└─────────────────────────┘
```

### 관계 설명
- **places ↔ reviews**: 1:N 관계
  - 하나의 장소는 여러 개의 리뷰를 가질 수 있음
  - 하나의 리뷰는 하나의 장소에만 속함
  - 외래키: `reviews.place_id` → `places.id`
  - 삭제 정책: `ON DELETE CASCADE` (장소 삭제 시 관련 리뷰도 삭제)

---

## 4. 테이블 스키마

### 4.1 places 테이블

장소 기본 정보를 저장하는 테이블입니다.

| 컬럼명          | 타입            | 제약조건                    | 설명                                |
|-----------------|-----------------|----------------------------|-------------------------------------|
| id              | SERIAL          | PRIMARY KEY                | 내부 고유 식별자 (자동 증가)        |
| naver_place_id  | VARCHAR(255)    | NOT NULL, UNIQUE           | 네이버 검색 API의 place ID          |
| name            | VARCHAR(255)    | NOT NULL                   | 장소명                              |
| address         | TEXT            | NOT NULL                   | 장소 주소                           |
| latitude        | NUMERIC(10, 7)  | NOT NULL                   | 위도 (-90 ~ 90)                     |
| longitude       | NUMERIC(10, 7)  | NOT NULL                   | 경도 (-180 ~ 180)                   |
| category        | VARCHAR(100)    | NULL                       | 장소 카테고리 (예: 한식, 카페)       |
| created_at      | TIMESTAMPTZ     | NOT NULL, DEFAULT NOW()    | 생성일시                            |
| updated_at      | TIMESTAMPTZ     | NOT NULL, DEFAULT NOW()    | 수정일시 (트리거로 자동 업데이트)    |

**인덱스:**
- `idx_places_naver_place_id`: `naver_place_id` (UNIQUE 제약조건으로 자동 생성)
- `idx_places_coordinates`: `latitude, longitude` (좌표 기반 검색 최적화)

**비즈니스 로직:**
- 네이버 검색 API에서 받은 장소 정보를 저장
- `naver_place_id`를 기준으로 UPSERT 처리 (중복 방지)
- 리뷰 작성 시 장소가 없으면 먼저 생성

---

### 4.2 reviews 테이블

사용자가 작성한 리뷰 정보를 저장하는 테이블입니다.

| 컬럼명         | 타입            | 제약조건                                      | 설명                                      |
|----------------|-----------------|----------------------------------------------|-------------------------------------------|
| id             | SERIAL          | PRIMARY KEY                                  | 리뷰 고유 식별자 (자동 증가)              |
| place_id       | INTEGER         | NOT NULL, FOREIGN KEY (places.id)            | 장소 ID (외래키)                          |
| nickname       | VARCHAR(50)     | NOT NULL                                     | 리뷰 작성자 닉네임                        |
| password_hash  | VARCHAR(255)    | NOT NULL                                     | bcrypt 해싱된 4자리 숫자 비밀번호         |
| rating         | NUMERIC(2, 1)   | NOT NULL, CHECK (rating >= 1.0 AND rating <= 5.0) | 별점 (1.0 ~ 5.0, 0.5 단위)   |
| review_text    | TEXT            | NULL                                         | 리뷰 텍스트 (선택사항)                    |
| created_at     | TIMESTAMPTZ     | NOT NULL, DEFAULT NOW()                      | 작성일시                                  |
| updated_at     | TIMESTAMPTZ     | NOT NULL, DEFAULT NOW()                      | 수정일시 (트리거로 자동 업데이트)          |

**인덱스:**
- `idx_reviews_place_id`: `place_id` (장소별 리뷰 조회 최적화)
- `idx_reviews_created_at`: `created_at DESC` (최신순 정렬 최적화)
- `idx_reviews_nickname`: `nickname` (닉네임 기반 인증 쿼리 최적화)

**제약조건:**
- `reviews_place_id_fkey`: `place_id` → `places.id` (ON DELETE CASCADE)
- `reviews_rating_check`: `rating >= 1.0 AND rating <= 5.0`

**비즈니스 로직:**
- 리뷰 작성 시 비밀번호는 bcrypt로 해싱하여 저장
- 수정/삭제 시 닉네임과 해싱된 비밀번호로 인증
- 동일 닉네임으로 같은 장소에 여러 리뷰 작성 가능 (제한 없음)

---

## 5. 주요 쿼리 예시

### 5.1 리뷰 작성

**1단계: 장소 저장 (UPSERT)**
```sql
INSERT INTO places (naver_place_id, name, address, latitude, longitude, category)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (naver_place_id)
DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  category = EXCLUDED.category,
  updated_at = NOW()
RETURNING id;
```

**2단계: 리뷰 저장**
```sql
INSERT INTO reviews (place_id, nickname, password_hash, rating, review_text)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, place_id, nickname, rating, review_text, created_at;
```

---

### 5.2 리뷰가 있는 장소 목록 조회 (지도 마커 표시)

```sql
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
```

---

### 5.3 장소 세부정보 및 리뷰 목록 조회

**장소 정보 + 평균 별점**
```sql
SELECT
  p.id,
  p.naver_place_id,
  p.name,
  p.address,
  p.latitude,
  p.longitude,
  p.category,
  COALESCE(AVG(r.rating), 0) as avg_rating,
  COUNT(r.id) as review_count
FROM places p
LEFT JOIN reviews r ON p.id = r.place_id
WHERE p.id = $1
GROUP BY p.id, p.naver_place_id, p.name, p.address, p.latitude, p.longitude, p.category;
```

**리뷰 목록 (최신순)**
```sql
SELECT
  id,
  place_id,
  nickname,
  rating,
  review_text,
  created_at,
  updated_at
FROM reviews
WHERE place_id = $1
ORDER BY created_at DESC;
```

---

### 5.4 리뷰 수정/삭제를 위한 인증 확인

**인증 확인 쿼리**
```sql
SELECT id, place_id, nickname, rating, review_text, created_at, updated_at
FROM reviews
WHERE id = $1 AND nickname = $2 AND password_hash = $3;
```

**리뷰 수정**
```sql
UPDATE reviews
SET
  rating = $1,
  review_text = $2,
  updated_at = NOW()
WHERE id = $3 AND nickname = $4 AND password_hash = $5
RETURNING id, place_id, nickname, rating, review_text, updated_at;
```

**리뷰 삭제**
```sql
DELETE FROM reviews
WHERE id = $1 AND nickname = $2 AND password_hash = $3
RETURNING id;
```

---

### 5.5 특정 장소의 평균 별점 계산

```sql
SELECT
  place_id,
  AVG(rating) as avg_rating,
  COUNT(*) as review_count
FROM reviews
WHERE place_id = $1
GROUP BY place_id;
```

---

## 6. 인덱스 전략

### 6.1 조회 성능 최적화

| 인덱스명                        | 테이블   | 컬럼                 | 목적                                    |
|---------------------------------|----------|----------------------|-----------------------------------------|
| places_pkey                     | places   | id                   | PRIMARY KEY (자동 생성)                 |
| places_naver_place_id_key       | places   | naver_place_id       | UNIQUE 제약조건 (자동 생성)             |
| idx_places_coordinates          | places   | latitude, longitude  | 좌표 기반 검색 최적화                   |
| reviews_pkey                    | reviews  | id                   | PRIMARY KEY (자동 생성)                 |
| idx_reviews_place_id            | reviews  | place_id             | 장소별 리뷰 조회 최적화                 |
| idx_reviews_created_at          | reviews  | created_at DESC      | 최신순 정렬 최적화                      |
| idx_reviews_nickname            | reviews  | nickname             | 닉네임 기반 인증 쿼리 최적화            |

### 6.2 인덱스 사용 시나리오

- **지도 마커 표시**: `idx_reviews_place_id` 사용하여 리뷰가 있는 장소 빠르게 조회
- **장소 세부정보**: `idx_reviews_place_id` + `idx_reviews_created_at` 조합으로 최신 리뷰 정렬
- **리뷰 인증**: `idx_reviews_nickname` 사용하여 닉네임 기반 조회 속도 향상
- **장소 검색**: `places_naver_place_id_key` 사용하여 중복 방지 및 빠른 조회

---

## 7. 보안 고려사항

### 7.1 비밀번호 보안
- **해싱 알고리즘**: bcrypt (cost factor: 10)
- **저장 형식**: 해싱된 문자열 (60자)
- **인증 방식**: 입력된 비밀번호를 해싱하여 DB의 `password_hash`와 비교

```typescript
// 예시: bcrypt 사용
import bcrypt from 'bcrypt';

// 저장 시
const passwordHash = await bcrypt.hash(password, 10);

// 인증 시
const isValid = await bcrypt.compare(password, passwordHash);
```

### 7.2 SQL Injection 방어
- 모든 쿼리에 파라미터화된 쿼리 사용 (`$1`, `$2` 등)
- ORM/쿼리 빌더 활용 (Supabase 클라이언트)

### 7.3 XSS 방어
- 사용자 입력 데이터 이스케이프 처리
- 프론트엔드에서 렌더링 시 sanitize 처리

---

## 8. 엣지케이스 처리

### 8.1 동일 닉네임 + 동일 장소 리뷰
- **허용**: 동일 닉네임으로 같은 장소에 여러 리뷰 작성 가능
- **이유**: 별도 회원가입 없이 닉네임만 사용하므로, 동일 닉네임이 여러 사용자일 수 있음

### 8.2 마지막 리뷰 삭제 시 장소 유지
- **동작**: 리뷰가 모두 삭제되어도 `places` 테이블의 장소 정보는 유지
- **이유**: 향후 동일 장소에 다시 리뷰 작성 가능

### 8.3 리뷰가 없는 장소
- **마커 표시**: 리뷰가 없는 장소는 지도에 마커 표시 안 함
- **쿼리**: `INNER JOIN`을 사용하여 리뷰가 있는 장소만 조회

### 8.4 장소 정보 업데이트
- **UPSERT 전략**: `naver_place_id`를 기준으로 중복 시 업데이트
- **이유**: 네이버 API의 장소 정보가 변경될 수 있음 (주소, 카테고리 등)

### 8.5 동시성 처리
- **낙관적 잠금**: `updated_at` 타임스탬프 비교
- **PostgreSQL 트랜잭션**: 리뷰 수정/삭제 시 트랜잭션 사용

---

## 9. 마이그레이션 가이드

### 9.1 마이그레이션 파일 위치
```
/supabase/migrations/YYYYMMDDHHMMSS_create_places_and_reviews_tables.sql
```

### 9.2 마이그레이션 적용 방법
```bash
# Supabase CLI 사용
supabase db push

# 또는 Supabase Dashboard에서 SQL Editor로 직접 실행
```

### 9.3 롤백 방법
```sql
-- 테이블 삭제 (주의: 모든 데이터 손실)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS places CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
```

---

## 10. 성능 최적화 전략

### 10.1 쿼리 최적화
- 필요한 컬럼만 SELECT
- JOIN 대신 서브쿼리 또는 집계 함수 활용
- EXPLAIN ANALYZE로 쿼리 플랜 확인

### 10.2 인덱스 모니터링
```sql
-- 인덱스 사용률 확인
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### 10.3 데이터베이스 통계
```sql
-- 테이블 크기 확인
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 11. 향후 확장 고려사항

본 문서는 최소 스펙으로 설계되었으며, 향후 다음과 같은 확장이 가능합니다:

### 11.1 추가 가능한 기능
- **이미지 첨부**: `review_images` 테이블 추가
- **좋아요/신고**: `review_likes`, `review_reports` 테이블 추가
- **회원 시스템**: `users` 테이블 추가 및 외래키 연결
- **댓글**: `review_comments` 테이블 추가

### 11.2 성능 개선
- **캐싱**: Redis 등을 활용한 평균 별점 캐싱
- **페이지네이션**: 리뷰 목록 무한 스크롤
- **전문 검색**: PostgreSQL Full-Text Search 또는 Elasticsearch

### 11.3 보안 강화
- **Rate Limiting**: API 호출 제한
- **CAPTCHA**: 스팸 리뷰 방지
- **IP 추적**: 악의적 사용자 차단

---

## 12. 참고사항

- 본 문서는 `/docs/prd.md`와 `/docs/userflow.md`를 기반으로 작성되었습니다.
- 데이터베이스 스키마 변경 시 반드시 마이그레이션 파일을 생성하세요.
- RLS(Row Level Security)는 비활성화되어 있으므로, 애플리케이션 레벨에서 접근 제어를 구현해야 합니다.
- 모든 타임스탬프는 UTC 기준으로 저장됩니다.
