import z from 'zod';

// Used to coerce ids and projectId from string to number (UUID support)
const idField = z.string().uuid({
  message: 'id must be a valid UUID',
});
export const projectSchema = z.object({
  id: idField,
  ownerId: idField,
  name: z
    .string()
    .min(2, 'Project name must be at least 2 characters.')
    .max(128, 'Project name must be at most 128 characters.'),
  description: z
    .string()
    .max(4096, 'Description must be at most 4096 characters.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
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
  'update-project': projectSchema.pick({
    name: true,
    description: true,
  }),
};

export type ValidationName = keyof typeof validations;
export type Validation = {
  [K in ValidationName]: z.infer<(typeof validations)[K]>;
};
