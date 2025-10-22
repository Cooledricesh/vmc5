'use client';

import { ReviewForm } from '@/features/reviews/components/ReviewForm';

export default function ReviewWritePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">리뷰 작성</h1>
          <p className="mt-2 text-gray-600">
            방문하신 장소에 대한 솔직한 리뷰를 작성해주세요.
          </p>
        </div>
        <ReviewForm />
      </div>
    </main>
  );
}
