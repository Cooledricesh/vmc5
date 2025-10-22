import axios from 'axios';
import { failure, success, type HandlerResult } from '@/backend/http/response';
import {
  NaverSearchItemSchema,
  type SearchPlacesResponse,
  type SearchPlacesQuery,
} from './schema';
import { searchErrorCodes, type SearchServiceError } from './error';

// 좌표 변환 (네이버 카텍 좌표 -> 위경도)
const convertCoordinates = (mapx: string, mapy: string) => {
  const x = parseFloat(mapx);
  const y = parseFloat(mapy);
  return {
    longitude: x / 10000000,
    latitude: y / 10000000,
  };
};

// Place ID 추출 (link 필드에서)
const extractPlaceId = (link: string): string => {
  const match = link.match(/place\/(\d+)/);
  return match ? match[1] : `${link}_fallback`;
};

// HTML 태그 제거
const stripHtml = (text: string): string => {
  return text.replace(/<[^>]*>/g, '');
};

export const searchPlaces = async (
  query: SearchPlacesQuery,
  clientId: string,
  clientSecret: string
): Promise<HandlerResult<SearchPlacesResponse, SearchServiceError, unknown>> => {
  try {
    const response = await axios.get(
      'https://openapi.naver.com/v1/search/local.json',
      {
        params: {
          query: query.query,
          display: 5,
        },
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
        timeout: 5000,
      }
    );

    const { items } = response.data;

    const transformedItems = [];
    for (const item of items ?? []) {
      const parsed = NaverSearchItemSchema.safeParse(item);
      if (!parsed.success) {
        continue;
      }

      const { latitude, longitude } = convertCoordinates(
        parsed.data.mapx,
        parsed.data.mapy
      );

      // 좌표가 유효한지 확인
      if (latitude === 0 || longitude === 0) {
        continue;
      }

      transformedItems.push({
        title: stripHtml(parsed.data.title),
        address: stripHtml(parsed.data.address),
        category: parsed.data.category,
        latitude,
        longitude,
        naver_place_id: extractPlaceId(parsed.data.link),
      });
    }

    return success({ items: transformedItems });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        return failure(
          429,
          searchErrorCodes.rateLimitExceeded,
          'Rate limit exceeded'
        );
      }
      return failure(
        502,
        searchErrorCodes.naverApiFailed,
        error.message
      );
    }
    return failure(
      500,
      searchErrorCodes.naverApiFailed,
      'Unknown error occurred'
    );
  }
};
