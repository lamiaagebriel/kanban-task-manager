import { i18n } from "@/lib/locale";
import z from "zod";

export const validations = {
  "locale-switcher": z.object({ locale: z.enum(i18n?.locales) }),
};

export type ValidationName = keyof typeof validations;
export type Validation = {
  [K in ValidationName]: z.infer<(typeof validations)[K]>;
};
