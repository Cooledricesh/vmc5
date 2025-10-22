'use client';

import { useState, useRef } from 'react';
import { SearchResultsDialog } from '@/features/search/components/SearchResultsDialog';
import { useSelectedPlace } from '../stores/selected-place-store';
import { useMapMarkerActions } from '../hooks/useMapMarkerActions';
import type { NaverMap } from '@/lib/naver/map-types';
import type { SearchPlaceItem } from '@/features/search/lib/dto';

interface MapSearchBarProps {
  map: NaverMap | null;
}

/**
 * 지도 검색 바 컴포넌트
 * 장소를 검색하고 선택된 장소를 지도에 표시합니다.
 *
 * @example
 * ```tsx
 * <MapSearchBar map={map} />
 * ```
 */
export const MapSearchBar = ({ map }: MapSearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setSelectedPlace } = useSelectedPlace();
  const { moveToPlace } = useMapMarkerActions({ map });

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    // Dialog가 열릴 때 input 포커스 제거 (aria-hidden 경고 방지)
    inputRef.current?.blur();
    setIsModalOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한글 입력 중(조합 중)일 때는 Enter 키 무시
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handlePlaceSelect = (place: SearchPlaceItem) => {
    setIsModalOpen(false);
    setSelectedPlace(place);
    moveToPlace(place);
  };

  return (
    <>
      <div className="absolute left-1/2 top-4 z-10 w-full max-w-md -translate-x-1/2">
        <div className="rounded-lg bg-white/90 p-4 shadow-lg backdrop-blur">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="맛집을 검색해보세요"
              className="flex-1 rounded border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={!query.trim()}
              className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              검색
            </button>
          </div>
        </div>
      </div>

      <SearchResultsDialog
        open={isModalOpen}
        query={query}
        onOpenChange={setIsModalOpen}
        onPlaceSelect={handlePlaceSelect}
      />
    </>
  );
};
