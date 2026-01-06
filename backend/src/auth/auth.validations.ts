import { userSchema } from 'src/users/users.validations';
import z from 'zod';

export const validations = {
  'create-auth-session': userSchema.pick({
    id: true,
    email: true,
    name: true,
  }),
  'validate-credentials': userSchema.pick({ email: true, password: true }),
  'login-with-password': userSchema.pick({
    email: true,
    password: true,
  }),
  'register-with-password': userSchema.pick({
    name: true,
    email: true,
    password: true,
  }),
};

export type ValidationName = keyof typeof validations;
export type Validation = {
  [K in ValidationName]: z.infer<(typeof validations)[K]>;
};
