'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AverageRatingProps {
  rating: number; // 0.0 ~ 5.0
  showNumber?: boolean; // 숫자 표시 여부
  size?: 'sm' | 'md' | 'lg';
}

const STAR_SIZES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
} as const;

export const AverageRating = ({
  rating,
  showNumber = true,
  size = 'md',
}: AverageRatingProps) => {
  const getStarFillState = (starIndex: number): 'full' | 'half' | 'empty' => {
    const starValue = starIndex + 1;
    if (rating >= starValue) return 'full';
    if (rating >= starValue - 0.5) return 'half';
    return 'empty';
  };

  const renderStar = (index: number) => {
    const fillState = getStarFillState(index);
    const starSize = STAR_SIZES[size];

    return (
      <div key={index} className="relative">
        {fillState === 'full' && (
          <Star
            className={cn(
              starSize,
              'fill-yellow-400 stroke-yellow-400 transition-colors'
            )}
          />
        )}
        {fillState === 'half' && (
          <div className={cn('relative', starSize)}>
            {/* 빈 별 (배경) */}
            <Star className={cn(starSize, 'absolute inset-0 fill-gray-200 stroke-gray-300')} />
            {/* 반만 채워진 별 (오버레이, clip-path 사용) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            >
              <Star className={cn(starSize, 'fill-yellow-400 stroke-yellow-400')} />
            </div>
          </div>
        )}
        {fillState === 'empty' && (
          <Star
            className={cn(
              starSize,
              'fill-gray-200 stroke-gray-300 transition-colors'
            )}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => renderStar(index))}
      {showNumber && (
        <span
          className={cn(
            'ml-1 font-semibold text-gray-900',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-lg'
          )}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
