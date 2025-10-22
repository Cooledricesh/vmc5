'use client';

import { MapPin, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SelectedPlace } from '@/features/map/stores/selected-place-store';

interface PlaceInfoCardProps {
  place: SelectedPlace;
}

export const PlaceInfoCard = ({ place }: PlaceInfoCardProps) => {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900">
          리뷰를 작성할 장소
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{place.title}</h3>
        </div>
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{place.address}</span>
        </div>
        {place.category && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Tag className="h-4 w-4 flex-shrink-0" />
            <span>{place.category}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
