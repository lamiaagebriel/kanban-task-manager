import { fetcher } from "@/lib/utils";
import { Validation, validations } from "@/lib/validations";
import { User } from "@/types";

export const auth = {
  loginWithPassword: async (formData: Validation["login-with-password"]) => {
    const data = validations["login-with-password"].parse(formData);

    return fetcher<{
      access_token: string;
      user: Pick<User, "id" | "name" | "email">;
    }>(`/api/auth/login-with-password`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  registerWithPassword: async (
    formData: Validation["register-with-password"]
  ) => {
    const data = validations["register-with-password"].parse(formData);

    return fetcher<{
      access_token: string;
      user: Pick<User, "id" | "name" | "email">;
    }>(`/api/auth/register-with-password`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
