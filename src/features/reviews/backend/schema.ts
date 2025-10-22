import { z } from 'zod';

// ===== 요청 스키마 =====

// 장소 정보 스키마 (요청 본문에 포함)
export const CreateReviewPlaceSchema = z.object({
  naver_place_id: z.string().min(1, 'Naver place ID is required'),
  name: z.string().min(1, 'Place name is required'),
  address: z.string().min(1, 'Address is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  category: z.string().optional(),
});

// 리뷰 정보 스키마 (요청 본문에 포함)
export const CreateReviewDataSchema = z.object({
  nickname: z
    .string()
    .min(1, 'Nickname is required')
    .max(20, 'Nickname must be 20 characters or less')
    .trim(),
  password: z
    .string()
    .regex(/^\d{4}$/, 'Password must be exactly 4 digits'),
  rating: z
    .number()
    .min(1.0, 'Rating must be at least 1.0')
    .max(5.0, 'Rating must be at most 5.0')
    .refine((val) => val % 0.5 === 0, 'Rating must be in 0.5 increments'),
  review_text: z
    .string()
    .max(500, 'Review text must be 500 characters or less')
    .optional(),
});

// 전체 요청 스키마
export const CreateReviewRequestSchema = z.object({
  place: CreateReviewPlaceSchema,
  review: CreateReviewDataSchema,
});

// ===== 데이터베이스 스키마 =====

// places 테이블 행 스키마
export const PlaceTableRowSchema = z.object({
  id: z.number(),
  naver_place_id: z.string(),
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  category: z.string().nullable(),
  created_at: z.string(), // Supabase는 ISO 문자열로 반환
  updated_at: z.string(),
});

// reviews 테이블 행 스키마
export const ReviewTableRowSchema = z.object({
  id: z.number(),
  place_id: z.number(),
  nickname: z.string(),
  password_hash: z.string(),
  rating: z.number(),
  review_text: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ===== 응답 스키마 =====

export const CreateReviewResponseSchema = z.object({
  reviewId: z.number(),
  placeId: z.number(),
  redirectUrl: z.string(),
});

// ===== 타입 추론 =====

export type CreateReviewPlace = z.infer<typeof CreateReviewPlaceSchema>;
export type CreateReviewData = z.infer<typeof CreateReviewDataSchema>;
export type CreateReviewRequest = z.infer<typeof CreateReviewRequestSchema>;
export type PlaceTableRow = z.infer<typeof PlaceTableRowSchema>;
export type ReviewTableRow = z.infer<typeof ReviewTableRowSchema>;
export type CreateReviewResponse = z.infer<typeof CreateReviewResponseSchema>;
