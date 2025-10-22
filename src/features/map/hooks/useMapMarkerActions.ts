'use client';

import { useState, useCallback } from 'react';
import type { NaverMap } from '@/lib/naver/map-types';
import type { SelectedPlace } from '../stores/selected-place-store';

/**
 * HTML escape 유틸리티 함수 (XSS 방지)
 */
const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * 지도 마커 액션 옵션
 */
interface MapMarkerActionsOptions {
  map: NaverMap | null;
}

/**
 * 지도 마커 액션 반환 타입
 */
interface MapMarkerActions {
  moveToPlace: (place: SelectedPlace) => void;
  clearSelectedMarker: () => void;
  selectedMarker: any | null;
  infoWindow: any | null;
}

/**
 * 선택된 장소로 지도 이동, 마커 생성, 인포윈도우 표시를 통합 관리하는 Hook
 *
 * @example
 * ```tsx
 * const { moveToPlace, clearSelectedMarker, selectedMarker, infoWindow } = useMapMarkerActions({ map });
 *
 * // 장소로 이동하고 마커 표시
 * moveToPlace({
 *   naver_place_id: '123',
 *   title: '맛집',
 *   address: '서울시 강남구',
 *   category: '음식점',
 *   latitude: 37.123,
 *   longitude: 127.123,
 * });
 *
 * // 마커 제거
 * clearSelectedMarker();
 * ```
 */
export const useMapMarkerActions = ({
  map,
}: MapMarkerActionsOptions): MapMarkerActions => {
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);
  const [infoWindow, setInfoWindow] = useState<any | null>(null);

  /**
   * 이전 마커와 인포윈도우 제거
   */
  const clearSelectedMarker = useCallback(() => {
    if (selectedMarker) {
      selectedMarker.setMap(null);
      setSelectedMarker(null);
    }
    if (infoWindow) {
      infoWindow.close();
      setInfoWindow(null);
    }
  }, [selectedMarker, infoWindow]);

  /**
   * 선택된 장소로 지도 이동 및 마커 표시
   */
  const moveToPlace = useCallback(
    (place: SelectedPlace) => {
      if (!map || !window.naver) {
        console.error('Map is not initialized');
        return;
      }

      if (!place.latitude || !place.longitude) {
        console.error('Invalid coordinates', place);
        return;
      }

      try {
        const position = new window.naver.maps.LatLng(
          place.latitude,
          place.longitude
        );

        // 지도 이동
        map.setCenter(position);
        map.setZoom(16, true);

        // 이전 마커/인포윈도우 제거
        clearSelectedMarker();

        // 마커 생성 (SVG 아이콘 사용)
        const marker = new window.naver.maps.Marker({
          position,
          map,
          icon: {
            content: `
              <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 32 16 32s16-20 16-32c0-8.837-7.163-16-16-16z" fill="#ef4444"/>
                <circle cx="16" cy="16" r="8" fill="white"/>
              </svg>
            `,
            anchor: new window.naver.maps.Point(16, 48),
          },
          animation: window.naver.maps.Animation.BOUNCE,
        });

        // 인포윈도우 생성 (인라인 스타일 사용, XSS 방지)
        const info = new window.naver.maps.InfoWindow({
          content: `
            <div style="padding: 12px; min-width: 200px; max-width: 280px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
              <h4 style="font-weight: bold; color: #111827; margin: 0; margin-bottom: 4px;">
                ${escapeHtml(place.title)}
              </h4>
              <p style="font-size: 14px; color: #6b7280; margin: 0;">
                ${escapeHtml(place.address)}
              </p>
            </div>
          `,
          borderWidth: 0,
          backgroundColor: 'transparent',
          anchorSize: new window.naver.maps.Size(0, 0),
          anchorSkew: true,
          pixelOffset: new window.naver.maps.Point(20, -20),
        });

        info.open(map, marker);

        setSelectedMarker(marker);
        setInfoWindow(info);
      } catch (error) {
        console.error('Failed to move to place', error);
      }
    },
    [map, clearSelectedMarker]
  );

  return {
    moveToPlace,
    clearSelectedMarker,
    selectedMarker,
    infoWindow,
  };
};
