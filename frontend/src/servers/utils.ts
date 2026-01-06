"use server";

import { cookies as nextCookies } from "next/headers";

// Generic function to get a cookie by key
export async function getCookie(key: string): Promise<string | undefined> {
  const cookies = await nextCookies();
  return cookies.get(key)?.value;
}

// Generic function to set a cookie
export async function setCookie(
  key: string,
  value: string,
  options?: {
    httpOnly?: boolean;
    sameSite?: "strict" | "lax" | "none";
    path?: string;
    maxAge?: number;
  }
): Promise<void> {
  const cookies = await nextCookies();
  cookies.set(key, value, {
    httpOnly: options?.httpOnly ?? true,
    sameSite: options?.sameSite ?? "strict",
    path: options?.path ?? "/",
    maxAge: options?.maxAge ?? 60 * 60 * 24 * 365, // default 1 year
  });
}

// Generic function to delete a cookie
export async function deleteCookie(key: string): Promise<void> {
  const cookies = await nextCookies();
  cookies.delete(key);
}
