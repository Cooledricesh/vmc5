import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/remote/api-client';
import { ReviewListResponseSchema, type ReviewListResponse } from '../lib/dto';

export const usePlaceReviews = (placeId: number | null) => {
  return useQuery({
    queryKey: ['place', placeId, 'reviews'],
    queryFn: async () => {
      if (!placeId) {
        throw new Error('Place ID is required');
      }

      const response = await apiClient.get(`/places/${placeId}/reviews`);
      const validated = ReviewListResponseSchema.safeParse(response);

      if (!validated.success) {
        throw new Error('Invalid response format');
      }

      return validated.data;
    },
    enabled: !!placeId && placeId > 0,
    staleTime: 1000 * 60 * 2, // 2분
    retry: 2,
  });
};
