'use client';

import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyReviewStateProps {
  onWriteReview: () => void;
}

export const EmptyReviewState = ({ onWriteReview }: EmptyReviewStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-4">
      <div className="rounded-full bg-gray-100 p-6">
        <MessageSquare className="h-12 w-12 text-gray-400" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-gray-900">
          아직 작성된 리뷰가 없습니다
        </p>
        <p className="text-sm text-gray-500">
          첫 리뷰를 작성해보세요!
        </p>
      </div>
      <Button onClick={onWriteReview} size="lg" className="mt-4">
        리뷰 작성하기
      </Button>
    </div>
  );
};
