## 네이버 검색 API 연동 완벽 가이드

### API 개요

**베이스 URL**
- `https://openapi.naver.com/v1/search/`

**인증 방식**
- 비로그인 방식: HTTP 헤더에 Client ID와 Client Secret 전송[3][1]

**호출 한도**
- 일일 25,000회 (모든 검색 API 통합)[4][1][3]
- 초과 시 HTTP 429 오류 발생[5]

### 제공되는 검색 API 엔드포인트



**주요 엔드포인트 목록**:[2][6][7][8][9][10][11][12][1][3]

| API 종류 | JSON 엔드포인트 | XML 엔드포인트 |
|---------|----------------|---------------|
| 블로그 검색 | `/search/blog.json` | `/search/blog.xml` |
| 뉴스 검색 | `/search/news.json` | `/search/news.xml` |
| 웹문서 검색 | `/search/webkr.json` | `/search/webkr.xml` |
| 쇼핑 검색 | `/search/shop.json` | `/search/shop.xml` |
| 책 검색 | `/search/book.json` | `/search/book.xml` |
| 카페글 검색 | `/search/cafearticle.json` | `/search/cafearticle.xml` |
| 이미지 검색 | `/search/image.json` | `/search/image.xml` |
| 백과사전 검색 | `/search/encyc.json` | `/search/encyc.xml` |
| 전문자료 검색 | `/search/doc.json` | `/search/doc.xml` |
| 지식iN 검색 | `/search/kin.json` | `/search/kin.xml` |
| 지역 검색 | `/search/local.json` | `/search/local.xml` |
| 성인 검색어 판별 | `/search/adult.json` | `/search/adult.xml` |
| 오타 변환 | `/search/errata.json` | `/search/errata.xml` |

### API 파라미터



**공통 파라미터**:[1][2][3]

| 파라미터 | 타입 | 필수 여부 | 설명 |
|---------|------|----------|------|
| `query` | String | 필수 | 검색어 (UTF-8 인코딩 필요) |
| `display` | Integer | 선택 | 한 번에 표시할 검색 결과 개수 (기본값: 10, 최댓값: 100) |
| `start` | Integer | 선택 | 검색 시작 위치 (기본값: 1, 최댓값: 1000) |
| `sort` | String | 선택 | 정렬 방법 (sim: 정확도순, date: 날짜순) |

**특수 파라미터**:
- **쇼핑 검색**: `filter` (naverpay 필터), `exclude` (중고/렌탈/해외직구 제외)[8]
- **이미지 검색**: `filter` (크기별 필터: all/large/medium/small)[9]
- **지식iN 검색**: `sort` (point: 평점순 정렬 추가)[11]
- **지역 검색**: `sort` (random: 정확도순, comment: 리뷰 개수순)[1]

***

## 인증 정보 발급 및 세팅 방법 (Step by Step)

### 1단계: 네이버 개발자 센터 접속

1. [네이버 개발자 센터](https://developers.naver.com) 접속[13][14]
2. 네이버 계정으로 로그인
3. 회사/단체는 네이버 단체 회원 사용 권장[14][3]

### 2단계: 애플리케이션 등록

1. 상단 메뉴에서 **[Application] → [애플리케이션 등록]** 클릭[13][14]
2. 애플리케이션 정보 입력:
   - **애플리케이션 이름**: 원하는 이름 입력 (최대 40자, 로그인 API 사용 시 10자 이내 권장)[14]
   - **사용 API**: **"검색"** 선택[3][13]
   - **비로그인 오픈 API 서비스 환경**:[14]
     - **Web**: 도메인 입력 (예: `example.com`, www 제외 시 서브도메인 자동 포함)
     - **Android**: 패키지 이름 입력
     - **iOS**: URL Scheme 입력

3. **[등록하기]** 버튼 클릭[13]

### 3단계: API 인증 키 확인

1. **[Application] → [내 애플리케이션]** 메뉴로 이동[13][14]
2. 등록한 애플리케이션 선택
3. **개요** 탭에서 확인:
   - **Client ID**: API 호출 시 사용하는 인증 키
   - **Client Secret**: 보안 인증을 위한 비밀 키 (보기 버튼 클릭 시 확인)[14]

⚠️ **주의사항**:[3][14]
- Client Secret은 비밀번호와 같으므로 안전하게 보관
- 외부 노출 시 즉시 재발급 필요
- 클라이언트 바이너리에 저장 금지

***

## API 호출 방법 및 구현 예제

### 요청 헤더 설정

모든 API 요청 시 다음 헤더 필수:[2][1][3]

```
X-Naver-Client-Id: {발급받은 클라이언트 아이디}
X-Naver-Client-Secret: {발급받은 클라이언트 시크릿}
```

### 검색어 인코딩

검색어는 **UTF-8로 URL 인코딩** 필수:[15][16][2][1][3]

```
잘못된 예: query=네이버
올바른 예: query=%EB%84%A4%EC%9D%B4%EB%B2%84
```

### 구현 예제

#### Python 예제[17][3]

```python
import urllib.request
import urllib.parse

# API 인증 정보
client_id = "YOUR_CLIENT_ID"
client_secret = "YOUR_CLIENT_SECRET"

# 검색어 UTF-8 인코딩
query = urllib.parse.quote("검색할 단어")

# API 호출 URL
url = f"https://openapi.naver.com/v1/search/blog.json?query={query}&display=10&start=1&sort=sim"

# 요청 객체 생성 및 헤더 설정
request = urllib.request.Request(url)
request.add_header("X-Naver-Client-Id", client_id)
request.add_header("X-Naver-Client-Secret", client_secret)

# API 호출
response = urllib.request.urlopen(request)
rescode = response.getcode()

if rescode == 200:
    response_body = response.read()
    print(response_body.decode('utf-8'))
else:
    print(f"Error Code: {rescode}")
```

#### Node.js 예제[17][3]

```javascript
const express = require('express');
const request = require('request');
const app = express();

const client_id = 'YOUR_CLIENT_ID';
const client_secret = 'YOUR_CLIENT_SECRET';

app.get('/search/blog', function (req, res) {
    const api_url = 'https://openapi.naver.com/v1/search/blog.json?query=' 
        + encodeURI(req.query.query);
    
    const options = {
        url: api_url,
        headers: {
            'X-Naver-Client-Id': client_id, 
            'X-Naver-Client-Secret': client_secret
        }
    };
    
    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
            res.end(body);
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
});

app.listen(3000, function () {
    console.log('http://127.0.0.1:3000/search/blog?query=검색어');
});
```

#### cURL 예제[2][3]

```bash
curl "https://openapi.naver.com/v1/search/blog.json?query=%EB%A6%AC%EB%B7%B0&display=10&start=1&sort=sim" \
  -H "X-Naver-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Naver-Client-Secret: YOUR_CLIENT_SECRET" \
  -v
```

***

## 주요 오류 코드 및 해결 방법

### 인증 관련 오류[5]

| 오류 코드 | 원인 | 해결 방법 |
|---------|------|----------|
| 401 | 클라이언트 아이디/시크릿 누락 또는 오류 | 내 애플리케이션에서 키 확인[5] |
| 401 | 헤더 설정 오류 | HTTP 헤더에 정확히 설정 (URL/폼 아님)[5] |
| 401 | API 권한 미설정 | API 설정 탭에서 "검색" 추가 확인[5][18] |
| 403 | HTTP 사용 (HTTPS 필요) | 프로토콜을 HTTPS로 변경[5] |
| 403 | API 권한 없음 | 애플리케이션에 검색 API 추가[3][5] |

### 요청 관련 오류[5]

| 오류 코드 | 원인 | 해결 방법 |
|---------|------|----------|
| 400 | 필수 파라미터 누락 또는 이름 오류 | API 레퍼런스에서 필수 파라미터 확인[5] |
| 400 | URL 인코딩 누락 | 검색어를 UTF-8로 인코딩[15][5][16] |
| 404 | 잘못된 API URL | 요청 URL에 오타 확인[5] |
| 405 | HTTP 메서드 오류 | GET/POST 메서드 확인[5] |
| 429 | 일일 호출 한도 초과 (25,000회) | 다음 날까지 대기 또는 제휴 신청[5] |
| 500 | 서버 오류 | 개발자 포럼에 신고[5] |

### SE 계열 오류 (검색 API 전용)[3]

| 오류 코드 | 원인 | 해결 방법 |
|---------|------|----------|
| SE01 | 잘못된 쿼리 요청 | URL 프로토콜, 파라미터 확인[3] |
| SE02 | display 값 오류 | 1~100 범위 확인[3] |
| SE03 | start 값 오류 | 1~1000 범위 확인[3] |
| SE04 | sort 값 오류 | 오타 확인[3] |
| SE06 | 인코딩 오류 | UTF-8 인코딩 확인[3] |

***

## 자주 발생하는 문제 및 해결책

### 1. 한글 검색어 깨짐 문제[16][19][15]

**원인**: UTF-8 인코딩 누락

**해결책**:
- Python: `urllib.parse.quote()` 사용[15]
- JavaScript: `encodeURI()` 또는 `encodeURIComponent()` 사용[16]
- Java: `URLEncoder.encode(keyword, "UTF-8")` 사용[15]

### 2. 403 Forbidden 오류[18][20][21]

**원인**:
- API 권한 미설정[18][5]
- HTTPS 대신 HTTP 사용[5]
- referer 헤더 누락 (지도 API)[21]

**해결책**:
- 내 애플리케이션 → API 설정에서 "검색" 추가 확인[18][5]
- 요청 URL을 HTTPS로 변경[5]
- 필요 시 referer 헤더 추가[21]

### 3. Client Secret 노출 방지[22]

**해결책**:
- 환경 변수 또는 별도 설정 파일에 저장
- `.env` 파일 사용 (`.gitignore`에 추가)[23]
- 클라이언트 측 코드에 하드코딩 금지

### 4. 초당 호출 한도 (Rate Limit)[24][25]

**대응 방법**:
- Queue 구조로 API 호출 관리[24]
- 1초 단위로 요청 분산[24]
- 지수 백오프(exponential backoff) 구현[26]

***

## LTS 버전 및 최신 정보 검증

### 현재 API 상태 (2025년 10월 기준)

- 네이버 검색 API는 **v1 버전**이 현재 안정 버전[1][2][3]
- 공식 문서에 별도 LTS 명시 없음
- API 엔드포인트 및 인증 방식 변경 없이 안정적으로 유지[1][3]

### 최신 변경 사항 모니터링

1. [네이버 오픈 API 상태 페이지](https://developers.naver.com/notice/apistatus/) 확인[27]
2. [개발자 포럼](https://developers.naver.com/forum) 정기적 확인[28]
3. API 공지사항 구독[28]

### 2024-2025년 주요 이슈[29][30][21]

- 지도 API referer 헤더 검증 추가[21]
- 검색광고 API 확장검색 데이터 추가[30]
- 초당 호출량 제한 정책 강화[5]

***

## 추가 참고 사항

### API 테스트 도구

- **Postman**: 헤더 설정 및 요청 테스트[20][21]
- **cURL**: 커맨드라인 테스트[2][3]
- **Chrome 확장 프로그램**: ModHeader로 헤더 테스트[21]

### 보안 권장사항[31][22]

1. Client Secret은 서버 측에서만 사용
2. HTTPS 프로토콜 필수 사용[5]
3. API 키 정기적 재발급
4. IP 기반 접근 제한 설정 (가능 시)

### 성능 최적화[26]

1. 응답 데이터 캐싱
2. 배치 처리로 API 호출 최소화
3. 비동기 처리 구현
4. Connection pooling 활용
