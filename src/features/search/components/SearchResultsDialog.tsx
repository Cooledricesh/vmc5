'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useSearchPlaces } from '../hooks/useSearchPlaces';
import { SearchErrorBoundary } from './SearchErrorBoundary';
import { SearchResultsList } from './SearchResultsList';
import type { SearchPlaceItem } from '../lib/dto';

/**
 * SearchResultsDialog Props
 */
interface SearchResultsDialogProps {
  open: boolean;
  query: string;
  onOpenChange: (open: boolean) => void;
  onPlaceSelect: (place: SearchPlaceItem) => void;
}

/**
 * 검색 결과를 표시하는 Dialog/Sheet 컴포넌트
 * Desktop에서는 Dialog, Mobile에서는 Sheet로 표시됩니다.
 *
 * @example
 * ```tsx
 * <SearchResultsDialog
 *   open={isOpen}
 *   query="맛집"
 *   onOpenChange={setIsOpen}
 *   onPlaceSelect={(place) => {
 *     console.log('selected:', place);
 *     setIsOpen(false);
 *   }}
 * />
 * ```
 */
export const SearchResultsDialog = ({
  open,
  query,
  onOpenChange,
  onPlaceSelect,
}: SearchResultsDialogProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { data, isLoading, error, refetch } = useSearchPlaces(query, open);

  // Mobile: Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>검색 결과</SheetTitle>
            <SheetDescription>
              &quot;{query}&quot; 검색 결과입니다
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <SearchErrorBoundary>
              <SearchResultsList
                data={data}
                isLoading={isLoading}
                error={error}
                onItemClick={onPlaceSelect}
                onRetry={refetch}
              />
            </SearchErrorBoundary>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>검색 결과</DialogTitle>
          <DialogDescription>
            &quot;{query}&quot; 검색 결과입니다
          </DialogDescription>
        </DialogHeader>
        <SearchErrorBoundary>
          <SearchResultsList
            data={data}
            isLoading={isLoading}
            error={error}
            onItemClick={onPlaceSelect}
            onRetry={refetch}
          />
        </SearchErrorBoundary>
      </DialogContent>
    </Dialog>
  );
};
