# 맛집 리뷰 플랫폼

네이버 지도 SDK와 네이버 검색 API를 활용한 웹 기반 맛집 리뷰 플랫폼입니다.
지도 기반으로 맛집을 검색하고, 별점과 리뷰를 남길 수 있는 간단하고 직관적인 서비스입니다.

## 주요 기능

### 🗺️ 지도 기반 검색
- 네이버 지도 SDK를 활용한 인터랙티브 지도
- 장소 검색 및 실시간 지도 이동
- 리뷰가 있는 장소에 마커 자동 표시

### ⭐ 리뷰 시스템
- 별점 평가 (1-5점, 0.5점 단위)
- 텍스트 리뷰 작성
- 닉네임 + 4자리 비밀번호 인증 시스템
- 리뷰 수정/삭제 기능

### 📍 장소 세부정보
- 장소 기본 정보 표시
- 평균 별점 및 리뷰 수 표시
- 작성된 리뷰 목록 (최신순 정렬)

## 기술 스택

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Component Library**: Shadcn UI
- **State Management**:
  - Zustand (클라이언트 상태)
  - TanStack React Query (서버 상태)
- **Form**: React Hook Form + Zod
- **Map**: Naver Map SDK

### Backend
- **API Framework**: Hono
- **Database**: Supabase (PostgreSQL)
- **Authentication**: bcrypt (비밀번호 해싱)
- **Validation**: Zod

### Development
- **Language**: TypeScript
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier

### Utilities
- **Date Handling**: date-fns
- **Pattern Matching**: ts-pattern
- **React Hooks**: react-use
- **Utility Functions**: es-toolkit
- **Icons**: Lucide React

## 프로젝트 구조

```
vmc5/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # 메인 페이지 (지도)
│   │   ├── places/[id]/page.tsx      # 장소 세부정보 페이지
│   │   ├── reviews/new/page.tsx      # 리뷰 작성 페이지
│   │   └── api/[[...hono]]/          # Hono API 엔드포인트
│   │
│   ├── features/                     # 기능별 모듈
│   │   ├── map/                      # 지도 관련 기능
│   │   ├── search/                   # 장소 검색 기능
│   │   ├── places/                   # 장소 관리 기능
│   │   ├── reviews/                  # 리뷰 관리 기능
│   │   └── place-detail/             # 장소 상세정보 기능
│   │
│   ├── backend/                      # 백엔드 레이어
│   │   ├── hono/                     # Hono 앱 설정
│   │   ├── middleware/               # 공통 미들웨어
│   │   ├── http/                     # HTTP 응답 헬퍼
│   │   ├── supabase/                 # Supabase 클라이언트
│   │   └── config/                   # 환경 변수 관리
│   │
│   ├── components/                   # 공통 컴포넌트
│   │   └── ui/                       # Shadcn UI 컴포넌트
│   │
│   ├── lib/                          # 유틸리티 함수
│   ├── hooks/                        # 공통 React Hooks
│   └── constants/                    # 상수 정의
│
├── supabase/
│   └── migrations/                   # 데이터베이스 마이그레이션
│
└── docs/                             # 프로젝트 문서
    ├── prd.md                        # 제품 요구사항 문서
    ├── userflow.md                   # 사용자 플로우
    ├── database.md                   # 데이터베이스 설계
    └── usecases/                     # 유스케이스별 상세 문서
```

## 시작하기

### 필수 요구사항

- Node.js 20 이상
- npm
- Supabase 계정
- 네이버 클라우드 플랫폼 계정 (Map SDK, Search API)

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Naver
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_naver_map_client_id
NAVER_SEARCH_CLIENT_ID=your_naver_search_client_id
NAVER_SEARCH_CLIENT_SECRET=your_naver_search_client_secret
```

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **데이터베이스 마이그레이션**

   Supabase Dashboard의 SQL Editor에서 다음 마이그레이션 파일들을 순서대로 실행하세요:

   - `supabase/migrations/20250101000000_create_places_and_reviews_tables.sql`
   - `supabase/migrations/20251022000000_create_get_places_with_reviews_function.sql`

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**

   [http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 아키텍처

### Backend Layer (Hono + Next.js)

- Next.js App Router의 Route Handler를 통해 Hono 앱 위임
- 모든 API 요청은 `/api/*` 경로로 라우팅
- `runtime = 'nodejs'`로 Supabase service-role 키 사용

### Feature-based Structure

각 기능은 다음과 같은 구조로 구성됩니다:

```
features/[feature-name]/
├── components/          # UI 컴포넌트
├── hooks/               # React Hooks
├── backend/
│   ├── route.ts         # Hono 라우터
│   ├── service.ts       # 비즈니스 로직
│   ├── schema.ts        # Zod 스키마
│   └── error.ts         # 에러 코드 정의
├── lib/                 # 유틸리티 함수
└── constants/           # 상수 정의
```

### 데이터베이스 스키마

- **places**: 장소 정보 저장 (네이버 검색 API 응답 기반)
- **reviews**: 리뷰 정보 저장 (닉네임, 별점, 텍스트, 해싱된 비밀번호)

자세한 내용은 [docs/database.md](docs/database.md)를 참고하세요.

## 개발 가이드

### 코드 스타일

- **클라이언트 컴포넌트**: 모든 컴포넌트는 `"use client"` 지시문 사용
- **타입 안전성**: TypeScript 타입 오류 없이 빌드 가능해야 함
- **Linting**: ESLint 규칙 준수
- **상수 관리**: 하드코딩 금지, 모든 값은 상수/환경변수로 관리

### 주요 라이브러리 사용 가이드

- **날짜 처리**: date-fns
- **패턴 매칭**: ts-pattern
- **서버 상태**: TanStack React Query
- **전역 상태**: Zustand
- **유틸리티**: es-toolkit
- **폼 관리**: React Hook Form + Zod
- **아이콘**: Lucide React

### API 응답 형식

모든 API는 다음 형식의 응답을 반환합니다:

```typescript
// 성공
{
  success: true,
  data: { ... }
}

// 실패
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "에러 메시지"
  }
}
```

## 문서

자세한 프로젝트 문서는 `docs/` 디렉토리에서 확인할 수 있습니다:

- [PRD (제품 요구사항 문서)](docs/prd.md)
- [사용자 플로우](docs/userflow.md)
- [데이터베이스 설계](docs/database.md)
- [네이버 지도 SDK 가이드](docs/map_sdk.md)
- [네이버 검색 API 가이드](docs/searchAPI.md)
- [유스케이스 문서](docs/usecases/)

## 제약사항

- 사용자 인증은 닉네임 + 4자리 숫자 비밀번호로만 처리 (별도 회원가입 없음)
- 리뷰는 텍스트만 지원 (사진 첨부 불가)
- 명시된 기능 외 추가 기능 구현하지 않음 (오버엔지니어링 지양)

## 라이선스

This project is private and proprietary.
