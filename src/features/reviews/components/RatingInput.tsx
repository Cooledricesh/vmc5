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
    const starId = `star-gradient-${index}`;

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
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id={starId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="50%" stopColor="#facc15" />
                    <stop offset="50%" stopColor="#e5e7eb" />
                  </linearGradient>
                </defs>
                <path
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  fill={`url(#${starId})`}
                  stroke="#facc15"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
