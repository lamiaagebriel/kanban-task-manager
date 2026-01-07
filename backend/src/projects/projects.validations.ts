import z from 'zod';

export const projectSchema = z.object({
  id: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === 'string' ? Number(val) : val))
    .pipe(z.number().int().positive('id must be a positive integer')),
  name: z
    .string()
    .min(2, 'Project name must be at least 2 characters.')
    .max(128, 'Project name must be at most 128 characters.'),
  description: z
    .string()
    .max(4096, 'Description must be at most 4096 characters.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  ownerId: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === 'string' ? Number(val) : val))
    .pipe(z.number().int().positive('ownerId must be a positive integer')),
  createdAt: z.date().optional(),
});

export const validations = {
  'target-project-by-id': projectSchema.pick({ id: true }),
  'target-project-by-ownerId': projectSchema.pick({ ownerId: true }),
  'target-project-by-id+ownerId': projectSchema.pick({
    id: true,
    ownerId: true,
  }),

  'create-project': projectSchema.pick({
    name: true,
    description: true,
  }),
  'update-project': z.object({
    name: projectSchema.shape.name.optional(),
    description: projectSchema.shape.description.optional(),
  }),
};

export type ValidationName = keyof typeof validations;
export type Validation = {
  [K in ValidationName]: z.infer<(typeof validations)[K]>;
};
