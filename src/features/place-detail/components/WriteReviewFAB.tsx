'use client';

import { Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WriteReviewFABProps {
  onClick: () => void;
}

export const WriteReviewFAB = ({ onClick }: WriteReviewFABProps) => {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 h-14 w-14 p-0"
      aria-label="리뷰 작성"
    >
      <Pen className="h-6 w-6" />
    </Button>
  );
};
