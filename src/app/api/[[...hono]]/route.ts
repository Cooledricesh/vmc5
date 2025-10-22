import { createHonoApp } from '@/backend/hono/app';

const app = createHonoApp();

// Next.js App Router와 Hono 통합
// Hono의 fetch 메서드를 직접 사용
export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const PATCH = app.fetch;
export const DELETE = app.fetch;
export const OPTIONS = app.fetch;

export const runtime = 'nodejs';
