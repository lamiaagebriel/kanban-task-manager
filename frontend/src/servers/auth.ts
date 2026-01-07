"use server";

import { api } from "@/api";
import { clearSessionCookie, createSessionCookie, getAuth } from "@/lib/auth";
import { Paths } from "@/lib/const";
import { createServerAction } from "@/lib/utils";
import { Validation } from "@/lib/validations";
import { getDictionary } from "@/servers/locale";

export const loginWithPassword = createServerAction(
  async (formData: Validation["login-with-password"]) => {
    const {
      data: { user, access_token },
    } = await api.auth.loginWithPassword(formData);
    if (!user) throw Error();

    await createSessionCookie({
      userId: user?.id?.toString(),
      token: access_token,
    });

    return { ok: true, redirect: Paths.Dashboard };
  },
  {
    defaultErrorMessage:
      "your user account was not logged in. please try again.",
  }
);

export const registerWithPassword = createServerAction(
  async (formData: Validation["register-with-password"]) => {
    const {
      data: { user, access_token },
    } = await api.auth.registerWithPassword(formData);
    if (!user) throw Error();

    await createSessionCookie({
      userId: user?.id?.toString(),
      token: access_token,
    });

    return { ok: true, redirect: Paths.Dashboard };
  },
  {
    defaultErrorMessage: "your user account was not created. please try again.",
  }
);

export const logout = createServerAction(async (_: void) => {
  const { actions: c } = await getDictionary();
  const { session } = await getAuth();
  if (!session) throw new Error(c["you are not logged in."]);

  await clearSessionCookie();

  return { ok: true, redirect: Paths.Login };
});
