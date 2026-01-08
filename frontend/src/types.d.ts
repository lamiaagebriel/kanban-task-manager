import { Icons } from "@/components/ui/icons";
import { z } from "zod";

export type SelectItem = {
  value: string;
  children: string | React.ReactNode;
  disabled?: boolean;
  icon?: keyof typeof Icons;
  // color?: string;
};

export type ServerActionResult<T = any> = OnSuccess<T> | OnError;
export type OnSuccess<T> = {
  ok: true;
  data?: T;
  redirect?: string;
} | void;
export type OnError = { ok: false } & (
  | { zodIssues: z.ZodIssue[] }
  | { message: string }
);

// db schemas
export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Project = {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  createdAt: Date;
};

export type Task = {
  projectId: string;
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
};
