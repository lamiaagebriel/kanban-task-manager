import z from 'zod';

const userSchema = z.object({
  id: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === 'string' ? Number(val) : val))
    .pipe(z.number().int().positive('id must be a positive integer')),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(64, 'Name must be at most 64 characters.')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Name can only contain letters, spaces, apostrophes, and dashes.',
    ),
  email: z
    .string()
    .email('Please enter a valid email address.')
    .min(5, 'Email must be at least 5 characters.')
    .max(64, 'Email must be at most 64 characters.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(100, 'Password must be at most 100 characters.')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    ),
});

export const validations = {
  'tagret-user-by-id': userSchema.pick({ id: true }),

  'create-user': userSchema.pick({
    name: true,
    email: true,
    password: true,
  }),
  'update-user': z.object({
    name: userSchema.shape.name.optional(),
    email: userSchema.shape.email.optional(),
    password: userSchema.shape.password.optional(),
  }),
};

export type ValidationName = keyof typeof validations;
export type Validation = {
  [K in ValidationName]: z.infer<(typeof validations)[K]>;
};
