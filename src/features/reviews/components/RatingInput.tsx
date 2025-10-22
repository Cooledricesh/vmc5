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
  const handleStarClick = (rating: number) => {
    if (disabled) return;
    onChange(rating);
  };

  const renderStar = (index: number) => {
    const rating = (index + 1) * 0.5; // 0.5, 1.0, 1.5, ..., 5.0
    const isFilled = value >= rating;

    return (
      <button
        key={index}
        type="button"
        onClick={() => handleStarClick(rating)}
        disabled={disabled}
        className={cn(
          'p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        aria-label={`${rating}점`}
      >
        <Star
          className={cn(
            'h-8 w-8 transition-colors',
            isFilled && 'fill-yellow-400 stroke-yellow-400',
            !isFilled && 'fill-gray-200 stroke-gray-300'
          )}
        />
      </button>
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        별점 <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-1">
        {Array.from({ length: 10 }).map((_, index) => renderStar(index))}
        <span className="ml-2 text-lg font-semibold text-gray-900">
          {value.toFixed(1)}
        </span>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
