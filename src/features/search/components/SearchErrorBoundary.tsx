'use client';

import React, { Component, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * SearchErrorBoundary Props
 */
interface SearchErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

/**
 * SearchErrorBoundary State
 */
interface SearchErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 검색 관련 에러를 포착하고 사용자 친화적인 메시지를 표시하는 Error Boundary
 *
 * @example
 * ```tsx
 * <SearchErrorBoundary>
 *   <SearchResultsList />
 * </SearchErrorBoundary>
 *
 * // 커스텀 fallback 사용
 * <SearchErrorBoundary
 *   fallback={(error, reset) => (
 *     <div>
 *       <p>에러: {error.message}</p>
 *       <button onClick={reset}>재시도</button>
 *     </div>
 *   )}
 * >
 *   <SearchResultsList />
 * </SearchErrorBoundary>
 * ```
 */
export class SearchErrorBoundary extends Component<
  SearchErrorBoundaryProps,
  SearchErrorBoundaryState
> {
  constructor(props: SearchErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): SearchErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('SearchErrorBoundary caught an error:', error, errorInfo);
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            검색 중 오류가 발생했습니다
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            잠시 후 다시 시도해주세요.
          </p>
          <button
            onClick={this.reset}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
