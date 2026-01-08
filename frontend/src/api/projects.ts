import { createServerAction, fetcher } from "@/lib/utils";
import { Validation, validations } from "@/lib/validations";
import { Project } from "@/types";

export const projects = {
  findAll: createServerAction(
    async (_: void) => {
      return fetcher<{ projects: Project[] }>("/api/projects", {
        next: { tags: ["projects"] },
      });
    },
    { defaultErrorMessage: "Unable to load your projects at the moment." }
  ),
  findOne: createServerAction(
    async (formData: Validation["target-project-by-id"]) => {
      const { id } = validations["target-project-by-id"].parse(formData);
      return fetcher<{ project: Project | null }>(`/api/projects/${id}`);
    },
    {
      defaultErrorMessage: "The requested project could not be found.",
    }
  ),
  create: async (formData: Validation["create-project"]) => {
    const body = validations["create-project"].parse(formData);

    return fetcher<{ project: Project }>("/api/projects", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  update: async (
    formData: Validation["target-project-by-id"] & Validation["update-project"]
  ) => {
    const { id, ...body } = validations["update-project"]
      .and(validations["target-project-by-id"])
      .parse(formData);

    return fetcher<{ project: Project }>(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },
  remove: async (formData: Validation["target-project-by-id"]) => {
    const { id } = validations["target-project-by-id"].parse(formData);

    return fetcher(`/api/projects/${id}`, { method: "DELETE" });
  },
};
