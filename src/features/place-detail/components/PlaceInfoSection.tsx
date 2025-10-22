'use client';

import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AverageRating } from './AverageRating';
import type { PlaceDetailResponse } from '../lib/dto';

interface PlaceInfoSectionProps {
  place: PlaceDetailResponse;
}

export const PlaceInfoSection = ({ place }: PlaceInfoSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      {/* 장소명 */}
      <h2 className="text-2xl font-bold text-gray-900">{place.name}</h2>

      {/* 주소 */}
      <div className="flex items-start gap-2 text-gray-600">
        <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <p className="text-sm">{place.address}</p>
      </div>

      {/* 카테고리 뱃지 */}
      {place.category && (
        <div>
          <Badge variant="secondary">{place.category}</Badge>
        </div>
      )}

      {/* 평균 별점 및 리뷰 개수 */}
      <div className="pt-2 border-t border-gray-200">
        {place.avg_rating !== null && place.review_count > 0 ? (
          <div className="flex items-center gap-3">
            <AverageRating rating={place.avg_rating} showNumber size="md" />
            <span className="text-sm text-gray-500">
              ({place.review_count}개의 리뷰)
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-500">아직 별점이 없습니다</p>
        )}
      </div>
    </div>
  );
};
