import { z } from 'zod';

// 데이터베이스 테이블 스키마
export const PlaceRowSchema = z.object({
  id: z.number(),
  naver_place_id: z.string(),
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  category: z.string().nullable(),
  review_count: z.number(),
});

// API 응답 스키마
export const PlacesWithReviewsResponseSchema = z.object({
  places: z.array(PlaceRowSchema),
});

export type PlaceRow = z.infer<typeof PlaceRowSchema>;
export type PlacesWithReviewsResponse = z.infer<typeof PlacesWithReviewsResponseSchema>;
