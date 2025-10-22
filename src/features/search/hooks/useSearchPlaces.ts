'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/remote/api-client';
import { SearchPlacesResponseSchema } from '@/features/search/lib/dto';

export const useSearchPlaces = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['search', 'places', query],
    queryFn: async () => {
      const response = await apiClient.get('/api/search/places', {
        params: { query },
      });

      const parsed = SearchPlacesResponseSchema.safeParse(response.data);

      if (!parsed.success) {
        throw new Error('Invalid response format');
      }

      return parsed.data;
    },
    enabled: enabled && query.trim().length > 0,
    retry: 2,
    staleTime: 2 * 60 * 1000,
  });
};
