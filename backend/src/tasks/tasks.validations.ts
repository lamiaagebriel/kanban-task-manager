import z from 'zod';
import { TaskStatus } from './entities/task.entity';

// Used to coerce ids and projectId from string to number (UUID support)
const idField = z.string().uuid({
  message: 'id must be a valid UUID',
});

export const taskSchema = z.object({
  id: idField,
  projectId: idField,
  title: z
    .string()
    .min(1, 'Task title is required.')
    .max(128, 'Task title must be at most 128 characters.'),
  description: z
    .string()
    .max(256, 'Description must be at most 256 characters.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  // Use TaskStatus entity enum for values, default to TaskStatus.TODO for consistency with entity
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  createdAt: z.date().or(z.string()).optional(), // For serialization compatibility
});

export const validations = {
  // Identify a single task by id
  'target-task-by-id': z.object({ id: idField }),
  // Identify by ownerId (for all their tasks)
  'target-task-by-ownerId': z.object({ ownerId: idField }),
  // Identify by projectId (for all their tasks)
  'target-task-by-projectId': z.object({ projectId: idField }),
  // Identify a task for a specific user (owner)
  'target-task-by-id+ownerId': z.object({ id: idField, ownerId: idField }),
  // Identify a task for a specific user (owner)
  'target-task-by-id+projectId': z.object({
    id: idField,
    projectId: idField,
  }),
  // Identify a task for a specific user (owner)
  'target-task-by-projectId+ownerId': z.object({
    projectId: idField,
    ownerId: idField,
  }),
  // Identify a task for a specific user (owner)
  'target-task-by-id+projectId+ownerId': z.object({
    id: idField,
    projectId: idField,
    ownerId: idField,
  }),

  // Creating a task (requires projectId, title, description, status (optional))
  'create-task': z.object({
    title: taskSchema.shape.title,
    description: taskSchema.shape.description.optional(),
    status: taskSchema.shape.status.optional(),
  }),
  // Updating a task (any field can be updated except id, projectId)
  'update-task': z.object({
    title: taskSchema.shape.title.optional(),
    description: taskSchema.shape.description.optional(),
    status: taskSchema.shape.status.optional(),
  }),
};

export type ValidationName = keyof typeof validations;
export type Validation = {
  [K in ValidationName]: z.infer<(typeof validations)[K]>;
};
