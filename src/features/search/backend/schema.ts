import { z } from 'zod';

// 요청 스키마
export const SearchPlacesQuerySchema = z.object({
  query: z.string().min(1, 'Search query is required'),
});

// 네이버 API 응답 항목 스키마
export const NaverSearchItemSchema = z.object({
  title: z.string(),
  address: z.string(),
  category: z.string(),
  mapx: z.string(),
  mapy: z.string(),
  link: z.string(),
});

// 변환된 응답 스키마
export const SearchPlaceItemSchema = z.object({
  title: z.string(),
  address: z.string(),
  category: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  naver_place_id: z.string(),
});

export const SearchPlacesResponseSchema = z.object({
  items: z.array(SearchPlaceItemSchema),
});

export type SearchPlacesQuery = z.infer<typeof SearchPlacesQuerySchema>;
export type SearchPlaceItem = z.infer<typeof SearchPlaceItemSchema>;
export type SearchPlacesResponse = z.infer<typeof SearchPlacesResponseSchema>;
