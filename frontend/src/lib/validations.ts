import z from "zod";
import { i18n } from "./locale";

// Used to coerce ids and projectId from string to number (UUID support)
const idField = z.string().uuid({
  message: "id must be a valid UUID",
});

const userSchema = z.object({
  id: idField,
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
    .max(100, "Password must be at most 100 characters."),
});

const usersValidations = {
  "tagret-user-by-id": userSchema.pick({ id: true }),
  "validate-credentials": userSchema.pick({ email: true, password: true }),

  "create-user": userSchema.pick({
    name: true,
    email: true,
    password: true,
  }),
  "update-user": z.object({
    name: userSchema.shape.name.optional(),
    email: userSchema.shape.email.optional(),
    password: userSchema.shape.password.optional(),
  }),
};

const authValidations = {
  "create-auth-session": userSchema.pick({
    id: true,
    email: true,
    name: true,
  }),
  "validate-credentials": userSchema.pick({ email: true, password: true }),
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
const projectSchema = z.object({
  id: idField,
  ownerId: idField,
  name: z
    .string()
    .min(2, "Project name must be at least 2 characters.")
    .max(128, "Project name must be at most 128 characters."),
  description: z
    .string()
    .max(4096, "Description must be at most 4096 characters.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  createdAt: z.date().optional(),
});

const projectsValidations = {
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
  "update-project": projectSchema.pick({
    name: true,
    description: true,
  }),
};

export enum TaskStatus {
  TODO = "todo",
  INPROGRESS = "inprogress",
  REVIEW = "review",
  DONE = "done",
}

const taskSchema = z.object({
  id: idField,
  projectId: idField,
  title: z
    .string()
    .min(1, "Task title is required.")
    .max(128, "Task title must be at most 128 characters."),
  description: z
    .string()
    .max(256, "Description must be at most 256 characters.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  // Use TaskStatus entity enum for values, default to TaskStatus.TODO for consistency with entity
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  createdAt: z.date().or(z.string()).optional(), // For serialization compatibility
});

const tasksValidations = {
  // Identify a single task by id
  "target-task-by-id": z.object({ id: idField }),
  // Identify by ownerId (for all their tasks)
  "target-task-by-ownerId": z.object({ ownerId: idField }),
  // Identify by projectId (for all their tasks)
  "target-task-by-projectId": z.object({ projectId: idField }),
  // Identify a task for a specific user (owner)
  "target-task-by-id+ownerId": z.object({ id: idField, ownerId: idField }),
  // Identify a task for a specific user (owner)
  "target-task-by-id+projectId": z.object({
    id: idField,
    projectId: idField,
  }),
  // Identify a task for a specific user (owner)
  "target-task-by-projectId+ownerId": z.object({
    projectId: idField,
    ownerId: idField,
  }),
  // Identify a task for a specific user (owner)
  "target-task-by-id+projectId+ownerId": z.object({
    id: idField,
    projectId: idField,
    ownerId: idField,
  }),

  // Creating a task (requires projectId, title, description, status (optional))
  "create-task": z.object({
    title: taskSchema.shape.title,
    description: taskSchema.shape.description.optional(),
    status: taskSchema.shape.status.optional(),
  }),
  // Updating a task (any field can be updated except id, projectId)
  "update-task": z.object({
    title: taskSchema.shape.title.optional(),
    description: taskSchema.shape.description.optional(),
    status: taskSchema.shape.status.optional(),
  }),
};

export type ValidationName = keyof typeof validations;
export type Validation = {
  [K in ValidationName]: z.infer<(typeof validations)[K]>;
};

export const validations = {
  "locale-switcher": z.object({ locale: z.enum(i18n?.locales) }),
  ...usersValidations,
  ...authValidations,
  ...projectsValidations,
  ...tasksValidations,
};
