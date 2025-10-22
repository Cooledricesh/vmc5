'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSelectedPlace } from '@/features/map/stores/selected-place-store';
import { PlaceInfoCard } from './PlaceInfoCard';
import { RatingInput } from './RatingInput';
import { NicknameInput } from './NicknameInput';
import { PasswordInput } from './PasswordInput';
import { ReviewTextarea } from './ReviewTextarea';
import { useCreateReview } from '../hooks/useCreateReview';
import { CreateReviewDataSchema } from '../backend/schema';

type FormData = z.infer<typeof CreateReviewDataSchema>;

export const ReviewForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { selectedPlace, clearSelectedPlace } = useSelectedPlace();
  const { mutate: createReview, isPending } = useCreateReview();

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(CreateReviewDataSchema),
    defaultValues: {
      nickname: '',
      password: '',
      rating: 5.0,
      review_text: '',
    },
  });

  const formValues = watch();

  // 장소 정보가 없으면 에러
  if (!selectedPlace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            장소 정보가 없습니다
          </h2>
          <p className="text-gray-600">
            메인 페이지에서 장소를 선택한 후 리뷰를 작성해주세요.
          </p>
          <Button onClick={() => router.push('/')}>메인 페이지로 이동</Button>
        </div>
      </div>
    );
  }

  const onSubmit = (data: FormData) => {
    createReview(
      {
        place: {
          naver_place_id: selectedPlace.naver_place_id,
          name: selectedPlace.title,
          address: selectedPlace.address,
          latitude: selectedPlace.latitude,
          longitude: selectedPlace.longitude,
          category: selectedPlace.category,
        },
        review: data,
      },
      {
        onSuccess: (response) => {
          toast({
            title: '리뷰가 저장되었습니다',
            description: '장소 페이지로 이동합니다.',
          });
          clearSelectedPlace();
          router.push(response.redirectUrl);
        },
        onError: (error: Error) => {
          toast({
            title: '리뷰 저장 실패',
            description: error.message || '알 수 없는 오류가 발생했습니다.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 장소 정보 */}
      <PlaceInfoCard place={selectedPlace} />

      {/* 별점 */}
      <RatingInput
        value={formValues.rating}
        onChange={(value) => setValue('rating', value)}
        error={errors.rating?.message}
        disabled={isPending}
      />

      {/* 닉네임 */}
      <NicknameInput
        value={formValues.nickname}
        onChange={(value) => setValue('nickname', value)}
        error={errors.nickname?.message}
        disabled={isPending}
      />

      {/* 비밀번호 */}
      <PasswordInput
        value={formValues.password}
        onChange={(value) => setValue('password', value)}
        error={errors.password?.message}
        disabled={isPending}
      />

      {/* 리뷰 텍스트 */}
      <ReviewTextarea
        value={formValues.review_text || ''}
        onChange={(value) => setValue('review_text', value)}
        error={errors.review_text?.message}
        disabled={isPending}
      />

      {/* 저장 버튼 */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
          className="flex-1"
        >
          취소
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? '저장 중...' : '리뷰 저장'}
        </Button>
      </div>
    </form>
  );
};
