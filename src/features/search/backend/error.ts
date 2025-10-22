export const searchErrorCodes = {
  naverApiFailed: 'NAVER_API_FAILED',
  rateLimitExceeded: 'RATE_LIMIT_EXCEEDED',
  validationError: 'SEARCH_VALIDATION_ERROR',
} as const;

export type SearchServiceError = typeof searchErrorCodes[keyof typeof searchErrorCodes];
