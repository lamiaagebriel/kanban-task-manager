"use server";

import { cookies as nextCookies } from "next/headers";

import {
  createBlankSessionCookie,
  createSessionCookie,
  getAuth,
} from "@/lib/auth";
import { createServerAction } from "@/lib/utils";
import { Validation, validations } from "@/lib/validations";
import { getDictionary } from "@/servers/locale";

export const loginWithPassword = createServerAction(
  async (formData: Validation["login-with-password"]) => {
    const data = validations["login-with-password"]?.parse(formData);
    const cookies = await nextCookies();

    const existingUser = { id: "1", name: "Lamiaa Gebriel", ...data };

    const sessionCookie = createSessionCookie({
      userId: existingUser?.id,
      expires: 0,
    });

    cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return { ok: true };
  },
  {
    defaultErrorMessage:
      "your user account was not logged in. please try again.",
  }
);

export const registerWithPassword = createServerAction(
  async (formData: Validation["register-with-password"]) => {
    const data = validations["register-with-password"]?.parse(formData);
    const cookies = await nextCookies();

    const existingUser = { id: "1", ...data };

    const sessionCookie = createSessionCookie({
      userId: existingUser?.id,
      expires: 0,
    });
    cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return { ok: true };
  },
  {
    defaultErrorMessage: "your user account was not created. please try again.",
  }
);

export const logout = createServerAction(async () => {
  const cookies = await nextCookies();
  const { actions: c } = await getDictionary();
  const { session } = await getAuth();
  if (!session) throw new Error(c["you are not logged in."]);

  const sessionCookie = createBlankSessionCookie();
  cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return { ok: true };
});
