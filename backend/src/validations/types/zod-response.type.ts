import { z } from 'zod';

export type ZodResponseResult<T = any> =
  | ZodResponseSuccess<T>
  | ZodResponseError;
export type ZodResponseSuccess<T> = {
  ok: true;
  data?: T;
  redirect?: string;
} | void;
export type ZodResponseError = { ok: false } & (
  | { zodIssues: z.ZodIssue[] }
  | { message: string }
);
