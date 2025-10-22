'use client';

import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ReviewTextareaProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
}

export const ReviewTextarea = ({
  value,
  onChange,
  error,
  disabled,
  maxLength = 500,
}: ReviewTextareaProps) => {
  const currentLength = value.length;
  const isOverLimit = currentLength > maxLength;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        리뷰 (선택사항)
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="이 장소에 대한 솔직한 리뷰를 작성해주세요"
        disabled={disabled}
        rows={5}
        className={cn(
          'resize-none',
          error && 'border-red-500 focus:ring-red-500'
        )}
      />
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-sm',
            isOverLimit ? 'text-red-600 font-semibold' : 'text-gray-500'
          )}
        >
          {currentLength} / {maxLength}
        </span>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};
