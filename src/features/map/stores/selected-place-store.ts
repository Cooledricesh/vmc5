'use client';

import { create } from 'zustand';
import type { SearchPlaceItem } from '@/features/search/lib/dto';

/**
 * 선택된 장소 정보
 * SearchPlaceItem과 동일한 타입
 */
export type SelectedPlace = SearchPlaceItem;

/**
 * 선택된 장소 상태 관리 Store
 */
interface SelectedPlaceStore {
  selectedPlace: SelectedPlace | null;
  setSelectedPlace: (place: SelectedPlace) => void;
  clearSelectedPlace: () => void;
}

/**
 * 선택된 장소를 전역으로 관리하는 zustand store
 *
 * @example
 * ```tsx
 * const { selectedPlace, setSelectedPlace, clearSelectedPlace } = useSelectedPlace();
 *
 * // 장소 선택
 * setSelectedPlace({
 *   naver_place_id: '123',
 *   title: '맛집',
 *   address: '서울시 강남구',
 *   category: '음식점',
 *   latitude: 37.123,
 *   longitude: 127.123,
 * });
 *
 * // 선택 해제
 * clearSelectedPlace();
 * ```
 */
export const useSelectedPlace = create<SelectedPlaceStore>((set) => ({
  selectedPlace: null,
  setSelectedPlace: (place: SelectedPlace) => set({ selectedPlace: place }),
  clearSelectedPlace: () => set({ selectedPlace: null }),
}));
