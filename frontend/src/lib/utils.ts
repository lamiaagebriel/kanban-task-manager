import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { z } from "zod";

import { Dictionary, Locale } from "@/lib/locale";
import { getDictionary } from "@/servers/locale";
import { OnError, OnSuccess, ServerActionResult } from "@/types";
import { DateArg, format, formatDistanceToNow, FormatOptions } from "date-fns";
import * as DateFnsLocale from "date-fns/locale";
import { redirect } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { getSessionCookie } from "./auth";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FormatDateOptions = {
  formatStr?: string;
  type?: "default" | "distance";
} & Omit<FormatOptions, "locale">;

export function formatDate(
  date: DateArg<Date>,
  {
    type,
    locale: _locale = "en",
    formatStr: _formatStr,
    ...opts
  }: FormatDateOptions & { locale: Locale }
) {
  const locale =
    (_locale as any) === "ar" ? DateFnsLocale.arSA : DateFnsLocale?.enUS;
  const formatStr = (_locale as any) === "ar" ? "dd MMMM yyyy" : "PPP";

  if (!date) return null;

  if (type === "distance")
    return formatDistanceToNow(date, {
      locale,
      // roundingMethod: "floor", // Ensure intervals are rounded down
      // unit: "auto", // Automatically switch between s, m, h, d, etc.
      includeSeconds: true,
      addSuffix: true,
    });

  return format(date, formatStr, {
    locale,
    ...opts,
  });
}

export const fetcher = async <T = void>(
  _url: string,
  { ...options }: RequestInit = {}
): Promise<{ ok: true; data: T }> => {
  const SERVER_URL = "http://localhost:8000";

  const token = (await getSessionCookie())?.token ?? null;

  const url = `${SERVER_URL}${_url}`;

  // NOTE: as all the api responses are wrapped in a json object
  const response = await fetch(url, {
    method: "GET",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  const { ok, ...data } = await response?.json();
  if (!ok) {
    if (data?.zodIssues) throw new z.ZodError(data?.zodIssues);
    throw new Error(
      data?.message ?? "an unexpected error occured, please try again later."
    );
  }

  // only return data from the response
  return { ok, ...data } as { ok: true; data: T };
};

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

    if (result && result?.ok == false) {
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
    } else {
      onSuccess?.(result);
      if (result?.redirect) redirect(result?.redirect);
      // if (result?.toast) toast[result?.toast?.type]?.(result?.toast?.message);
    }
  } finally {
    setLoading?.(false);
  }
}
