'use client';

import { useEffect, useState } from 'react';
import type { NaverMap, NaverMarker } from '@/lib/naver/map-types';
import type { PlaceRow } from '@/features/places/lib/dto';

interface UseMapMarkersOptions {
  map: NaverMap | null;
  places: PlaceRow[];
  onMarkerClick?: (place: PlaceRow) => void;
}

export const useMapMarkers = (options: UseMapMarkersOptions) => {
  const { map, places, onMarkerClick } = options;
  const [markers, setMarkers] = useState<NaverMarker[]>([]);

  useEffect(() => {
    if (!map || !window.naver) return;

    markers.forEach((marker) => marker.setMap(null));

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

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [map, places, onMarkerClick]);

  return { markers };
};
