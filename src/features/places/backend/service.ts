import type { SupabaseClient } from '@supabase/supabase-js';
import { failure, success, type HandlerResult } from '@/backend/http/response';
import { PlaceRowSchema, type PlacesWithReviewsResponse } from './schema';
import { placesErrorCodes, type PlacesServiceError } from './error';

export const getPlacesWithReviews = async (
  client: SupabaseClient
): Promise<HandlerResult<PlacesWithReviewsResponse, PlacesServiceError, unknown>> => {
  const { data, error } = await client.rpc('get_places_with_reviews');

  if (error) {
    return failure(500, placesErrorCodes.fetchError, error.message);
  }

  const validatedPlaces = [];
  for (const row of data ?? []) {
    const parsed = PlaceRowSchema.safeParse(row);
    if (!parsed.success) {
      return failure(
        500,
        placesErrorCodes.validationError,
        'Place row validation failed',
        parsed.error.format()
      );
    }
    validatedPlaces.push(parsed.data);
  }

  return success({ places: validatedPlaces });
};
