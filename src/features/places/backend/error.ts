export const placesErrorCodes = {
  fetchError: 'PLACES_FETCH_ERROR',
  validationError: 'PLACES_VALIDATION_ERROR',
} as const;

export type PlacesServiceError = typeof placesErrorCodes[keyof typeof placesErrorCodes];
