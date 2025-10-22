'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/remote/api-client';
import {
  CreateReviewRequestSchema,
  CreateReviewResponseSchema,
  type CreateReviewRequest,
  type CreateReviewResponse,
} from '../lib/dto';

export const useCreateReview = () => {
  return useMutation<CreateReviewResponse, Error, CreateReviewRequest>({
    mutationFn: async (payload: CreateReviewRequest) => {
      // 요청 검증
      const parsedPayload = CreateReviewRequestSchema.parse(payload);

      // API 호출
      const response = await apiClient.post('/api/reviews', parsedPayload);

      // 응답 검증
      const parsedResponse = CreateReviewResponseSchema.parse(response.data);

      return parsedResponse;
    },
  });
};
