import z from "zod";
import { i18n } from "./locale";

const userSchema = z.object({
  id: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? Number(val) : val))
    .pipe(z.number().int().positive("id must be a positive integer")),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(64, "Name must be at most 64 characters.")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, apostrophes, and dashes."
    ),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .min(5, "Email must be at least 5 characters.")
    .max(64, "Email must be at most 64 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be at most 100 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
});

const projectSchema = z.object({
  id: z
    .number()
    // .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? Number(val) : val))
    .pipe(z.number().int().positive("id must be a positive integer")),
  name: z
    .string()
    .min(2, "Project name must be at least 2 characters.")
    .max(128, "Project name must be at most 128 characters."),
  description: z
    .string()
    .max(256, "Description must be at most 256 characters.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  ownerId: z
    .number()
    // .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? Number(val) : val))
    .pipe(z.number().int().positive("ownerId must be a positive integer")),
  createdAt: z.date().optional(),
});

const userValidations = {
  "tagret-user-by-id": userSchema.pick({ id: true }),
};

const authValidations = {
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

const projectValidations = {
  "target-project-by-id": projectSchema.pick({ id: true }),
  "target-project-by-ownerId": projectSchema.pick({ ownerId: true }),
  "target-project-by-id+ownerId": projectSchema.pick({
    id: true,
    ownerId: true,
  }),

  "create-project": projectSchema.pick({
    name: true,
    description: true,
  }),
  "update-project": z.object({
    name: projectSchema.shape.name.optional(),
    description: projectSchema.shape.description.optional(),
  }),
};

export const validations = {
  "locale-switcher": z.object({ locale: z.enum(i18n?.locales) }),

  ...userValidations,
  ...authValidations,
  ...projectValidations,
};

export type ValidationName = keyof typeof validations;
export type Validation = {
  [K in ValidationName]: z.infer<(typeof validations)[K]>;
};
