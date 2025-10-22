'use client';

import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { SearchPlaceItem } from '../lib/dto';
import { memo } from 'react';

interface SearchResultItemProps {
  item: SearchPlaceItem;
  onClick: () => void;
}

/**
 * 검색 결과 개별 항목 컴포넌트
 *
 * @example
 * ```tsx
 * <SearchResultItem
 *   item={{
 *     naver_place_id: '123',
 *     title: '맛집',
 *     address: '서울시 강남구',
 *     category: '음식점',
 *     latitude: 37.123,
 *     longitude: 127.123,
 *   }}
 *   onClick={() => console.log('clicked')}
 * />
 * ```
 */
export const SearchResultItem = memo(
  ({ item, onClick }: SearchResultItemProps) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    };

    return (
      <button
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className="w-full rounded-lg border border-gray-200 p-4 text-left transition-all hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        role="button"
        aria-label={`${item.title} 선택`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{item.title}</h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{item.address}</span>
            </div>
          </div>
          <Badge variant="secondary" className="ml-2">
            {item.category}
          </Badge>
        </div>
      </button>
    );
  }
);
