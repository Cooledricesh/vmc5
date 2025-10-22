'use client';

import { Skeleton } from '@/components/ui/skeleton';

export const PlaceDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 스켈레톤 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-8 w-48" />
        </div>
      </div>

      {/* 장소 정보 영역 스켈레톤 */}
      <div className="container mx-auto max-w-3xl px-4 py-6 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96" />
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-2 pt-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        {/* 리뷰 카드 스켈레톤 3개 */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
};
