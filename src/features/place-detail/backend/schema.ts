import { z } from 'zod';

// ===== 장소 정보 응답 (평균 별점 포함) =====

export const PlaceDetailResponseSchema = z.object({
  id: z.number(),
  naver_place_id: z.string(),
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  category: z.string().nullable(),
  avg_rating: z.number().nullable(),
  review_count: z.number(),
});

// ===== 리뷰 응답 (비밀번호 제외) =====

export const ReviewResponseSchema = z.object({
  id: z.number(),
  place_id: z.number(),
  nickname: z.string(),
  rating: z.number(),
  review_text: z.string().nullable(),
  created_at: z.string(), // ISO 문자열
  updated_at: z.string(),
});

export const ReviewListResponseSchema = z.object({
  reviews: z.array(ReviewResponseSchema),
});

// ===== 타입 추론 =====

export type PlaceDetailResponse = z.infer<typeof PlaceDetailResponseSchema>;
export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;
export type ReviewListResponse = z.infer<typeof ReviewListResponseSchema>;
