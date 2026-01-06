import { i18n } from "@/lib/locale";
import z from "zod";

const userSchema = z.object({
  name: z
    .string()
    .min(5, "Name must be at least 5 characters.")
    .max(64, "Name must be at most 64 characters."),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .min(5, "Email must be at least 5 characters.")
    .max(64, "Email must be at most 64 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be at most 100 characters."),
});
export const authValidations = {
  "login-with-password": userSchema.pick({
    email: true,
    password: true,
  }),
  "register-with-password": userSchema.pick({
    name: true,
    email: true,
    password: true,
  }),
};

export const validations = {
  ...authValidations,
  "locale-switcher": z.object({ locale: z.enum(i18n?.locales) }),
};

export type ValidationName = keyof typeof validations;
export type Validation = {
  [K in ValidationName]: z.infer<(typeof validations)[K]>;
};
