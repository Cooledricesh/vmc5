'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useNaverMap } from '../hooks/useNaverMap';
import { usePlacesWithReviews } from '../hooks/usePlacesWithReviews';
import { useMapMarkers } from '../hooks/useMapMarkers';
import { MapSearchBar } from './MapSearchBar';
import type { PlaceRow } from '@/features/places/lib/dto';

export const NaverMap = () => {
  const router = useRouter();

  const { mapRef, map, isLoading: isMapLoading, error: mapError } = useNaverMap({
    onAuthFailed: () => {
      alert('지도를 불러올 수 없습니다. 관리자에게 문의하세요.');
    },
  });

  const {
    data: placesData,
    isLoading: isPlacesLoading,
    error: placesError,
  } = usePlacesWithReviews();

  const handleMarkerClick = useCallback(
    (place: PlaceRow) => {
      router.push(`/places/${place.id}`);
    },
    [router]
  );

  useMapMarkers({
    map,
    places: placesData?.places ?? [],
    onMarkerClick: handleMarkerClick,
  });

  if (isMapLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">지도를 불러오는 중...</div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-600">
          지도 로딩 실패: {mapError}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 rounded bg-blue-500 px-4 py-2 text-white"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      <div ref={mapRef} className="h-full w-full" />

      <MapSearchBar map={map} />

      {placesError && (
        <div className="absolute bottom-4 left-4 rounded bg-red-100 p-4 text-red-700">
          리뷰 정보를 불러오는 데 실패했습니다.
        </div>
      )}
    </div>
  );
};
