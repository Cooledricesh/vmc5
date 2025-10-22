'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePlaceDetail } from '@/features/place-detail/hooks/usePlaceDetail';
import { usePlaceReviews } from '@/features/place-detail/hooks/usePlaceReviews';
import { PlaceDetailHeader } from '@/features/place-detail/components/PlaceDetailHeader';
import { PlaceInfoSection } from '@/features/place-detail/components/PlaceInfoSection';
import { ReviewList } from '@/features/place-detail/components/ReviewList';
import { WriteReviewFAB } from '@/features/place-detail/components/WriteReviewFAB';
import { PlaceDetailSkeleton } from '@/features/place-detail/components/PlaceDetailSkeleton';
import { PLACE_DETAIL_MESSAGES, REDIRECT_DELAY_MS } from '@/features/place-detail/constants/place-detail.constants';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSelectedPlace } from '@/features/map/stores/selected-place-store';

export default function PlaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { setSelectedPlace } = useSelectedPlace();
  const placeId = parseInt(params.id as string, 10);

  // placeId 유효성 검사
  const isInvalidPlaceId = isNaN(placeId) || placeId <= 0;

  useEffect(() => {
    if (isInvalidPlaceId) {
      const timer = setTimeout(() => {
        router.push('/');
      }, REDIRECT_DELAY_MS);

      return () => clearTimeout(timer);
    }
  }, [isInvalidPlaceId, router]);

  const {
    data: place,
    isLoading: isPlaceLoading,
    error: placeError,
  } = usePlaceDetail(isInvalidPlaceId ? null : placeId);

  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    error: reviewsError,
  } = usePlaceReviews(isInvalidPlaceId ? null : placeId);

  // 잘못된 placeId 처리
  if (isInvalidPlaceId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>잘못된 접근</AlertTitle>
          <AlertDescription>
            {PLACE_DETAIL_MESSAGES.INVALID_ACCESS}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 로딩 중
  if (isPlaceLoading || isReviewsLoading) {
    return <PlaceDetailSkeleton />;
  }

  // 장소 에러 (404 등)
  if (placeError || !place) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>
              {PLACE_DETAIL_MESSAGES.PLACE_NOT_FOUND}
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push('/')} className="w-full">
            메인으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  // 리뷰 에러 (선택적)
  if (reviewsError) {
    console.error('Failed to fetch reviews:', reviewsError);
  }

  const handleBack = () => router.push('/');

  const handleEdit = (reviewId: number) => {
    // UC-005: 리뷰 수정 다이얼로그 열기 (향후 구현)
    console.log('Edit review:', reviewId);
    alert('리뷰 수정 기능은 준비 중입니다.');
  };

  const handleDelete = (reviewId: number) => {
    // UC-006: 리뷰 삭제 다이얼로그 열기 (향후 구현)
    console.log('Delete review:', reviewId);
    alert('리뷰 삭제 기능은 준비 중입니다.');
  };

  const handleWriteReview = () => {
    if (!place) return;

    // 장소 정보를 selectedPlace store에 저장
    setSelectedPlace({
      title: place.name,
      address: place.address,
      category: place.category || '',
      latitude: place.latitude,
      longitude: place.longitude,
      naver_place_id: place.naver_place_id,
    });

    router.push('/reviews/new');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <PlaceDetailHeader placeName={place.name} onBack={handleBack} />
      <div className="container mx-auto max-w-3xl px-4 py-6 space-y-6">
        <PlaceInfoSection place={place} />
        <ReviewList
          reviews={reviewsData?.reviews || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onWriteReview={handleWriteReview}
        />
      </div>
      <WriteReviewFAB onClick={handleWriteReview} />
    </main>
  );
}
