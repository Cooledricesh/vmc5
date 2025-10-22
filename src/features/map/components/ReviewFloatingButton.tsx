'use client';

import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ReviewFloatingButton Props
 */
interface ReviewFloatingButtonProps {
  visible: boolean;
  onReviewWrite: () => void;
}

/**
 * 리뷰 작성 플로팅 액션 버튼 (FAB)
 * 장소 선택 후 화면 우측 하단에 표시됩니다.
 *
 * @example
 * ```tsx
 * <ReviewFloatingButton
 *   visible={!!selectedPlace}
 *   onReviewWrite={() => router.push('/reviews/new')}
 * />
 * ```
 */
export const ReviewFloatingButton = ({
  visible,
  onReviewWrite,
}: ReviewFloatingButtonProps) => {
  return (
    <button
      className={cn(
        'fixed bottom-6 right-6 z-40 flex h-14 items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl',
        visible
          ? 'scale-100 opacity-100'
          : 'pointer-events-none scale-0 opacity-0'
      )}
      onClick={onReviewWrite}
      aria-label="리뷰 작성"
    >
      <Pencil className="h-5 w-5" />
      <span className="font-medium">리뷰 작성</span>
    </button>
  );
};
