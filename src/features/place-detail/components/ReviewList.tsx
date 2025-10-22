'use client';

import { ReviewCard } from './ReviewCard';
import { EmptyReviewState } from './EmptyReviewState';
import type { ReviewResponse } from '../lib/dto';

interface ReviewListProps {
  reviews: ReviewResponse[];
  onEdit: (reviewId: number) => void;
  onDelete: (reviewId: number) => void;
  onWriteReview: () => void;
}

export const ReviewList = ({
  reviews,
  onEdit,
  onDelete,
  onWriteReview,
}: ReviewListProps) => {
  if (reviews.length === 0) {
    return <EmptyReviewState onWriteReview={onWriteReview} />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        리뷰 ({reviews.length})
      </h2>
      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};
