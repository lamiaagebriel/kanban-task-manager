import { z } from "zod";

export type ServerActionResult<T = any> = OnSuccess<T> | OnError;
export type OnSuccess<T> = {
  ok: true;
  data?: T;
} | void;
export type OnError = { ok: false } & (
  | { zodIssues: z.ZodIssue[] }
  | { message: string }
);
