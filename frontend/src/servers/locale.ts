"use server";

import { cookies as nextCookies } from "next/headers";

import { ensureValidLocale, LOCALE_COOKIE_KEY } from "@/lib/locale";
import { createServerAction } from "@/lib/utils";
import { Validation, validations } from "@/lib/validations";

const site = {
  si: () => import("@/dic/si").then((module) => module?.default),
  ta: () => import("@/dic/ta").then((module) => module?.default),
  en: () => import("@/dic/en").then((module) => module?.default),
};

export const getDictionary = async () => {
  const cookies = await nextCookies();
  const cookieLocale = cookies.get(LOCALE_COOKIE_KEY)?.value;
  // Ensure we always have a valid locale with fallback to default
  const locale = ensureValidLocale(cookieLocale);

  const dic = await site[locale]();
  const isRTL = (locale as any) === "ar";
  return { locale, isRTL, ...dic };
};

export const localeSwitcher = createServerAction(
  async (formData: Validation["locale-switcher"]) => {
    const { locale } = validations["locale-switcher"]?.parse(formData);

    const cookies = await nextCookies();
    cookies.set(LOCALE_COOKIE_KEY, locale, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }
);
