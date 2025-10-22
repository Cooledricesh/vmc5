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
    const initMap = async () => {
      try {
        if (onAuthFailed) {
          setMapAuthFailureHandler(onAuthFailed);
        }

        await loadNaverMapSdk();

        if (mapRef.current) {
          const mapInstance = new window.naver.maps.Map(mapRef.current, {
            center: new window.naver.maps.LatLng(center.lat, center.lng),
            zoom,
          });

          setMap(mapInstance);
          setIsLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load map');
        setIsLoading(false);
      }
    };

    initMap();
  }, []);

  return { mapRef, map, isLoading, error };
};
