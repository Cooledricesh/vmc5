import { Hono } from 'hono';
import { errorBoundary } from '@/backend/middleware/error';
import { withAppContext } from '@/backend/middleware/context';
import { withSupabase } from '@/backend/middleware/supabase';
import { registerExampleRoutes } from '@/features/example/backend/route';
import { registerPlacesRoutes } from '@/features/places/backend/route';
import { registerSearchRoutes } from '@/features/search/backend/route';
import { registerReviewRoutes } from '@/features/reviews/backend/route';
import { registerPlaceDetailRoutes } from '@/features/place-detail/backend/route';
import type { AppEnv } from '@/backend/hono/context';

let singletonApp: Hono<AppEnv> | null = null;

export const createHonoApp = () => {
  if (singletonApp) {
    return singletonApp;
  }

  // Next.js Route Handler는 /api 접두사를 포함한 전체 경로를 전달하므로
  // Hono 앱을 /api basePath로 생성
  const app = new Hono<AppEnv>().basePath('/api');

  app.use('*', errorBoundary());
  app.use('*', withAppContext());
  app.use('*', withSupabase());

  registerExampleRoutes(app);
  registerPlacesRoutes(app);
  registerSearchRoutes(app);
  registerReviewRoutes(app);
  registerPlaceDetailRoutes(app);

  singletonApp = app;

  return app;
};
