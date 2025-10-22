// 네이버 지도 SDK 동적 로딩
let isMapSdkLoaded = false;
let isMapSdkLoading = false;
let loadPromise: Promise<void> | null = null;

// window.naver.maps가 준비될 때까지 대기
const waitForNaverMaps = (maxAttempts = 50, interval = 100): Promise<void> => {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const checkNaverMaps = () => {
      attempts++;

      if (typeof window !== 'undefined' && window.naver?.maps) {
        resolve();
      } else if (attempts >= maxAttempts) {
        reject(new Error('Naver Maps SDK initialization timeout'));
      } else {
        setTimeout(checkNaverMaps, interval);
      }
    };

    checkNaverMaps();
  });
};

export const loadNaverMapSdk = (): Promise<void> => {
  // 이미 로드됨
  if (isMapSdkLoaded && window.naver?.maps) {
    return Promise.resolve();
  }

  // 로딩 중
  if (isMapSdkLoading && loadPromise) {
    return loadPromise;
  }

  isMapSdkLoading = true;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
    script.async = true;

    script.onload = async () => {
      try {
        // SDK 파일 로드 후 window.naver.maps 초기화 대기
        await waitForNaverMaps();
        isMapSdkLoaded = true;
        isMapSdkLoading = false;
        resolve();
      } catch (error) {
        isMapSdkLoading = false;
        loadPromise = null;
        reject(error);
      }
    };

    script.onerror = () => {
      isMapSdkLoading = false;
      loadPromise = null;
      reject(new Error('Failed to load Naver Map SDK'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};

// 인증 실패 핸들러 설정
export const setMapAuthFailureHandler = (handler?: (errorCode?: number) => void) => {
  (window as any).navermap_authFailure = (error?: any) => {
    console.error('네이버 지도 인증 실패');

    if (handler) {
      handler(error?.code);
    } else {
      alert(
        '지도를 불러올 수 없습니다.\n\n' +
        '가능한 원인:\n' +
        '1. 클라이언트 ID가 올바르지 않습니다\n' +
        '2. 웹 서비스 URL이 등록되지 않았습니다\n' +
        '   (네이버 클라우드 플랫폼 콘솔에서 http://localhost 등록 필요)\n' +
        '3. Dynamic Map API가 선택되지 않았습니다\n' +
        '4. 일일 호출 한도를 초과했습니다\n\n' +
        '네이버 클라우드 플랫폼 콘솔에서 설정을 확인해주세요.'
      );
    }
  };
};
