"use server";

import { api } from "@/api";
import { createServerAction } from "@/lib/utils";
import { Validation } from "@/lib/validations";
import { revalidateTag } from "next/cache";

export const createTask = createServerAction(
  async (
    formData: Validation["create-task"] & Validation["target-task-by-projectId"]
  ) => {
    await api.tasks.create(formData);
    revalidateTag("tasks", "max");
  },
  {
    defaultErrorMessage:
      "Unable to create task at this time. Please try again later.",
  }
);

export const updateTask = createServerAction(
  async (
    formData: Validation["update-task"] &
      Validation["target-task-by-id+projectId"]
  ) => {
    await api.tasks.update(formData);
    revalidateTag("tasks", "max");
  },
  {
    defaultErrorMessage:
      "We couldn't update the task. Please try again shortly.",
  }
);

export const deleteTask = createServerAction(
  async (formData: Validation["target-task-by-id+projectId"]) => {
    await api.tasks.remove(formData);
    revalidateTag("tasks", "max");
  },
  {
    defaultErrorMessage:
      "Unable to delete the task right now. Please try again later.",
  }
);
