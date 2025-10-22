import type { SupabaseClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import {
  failure,
  success,
  type HandlerResult,
} from '@/backend/http/response';
import {
  CreateReviewRequestSchema,
  type CreateReviewRequest,
  type CreateReviewResponse,
} from './schema';
import { reviewErrorCodes, type ReviewServiceError } from './error';

const SALT_ROUNDS = 10;

/**
 * 장소 UPSERT
 * naver_place_id를 기준으로 장소가 있으면 업데이트, 없으면 생성
 */
const upsertPlace = async (
  client: SupabaseClient,
  place: CreateReviewRequest['place']
): Promise<HandlerResult<number, ReviewServiceError, unknown>> => {
  try {
    // naver_place_id로 기존 장소 조회
    const { data: existingPlace, error: selectError } = await client
      .from('places')
      .select('id')
      .eq('naver_place_id', place.naver_place_id)
      .maybeSingle();

    if (selectError) {
      return failure(
        500,
        reviewErrorCodes.placeUpsertFailed,
        selectError.message
      );
    }

    // 기존 장소가 있으면 ID 반환
    if (existingPlace) {
      return success(existingPlace.id);
    }

    // 없으면 새로 생성
    const { data: newPlace, error: insertError } = await client
      .from('places')
      .insert({
        naver_place_id: place.naver_place_id,
        name: place.name,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        category: place.category || null,
      })
      .select('id')
      .single();

    if (insertError || !newPlace) {
      return failure(
        500,
        reviewErrorCodes.placeUpsertFailed,
        insertError?.message || 'Failed to insert place'
      );
    }

    return success(newPlace.id);
  } catch (error) {
    return failure(
      500,
      reviewErrorCodes.placeUpsertFailed,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

/**
 * 비밀번호 해싱 (bcrypt)
 */
const hashPassword = async (
  password: string
): Promise<HandlerResult<string, ReviewServiceError, unknown>> => {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return success(hash);
  } catch (error) {
    return failure(
      500,
      reviewErrorCodes.passwordHashFailed,
      error instanceof Error ? error.message : 'Failed to hash password'
    );
  }
};

/**
 * 리뷰 생성 (메인 함수)
 */
export const createReview = async (
  client: SupabaseClient,
  payload: CreateReviewRequest
): Promise<HandlerResult<CreateReviewResponse, ReviewServiceError, unknown>> => {
  // 1. 요청 데이터 검증
  const parsed = CreateReviewRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return failure(
      400,
      reviewErrorCodes.validationError,
      'Invalid request data',
      parsed.error.format()
    );
  }

  const { place, review } = parsed.data;

  // 2. 장소 UPSERT
  const placeResult = await upsertPlace(client, place);
  if (!placeResult.ok) {
    return placeResult as HandlerResult<
      CreateReviewResponse,
      ReviewServiceError,
      unknown
    >;
  }
  const placeId = placeResult.data;

  // 3. 비밀번호 해싱
  const hashResult = await hashPassword(review.password);
  if (!hashResult.ok) {
    return hashResult as HandlerResult<
      CreateReviewResponse,
      ReviewServiceError,
      unknown
    >;
  }
  const passwordHash = hashResult.data;

  // 4. 리뷰 삽입
  try {
    const { data: newReview, error: insertError } = await client
      .from('reviews')
      .insert({
        place_id: placeId,
        nickname: review.nickname,
        password_hash: passwordHash,
        rating: review.rating,
        review_text: review.review_text || null,
      })
      .select('id')
      .single();

    if (insertError || !newReview) {
      return failure(
        500,
        reviewErrorCodes.reviewInsertFailed,
        insertError?.message || 'Failed to insert review'
      );
    }

    return success({
      reviewId: newReview.id,
      placeId,
      redirectUrl: `/places/${placeId}`,
    });
  } catch (error) {
    return failure(
      500,
      reviewErrorCodes.reviewInsertFailed,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
