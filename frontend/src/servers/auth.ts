"use server";

import { clearSessionCookie, createSessionCookie, getAuth } from "@/lib/auth";
import { Paths } from "@/lib/const";
import { createServerAction } from "@/lib/utils";
import { Validation, validations } from "@/lib/validations";
import { getDictionary } from "@/servers/locale";

export const loginWithPassword = createServerAction(
  async (formData: Validation["login-with-password"]) => {
    const { email, password } =
      validations["login-with-password"]?.parse(formData);

    // In a real app, you would check against a database
    if (email !== "lamiaadev@gmail.com") throw Error("Invalid credentials.");

    const token = "token_1";
    const user = {
      id: "1",
      name: "Lamiaa Gebriel",
      email,
      image: "https://github.com/shadcn.png",
    };
    // In a real app, you would add user to a database and validate.
    // Here we just return a dummy user object.
    await createSessionCookie({ userId: user?.id, token });

    return { ok: true, redirect: Paths.Dashboard };
  },
  {
    defaultErrorMessage:
      "your user account was not logged in. please try again.",
  }
);

export const registerWithPassword = createServerAction(
  async (formData: Validation["register-with-password"]) => {
    const { name, email, password } =
      validations["register-with-password"]?.parse(formData);

    const token = "token_1";
    const user = {
      id: "1",
      name,
      email,
      image: "https://github.com/shadcn.png",
    };
    // In a real app, you would add user to a database and validate.
    // Here we just return a dummy user object.
    await createSessionCookie({ userId: user?.id, token });

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
