'use client';

import { memo } from 'react';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchResultItem } from './SearchResultItem';
import type { SearchPlacesResponse, SearchPlaceItem } from '../lib/dto';

/**
 * SearchResultsList Props
 */
interface SearchResultsListProps {
  data: SearchPlacesResponse | undefined;
  isLoading: boolean;
  error: unknown;
  onItemClick: (item: SearchPlaceItem) => void;
  onRetry: () => void;
}

/**
 * 검색 결과 목록 컴포넌트
 * 로딩, 에러, 빈 결과, 성공 상태를 모두 처리합니다.
 *
 * @example
 * ```tsx
 * <SearchResultsList
 *   data={data}
 *   isLoading={isLoading}
 *   error={error}
 *   onItemClick={(item) => console.log('selected:', item)}
 *   onRetry={() => refetch()}
 * />
 * ```
 */
export const SearchResultsList = memo(
  ({
    data,
    isLoading,
    error,
    onItemClick,
    onRetry,
  }: SearchResultsListProps) => {
    // 로딩 중
    if (isLoading) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      );
    }

    // 에러
    if (error) {
      const errorMessage =
        error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.';
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            검색 중 오류가 발생했습니다
          </h3>
          <p className="mb-4 text-sm text-gray-600">{errorMessage}</p>
          <button
            onClick={onRetry}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      );
    }

    // 빈 결과
    if (!data || data.items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-gray-600">검색 결과가 없습니다</p>
        </div>
      );
    }

    // 성공 - 결과 목록
    return (
      <div className="space-y-2">
        {data.items.map((item) => (
          <SearchResultItem
            key={item.naver_place_id}
            item={item}
            onClick={() => onItemClick(item)}
          />
        ))}
      </div>
    );
  }
);
