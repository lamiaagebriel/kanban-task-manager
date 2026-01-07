import { z } from "zod";

export type ServerActionResult<T = any> = OnSuccess<T> | OnError;
export type OnSuccess<T> = {
  ok: true;
  data?: T;
  redirect?: string;
} | void;
export type OnError = { ok: false } & (
  | { zodIssues: z.ZodIssue[] }
  | { message: string }
);

// db schemas
export type User = {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
