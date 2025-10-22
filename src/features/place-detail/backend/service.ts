import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import {
  failure,
  success,
  type HandlerResult,
} from '@/backend/http/response';
import {
  PlaceDetailResponseSchema,
  ReviewResponseSchema,
  type PlaceDetailResponse,
  type ReviewListResponse,
} from './schema';
import {
  placeDetailErrorCodes,
  type PlaceDetailServiceError,
} from './error';

/**
 * 장소 정보 조회 (평균 별점 포함)
 */
export const getPlaceById = async (
  client: SupabaseClient,
  placeId: number
): Promise<
  HandlerResult<PlaceDetailResponse, PlaceDetailServiceError, unknown>
> => {
  try {
    // 장소 정보 조회
    const { data, error } = await client
      .from('places')
      .select('id, naver_place_id, name, address, latitude, longitude, category')
      .eq('id', placeId)
      .maybeSingle();

    if (error) {
      return failure(
        500,
        placeDetailErrorCodes.placeFetchFailed,
        error.message
      );
    }

    if (!data) {
      return failure(
        404,
        placeDetailErrorCodes.placeNotFound,
        'Place not found'
      );
    }

    // 평균 별점 및 리뷰 개수 조회
    const { data: stats, error: statsError } = await client
      .from('reviews')
      .select('rating')
      .eq('place_id', placeId);

    if (statsError) {
      return failure(
        500,
        placeDetailErrorCodes.placeFetchFailed,
        statsError.message
      );
    }

    const reviewCount = stats?.length || 0;
    const avgRating =
      reviewCount > 0
        ? stats.reduce((sum, r) => sum + Number(r.rating), 0) / reviewCount
        : null;

    const result: PlaceDetailResponse = {
      ...data,
      avg_rating: avgRating,
      review_count: reviewCount,
    };

    const validated = PlaceDetailResponseSchema.safeParse(result);
    if (!validated.success) {
      return failure(
        500,
        placeDetailErrorCodes.validationError,
        'Validation failed',
        validated.error.format()
      );
    }

    return success(validated.data);
  } catch (error) {
    return failure(
      500,
      placeDetailErrorCodes.placeFetchFailed,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

/**
 * 리뷰 목록 조회 (최신순 정렬)
 */
export const getReviewsByPlaceId = async (
  client: SupabaseClient,
  placeId: number
): Promise<
  HandlerResult<ReviewListResponse, PlaceDetailServiceError, unknown>
> => {
  try {
    const { data, error } = await client
      .from('reviews')
      .select('id, place_id, nickname, rating, review_text, created_at, updated_at')
      .eq('place_id', placeId)
      .order('created_at', { ascending: false });

    if (error) {
      return failure(
        500,
        placeDetailErrorCodes.reviewsFetchFailed,
        error.message
      );
    }

    const validated = z.array(ReviewResponseSchema).safeParse(data || []);
    if (!validated.success) {
      return failure(
        500,
        placeDetailErrorCodes.validationError,
        'Validation failed',
        validated.error.format()
      );
    }

    return success({ reviews: validated.data });
  } catch (error) {
    return failure(
      500,
      placeDetailErrorCodes.reviewsFetchFailed,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
