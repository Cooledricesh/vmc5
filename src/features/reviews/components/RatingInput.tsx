'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
}

export const RatingInput = ({
  value,
  onChange,
  error,
  disabled,
}: RatingInputProps) => {
  const handleStarClick = (starIndex: number, isHalf: boolean) => {
    if (disabled) return;
    const rating = starIndex + (isHalf ? 0.5 : 1);
    onChange(rating);
  };

  const getStarFillState = (starIndex: number): 'full' | 'half' | 'empty' => {
    const starValue = starIndex + 1;
    if (value >= starValue) return 'full';
    if (value >= starValue - 0.5) return 'half';
    return 'empty';
  };

  const renderStar = (index: number) => {
    const fillState = getStarFillState(index);

    return (
      <div
        key={index}
        className={cn(
          'relative p-1 transition-transform hover:scale-110',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        {/* 왼쪽 반 (0.5점) */}
        <button
          type="button"
          onClick={() => handleStarClick(index, true)}
          disabled={disabled}
          className="absolute left-0 top-0 h-full w-1/2 z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-l"
          aria-label={`${index + 0.5}점`}
        />
        {/* 오른쪽 반 (1.0점) */}
        <button
          type="button"
          onClick={() => handleStarClick(index, false)}
          disabled={disabled}
          className="absolute right-0 top-0 h-full w-1/2 z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-r"
          aria-label={`${index + 1}점`}
        />

        {/* 별 아이콘 렌더링 */}
        <div className="relative pointer-events-none">
          {fillState === 'full' && (
            <Star className="h-8 w-8 fill-yellow-400 stroke-yellow-400 transition-colors" />
          )}
          {fillState === 'half' && (
            <div className="relative h-8 w-8">
              {/* 빈 별 (배경) */}
              <Star className="absolute inset-0 fill-gray-200 stroke-gray-300" />
              {/* 반만 채워진 별 (오버레이, clip-path 사용) */}
              <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }}>
                <Star className="h-8 w-8 fill-yellow-400 stroke-yellow-400" />
              </div>
            </div>
          )}
          {fillState === 'empty' && (
            <Star className="h-8 w-8 fill-gray-200 stroke-gray-300 transition-colors" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        별점 <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => renderStar(index))}
        <span className="ml-2 text-lg font-semibold text-gray-900">
          {value.toFixed(1)}
        </span>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
