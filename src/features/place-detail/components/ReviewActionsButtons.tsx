'use client';

import { Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewActionsButtonsProps {
  reviewId: number;
  onEdit: (reviewId: number) => void;
  onDelete: (reviewId: number) => void;
}

export const ReviewActionsButtons = ({
  reviewId,
  onEdit,
  onDelete,
}: ReviewActionsButtonsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(reviewId)}
        aria-label="리뷰 수정"
        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(reviewId)}
        aria-label="리뷰 삭제"
        className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
