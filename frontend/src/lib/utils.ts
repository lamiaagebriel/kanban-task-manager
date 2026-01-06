import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { z } from "zod";

import { Dictionary } from "@/lib/locale";
import { getDictionary } from "@/servers/locale";
import { OnError, OnSuccess, ServerActionResult } from "@/types";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A wrapper to standardize server action error handling, targeting two types of errors:
 * 1. Zod validation errors (structure issues with incoming data)
 * 2. General/unknown errors (e.g. thrown from business logic, network issues)
 * Also provides a handler for these errors on the client and returns on success.
 */

// Server action wrapper for error handling
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
      // Run the actual server action logic
      return await actionFn(data);
    } catch (error: any) {
      // Error type 1: Zod validation error (validation failed)
      if (error instanceof z.ZodError) {
        return { ok: false, zodIssues: error.issues };
      }
      // Error type 2: General/unexpected error
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

// Client-side handler for the above server action result
export async function handleServerAction<R>(
  actionFn:
    | Promise<ServerActionResult<R>>
    | (() => Promise<ServerActionResult<R>>),
  options?: {
    form?: UseFormReturn<any>;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    onSuccess?: (data: OnSuccess<R>) => void;
    onError?: (data: OnError) => void;
  }
) {
  const { form, setLoading, onSuccess, onError } = options ?? {};
  setLoading?.(true);

  try {
    const result =
      typeof actionFn === "function" ? await actionFn() : await actionFn;

    if (!result) return;
    if (!result.ok) {
      // Handler for error type 1 (validation issues)
      if ("zodIssues" in result && Array.isArray(result?.zodIssues)) {
        if (!form) {
          if (process.env.NODE_ENV !== "production")
            throw new Error("form is missing in handleServerAction.");

          return;
        }

        result?.zodIssues?.forEach((e) => {
          const path = e?.path?.join(".");
          if (!path) return toast.error(e?.message!);

          form?.setError(path as any, { message: e?.message! });
        });
      }

      // Handler for error type 2 (general server-side error)
      if ("message" in result && typeof result?.message === "string")
        toast.error(result?.message);

      onError?.(result);
    }

    if (result.ok) {
      onSuccess?.(result);
      // if (result?.toast) toast[result?.toast?.type]?.(result?.toast?.message);
      // if (result?.redirect) redirect(result?.redirect);
    }
  } finally {
    setLoading?.(false);
  }
}
