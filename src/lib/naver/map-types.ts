// 네이버 지도 SDK 타입 정의
export interface NaverMap {
  setCenter(latLng: NaverLatLng): void;
  setZoom(level: number, animate?: boolean): void;
}

export interface NaverLatLng {
  lat(): number;
  lng(): number;
}

export interface NaverMarker {
  setMap(map: NaverMap | null): void;
  setPosition(latLng: NaverLatLng): void;
}

declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (element: HTMLElement, options: any) => NaverMap;
        LatLng: new (lat: number, lng: number) => NaverLatLng;
        Marker: new (options: any) => NaverMarker;
        Event: {
          addListener(instance: any, eventName: string, handler: () => void): void;
        };
      };
    };
    navermap_authFailure?: () => void;
  }
}

export {};
