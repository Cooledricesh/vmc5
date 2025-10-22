'use client';

import { useEffect, useRef } from 'react';
import type { NaverMap, NaverMarker } from '@/lib/naver/map-types';
import type { PlaceRow } from '@/features/places/lib/dto';

interface UseMapMarkersOptions {
  map: NaverMap | null;
  places: PlaceRow[];
  onMarkerClick?: (place: PlaceRow) => void;
}

export const useMapMarkers = (options: UseMapMarkersOptions) => {
  const { map, places, onMarkerClick } = options;
  const markersRef = useRef<NaverMarker[]>([]);

  useEffect(() => {
    if (!map || !window.naver) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 새 마커 생성
    const newMarkers = places.map((place) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(place.latitude, place.longitude),
        map,
        title: place.name,
      });

      if (onMarkerClick) {
        window.naver.maps.Event.addListener(marker, 'click', () => {
          onMarkerClick(place);
        });
      }

      return marker;
    });

    markersRef.current = newMarkers;

    // 클린업
    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [map, places, onMarkerClick]);

  return { markers: markersRef.current };
};
