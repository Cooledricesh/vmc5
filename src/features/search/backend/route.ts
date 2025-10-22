import type { Hono } from 'hono';
import { respond, failure } from '@/backend/http/response';
import { getLogger, getConfig, type AppEnv } from '@/backend/hono/context';
import { SearchPlacesQuerySchema } from './schema';
import { searchPlaces } from './service';

export const registerSearchRoutes = (app: Hono<AppEnv>) => {
  app.get('/search/places', async (c) => {
    const logger = getLogger(c);
    const config = getConfig(c);

    const parsedQuery = SearchPlacesQuerySchema.safeParse({
      query: c.req.query('query'),
    });

    if (!parsedQuery.success) {
      return respond(
        c,
        failure(
          400,
          'INVALID_SEARCH_QUERY',
          'Search query is required',
          parsedQuery.error.format()
        )
      );
    }

    if (!config.naver?.search) {
      logger.error('Naver API credentials not configured');
      return respond(
        c,
        failure(500, 'CONFIG_ERROR', 'API credentials not configured')
      );
    }

    const { clientId, clientSecret } = config.naver.search;

    const result = await searchPlaces(parsedQuery.data, clientId, clientSecret);

    if (!result.ok) {
      logger.error('Search places failed');
    }

    return respond(c, result);
  });
};
