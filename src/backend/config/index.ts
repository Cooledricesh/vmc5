import { z } from 'zod';
import type { AppConfig } from '@/backend/hono/context';

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NAVER_SEARCH_CLIENT_ID: z.string().optional(),
  NAVER_SEARCH_CLIENT_SECRET: z.string().optional(),
});

let cachedConfig: AppConfig | null = null;

export const getAppConfig = (): AppConfig => {
  if (cachedConfig) {
    return cachedConfig;
  }

  const parsed = envSchema.safeParse({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NAVER_SEARCH_CLIENT_ID: process.env.NAVER_SEARCH_CLIENT_ID,
    NAVER_SEARCH_CLIENT_SECRET: process.env.NAVER_SEARCH_CLIENT_SECRET,
  });

  if (!parsed.success) {
    const messages = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || 'config'}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid backend configuration: ${messages}`);
  }

  const config: AppConfig = {
    supabase: {
      url: parsed.data.SUPABASE_URL,
      serviceRoleKey: parsed.data.SUPABASE_SERVICE_ROLE_KEY,
    },
  };

  // 네이버 검색 API 설정 (선택사항)
  if (parsed.data.NAVER_SEARCH_CLIENT_ID && parsed.data.NAVER_SEARCH_CLIENT_SECRET) {
    config.naver = {
      search: {
        clientId: parsed.data.NAVER_SEARCH_CLIENT_ID,
        clientSecret: parsed.data.NAVER_SEARCH_CLIENT_SECRET,
      },
    };
  }

  cachedConfig = config;

  return cachedConfig;
};
