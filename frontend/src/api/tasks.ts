import { createServerAction, fetcher } from "@/lib/utils";
import { Validation, validations } from "@/lib/validations";
import { Task } from "@/types";

export const tasks = {
  findAll: createServerAction(
    async (formData: Validation["target-task-by-projectId"]) => {
      const { projectId } =
        validations["target-task-by-projectId"].parse(formData);

      return fetcher<{ tasks: Task[] }>(`/api/projects/${projectId}/tasks`, {
        next: { tags: ["tasks"] },
      });
    },
    { defaultErrorMessage: "Unable to load your tasks at the moment." }
  ),
  create: async (
    formData: Validation["create-task"] & Validation["target-task-by-projectId"]
  ) => {
    const { projectId, ...body } = validations["create-task"]
      .and(validations["target-task-by-projectId"])
      .parse(formData);

    return fetcher<{ task: Task | null }>(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  update: async (
    formData: Validation["update-task"] &
      Validation["target-task-by-id+projectId"]
  ) => {
    const { id, projectId, ...body } = validations["update-task"]
      .and(validations["target-task-by-id+projectId"])
      .parse(formData);

    return fetcher<{ task: Task | null }>(
      `/api/projects/${projectId}/tasks/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );
  },
  remove: async (formData: Validation["target-task-by-id+projectId"]) => {
    const { id, projectId } =
      validations["target-task-by-id+projectId"].parse(formData);

    return fetcher(`/api/projects/${projectId}/tasks/${id}`, {
      method: "DELETE",
    });
  },
};
