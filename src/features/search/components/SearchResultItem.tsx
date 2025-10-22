'use client';

import type { SearchPlaceItem } from '../lib/dto';

interface SearchResultItemProps {
  item: SearchPlaceItem;
  onClick: () => void;
}

export const SearchResultItem = ({ item, onClick }: SearchResultItemProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded border border-gray-200 p-4 text-left hover:bg-gray-50"
    >
      <h3 className="font-bold text-gray-900">{item.title}</h3>
      <p className="text-sm text-gray-600">{item.address}</p>
      <p className="text-xs text-gray-400">{item.category}</p>
    </button>
  );
};
