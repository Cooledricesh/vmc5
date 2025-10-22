export const reviewErrorCodes = {
  validationError: 'REVIEW_VALIDATION_ERROR',
  placeUpsertFailed: 'PLACE_UPSERT_FAILED',
  passwordHashFailed: 'PASSWORD_HASH_FAILED',
  reviewInsertFailed: 'REVIEW_INSERT_FAILED',
  placeNotFound: 'PLACE_NOT_FOUND',
} as const;

export type ReviewServiceError =
  (typeof reviewErrorCodes)[keyof typeof reviewErrorCodes];
