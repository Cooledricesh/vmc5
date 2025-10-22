export const PLACE_DETAIL_MESSAGES = {
  INVALID_ACCESS: '잘못된 접근입니다. 메인 페이지로 이동합니다.',
  PLACE_NOT_FOUND: '존재하지 않는 장소입니다.',
  FETCH_ERROR: '장소 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.',
  REVIEWS_FETCH_ERROR: '리뷰 목록을 불러오는 데 실패했습니다.',
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
} as const;

export const REDIRECT_DELAY_MS = 3000;
