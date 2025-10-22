import type { Hono } from 'hono';
import { respond } from '@/backend/http/response';
import {
  getSupabase,
  getLogger,
  type AppEnv,
} from '@/backend/hono/context';
import { createReview } from './service';

export const registerReviewRoutes = (app: Hono<AppEnv>) => {
  app.post('/reviews', async (c) => {
    const logger = getLogger(c);
    const supabase = getSupabase(c);

    let payload;
    try {
      payload = await c.req.json();
    } catch (error) {
      logger.error('Failed to parse request body', error);
      return c.json(
        {
          error: {
            code: 'INVALID_JSON',
            message: 'Request body must be valid JSON',
          },
        },
        400
      );
    }

    const result = await createReview(supabase, payload);

    if (!result.ok) {
      logger.error('Failed to create review');
    } else {
      logger.info('Review created successfully', {
        reviewId: result.data.reviewId,
        placeId: result.data.placeId,
      });
    }

    return respond(c, result);
  });
};
