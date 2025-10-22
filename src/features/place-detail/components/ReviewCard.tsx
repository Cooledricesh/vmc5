'use client';

import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { AverageRating } from './AverageRating';
import { ReviewActionsButtons } from './ReviewActionsButtons';
import type { ReviewResponse } from '../lib/dto';

interface ReviewCardProps {
  review: ReviewResponse;
  onEdit: (reviewId: number) => void;
  onDelete: (reviewId: number) => void;
}

export const ReviewCard = ({ review, onEdit, onDelete }: ReviewCardProps) => {
  const relativeTime = formatDistanceToNow(new Date(review.created_at), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-3 border border-gray-200">
      {/* 닉네임과 액션 버튼 */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{review.nickname}</h3>
        <ReviewActionsButtons
          reviewId={review.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      {/* 별점 */}
      <div>
        <AverageRating rating={review.rating} showNumber={false} size="sm" />
      </div>

      {/* 리뷰 텍스트 (있는 경우) */}
      {review.review_text && (
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {review.review_text}
        </p>
      )}

      {/* 작성일시 */}
      <p className="text-xs text-gray-500">{relativeTime}</p>
    </div>
  );
};
