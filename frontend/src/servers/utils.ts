import { z } from "zod";

import { Dictionary } from "@/lib/locale";
import { getDictionary } from "@/servers/locale";

type ServerActionResult<T = any> = OnSuccess<T> | OnError;
type OnSuccess<T> = {
  ok: true;
  data?: T;
} | void;
type OnError = { ok: false } & (
  | { zodIssues: z.ZodIssue[] }
  | { message: string }
);

/**
 * Wraps a server action function, standardizing error handling and localization.
 *
 * @template T - The type of the server action input (form data).
 * @template R - The type of the server action result data.
 * @param actionFn - The actual server action logic, returning a promise.
 * @param options - Optional settings, including a fallback error message key.
 * @returns An async function that runs the action and handles errors in a uniform way.
 */
export function createServerAction<T, R>(
  actionFn: (data: T) => Promise<ServerActionResult<R>>,
  options?: { defaultErrorMessage?: keyof Dictionary["actions"] }
) {
  return async (data: T): Promise<ServerActionResult<R>> => {
    const { actions: c } = await getDictionary();
    const defaultErrorMessage = options?.defaultErrorMessage
      ? c[options?.defaultErrorMessage]
      : null;

    try {
      return await actionFn(data);
    } catch (error: any) {
      console.error(error);

      if (error instanceof z.ZodError)
        return { ok: false, zodIssues: error?.issues };

      return {
        ok: false,
        message:
          error?.message ??
          defaultErrorMessage ??
          c["An unexpected error occured, Please try again later."],
      };
    }
  };
}
