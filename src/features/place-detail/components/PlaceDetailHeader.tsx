'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlaceDetailHeaderProps {
  placeName: string;
  onBack: () => void;
}

export const PlaceDetailHeader = ({
  placeName,
  onBack,
}: PlaceDetailHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto max-w-3xl px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            aria-label="뒤로가기"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 truncate">
            {placeName}
          </h1>
        </div>
      </div>
    </header>
  );
};
