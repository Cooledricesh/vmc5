'use client';

import { useSearchPlaces } from '../hooks/useSearchPlaces';
import { SearchResultItem } from './SearchResultItem';
import type { SearchPlaceItem } from '../lib/dto';

interface SearchResultsModalProps {
  isOpen: boolean;
  query: string;
  onClose: () => void;
  onPlaceSelect: (place: SearchPlaceItem) => void;
}

export const SearchResultsModal = ({
  isOpen,
  query,
  onClose,
  onPlaceSelect,
}: SearchResultsModalProps) => {
  const { data, isLoading, error } = useSearchPlaces(query, isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">검색 결과</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {isLoading && <div className="text-center">검색 중...</div>}

        {error && (
          <div className="rounded bg-red-100 p-4 text-red-700">
            검색 서비스가 일시적으로 불가합니다. 잠시 후 다시 시도해주세요.
          </div>
        )}

        {data && data.items.length === 0 && (
          <div className="text-center text-gray-500">
            검색 결과가 없습니다.
          </div>
        )}

        {data && data.items.length > 0 && (
          <div className="space-y-2">
            {data.items.map((item, index) => (
              <SearchResultItem
                key={index}
                item={item}
                onClick={() => onPlaceSelect(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
