'use client';

import { useEffect, useRef, useState } from 'react';
import { loadNaverMapSdk, setMapAuthFailureHandler } from '@/lib/naver/map-loader';
import type { NaverMap } from '@/lib/naver/map-types';

interface UseNaverMapOptions {
  center?: { lat: number; lng: number };
  zoom?: number;
  onAuthFailed?: () => void;
}

export const useNaverMap = (options: UseNaverMapOptions = {}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<NaverMap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    center = { lat: 37.5665, lng: 126.978 },
    zoom = 13,
    onAuthFailed,
  } = options;

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      try {
        // 인증 실패 핸들러 설정
        if (onAuthFailed) {
          setMapAuthFailureHandler(onAuthFailed);
        }

        // SDK 로드 및 초기화 대기
        await loadNaverMapSdk();

        // DOM 요소가 준비될 때까지 대기 (최대 1초)
        let attempts = 0;
        const maxAttempts = 10;
        while (!mapRef.current && attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }

        // 컴포넌트가 언마운트되었는지 확인
        if (!isMounted) {
          return;
        }

        // DOM 요소 확인
        if (!mapRef.current) {
          throw new Error('Map container element not found after waiting');
        }

        // 지도 생성
        const mapInstance = new window.naver.maps.Map(mapRef.current, {
          center: new window.naver.maps.LatLng(center.lat, center.lng),
          zoom,
        });

        setMap(mapInstance);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize map:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load map');
          setIsLoading(false);
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, []);

  return { mapRef, map, isLoading, error };
};
