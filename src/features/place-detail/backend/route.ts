import type { Hono } from 'hono';
import type { AppEnv } from '@/backend/hono/context';
import { getLogger, getSupabase } from '@/backend/hono/context';
import { respond } from '@/backend/http/response';
import { getPlaceById, getReviewsByPlaceId } from './service';
import { placeDetailErrorCodes } from './error';

export const registerPlaceDetailRoutes = (app: Hono<AppEnv>) => {
  // GET /places/:placeId - 장소 정보 조회
  app.get('/places/:placeId', async (c) => {
    const logger = getLogger(c);
    const supabase = getSupabase(c);
    const placeIdParam = c.req.param('placeId');
    const placeId = parseInt(placeIdParam, 10);

    if (isNaN(placeId) || placeId <= 0) {
      return c.json(
        {
          error: {
            code: placeDetailErrorCodes.invalidPlaceId,
            message: 'Invalid place ID',
          },
        },
        400
      );
    }

    const result = await getPlaceById(supabase, placeId);

    if (!result.ok) {
      logger.error('Failed to fetch place', { placeId });
    }

    return respond(c, result);
  });

  // GET /places/:placeId/reviews - 리뷰 목록 조회
  app.get('/places/:placeId/reviews', async (c) => {
    const logger = getLogger(c);
    const supabase = getSupabase(c);
    const placeIdParam = c.req.param('placeId');
    const placeId = parseInt(placeIdParam, 10);

    if (isNaN(placeId) || placeId <= 0) {
      return c.json(
        {
          error: {
            code: placeDetailErrorCodes.invalidPlaceId,
            message: 'Invalid place ID',
          },
        },
        400
      );
    }

    const result = await getReviewsByPlaceId(supabase, placeId);

    if (!result.ok) {
      logger.error('Failed to fetch reviews', { placeId });
    }

    return respond(c, result);
  });
};
