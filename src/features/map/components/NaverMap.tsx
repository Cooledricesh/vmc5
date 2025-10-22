'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useNaverMap } from '../hooks/useNaverMap';
import { usePlacesWithReviews } from '../hooks/usePlacesWithReviews';
import { useMapMarkers } from '../hooks/useMapMarkers';
import { useSelectedPlace } from '../stores/selected-place-store';
import { MapSearchBar } from './MapSearchBar';
import { ReviewFloatingButton } from './ReviewFloatingButton';
import type { PlaceRow } from '@/features/places/lib/dto';

export const NaverMap = () => {
  const router = useRouter();
  const { selectedPlace } = useSelectedPlace();

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

  // useCallback으로 함수 메모이제이션
  const handleMarkerClick = useCallback(
    (place: PlaceRow) => {
      router.push(`/places/${place.id}`);
    },
    [router]
  );

  const handleReviewWrite = useCallback(() => {
    if (selectedPlace) {
      // 장소 정보는 이미 useSelectedPlace store에 저장되어 있으므로
      // 리뷰 작성 페이지에서 해당 store를 읽어서 사용
      router.push('/reviews/new');
    }
  }, [selectedPlace, router]);

  useMapMarkers({
    map,
    places: placesData?.places ?? [],
    onMarkerClick: handleMarkerClick,
  });

  return (
    <div className="relative h-screen w-full">
      {/* 지도 컨테이너 - 항상 렌더링 */}
      <div ref={mapRef} className="h-full w-full" />

      {/* 로딩 오버레이 */}
      {isMapLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white">
          <div className="text-lg">지도를 불러오는 중...</div>
        </div>
      )}

      {/* 에러 오버레이 */}
      {mapError && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white">
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
      )}

      {/* 검색창 - 지도 로딩 완료 후 표시 */}
      {!isMapLoading && !mapError && <MapSearchBar map={map} />}

      {/* 리뷰 작성 버튼 - 장소가 선택된 경우만 표시 */}
      <ReviewFloatingButton
        visible={!!selectedPlace}
        onReviewWrite={handleReviewWrite}
      />

      {/* 리뷰 로딩 에러 */}
      {placesError && (
        <div className="absolute bottom-4 left-4 rounded bg-red-100 p-4 text-red-700">
          리뷰 정보를 불러오는 데 실패했습니다.
        </div>
      )}
    </div>
  );
};
