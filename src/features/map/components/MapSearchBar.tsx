'use client';

import { useState } from 'react';
import { SearchResultsModal } from '@/features/search/components/SearchResultsModal';
import type { NaverMap } from '@/lib/naver/map-types';
import type { SearchPlaceItem } from '@/features/search/lib/dto';

interface MapSearchBarProps {
  map: NaverMap | null;
}

export const MapSearchBar = ({ map }: MapSearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      setIsModalOpen(true);
    }
  };

  const handlePlaceSelect = (place: SearchPlaceItem) => {
    setIsModalOpen(false);

    if (map && window.naver) {
      const position = new window.naver.maps.LatLng(place.latitude, place.longitude);
      map.setCenter(position);
      map.setZoom(16, true);
    }
  };

  return (
    <>
      <div className="absolute left-1/2 top-4 z-10 w-full max-w-md -translate-x-1/2 rounded-lg bg-white/90 p-4 shadow-lg backdrop-blur">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="맛집을 검색해보세요"
            className="flex-1 rounded border border-gray-300 px-4 py-2"
          />
          <button
            onClick={handleSearch}
            className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            검색
          </button>
        </div>
      </div>

      <SearchResultsModal
        isOpen={isModalOpen}
        query={query}
        onClose={() => setIsModalOpen(false)}
        onPlaceSelect={handlePlaceSelect}
      />
    </>
  );
};
