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

export interface NaverPoint {
  x: number;
  y: number;
}

export interface NaverSize {
  width: number;
  height: number;
}

export interface NaverInfoWindow {
  open(map: NaverMap, marker: NaverMarker): void;
  close(): void;
}

export enum NaverAnimation {
  BOUNCE = 1,
  DROP = 2,
}

declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (element: HTMLElement, options: any) => NaverMap;
        LatLng: new (lat: number, lng: number) => NaverLatLng;
        Marker: new (options: any) => NaverMarker;
        Point: new (x: number, y: number) => NaverPoint;
        Size: new (width: number, height: number) => NaverSize;
        InfoWindow: new (options: any) => NaverInfoWindow;
        Animation: typeof NaverAnimation;
        Event: {
          addListener(instance: any, eventName: string, handler: () => void): void;
        };
      };
    };
    navermap_authFailure?: () => void;
  }
}

export {};
