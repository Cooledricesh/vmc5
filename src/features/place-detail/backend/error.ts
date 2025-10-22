export const placeDetailErrorCodes = {
  placeNotFound: 'PLACE_NOT_FOUND',
  placeFetchFailed: 'PLACE_FETCH_FAILED',
  reviewsFetchFailed: 'REVIEWS_FETCH_FAILED',
  validationError: 'VALIDATION_ERROR',
  invalidPlaceId: 'INVALID_PLACE_ID',
} as const;

export type PlaceDetailServiceError =
  (typeof placeDetailErrorCodes)[keyof typeof placeDetailErrorCodes];
