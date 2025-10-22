import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/remote/api-client';
import { PlaceDetailResponseSchema, type PlaceDetailResponse } from '../lib/dto';

export const usePlaceDetail = (placeId: number | null) => {
  return useQuery({
    queryKey: ['place', placeId],
    queryFn: async () => {
      if (!placeId) {
        throw new Error('Place ID is required');
      }

      const response = await apiClient.get(`/api/places/${placeId}`);
      const validated = PlaceDetailResponseSchema.safeParse(response.data);

      if (!validated.success) {
        throw new Error('Invalid response format');
      }

      return validated.data;
    },
    enabled: !!placeId && placeId > 0,
    staleTime: 1000 * 60 * 5, // 5분
    retry: 2,
  });
};
