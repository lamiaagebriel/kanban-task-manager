"use server";

import { api } from "@/api";
import { createServerAction } from "@/lib/utils";
import { Validation } from "@/lib/validations";
import { revalidateTag } from "next/cache";

export const createProject = createServerAction(
  async (formData: Validation["create-project"]) => {
    await api.projects.create(formData);
    revalidateTag("projects", "max");
  },
  {
    defaultErrorMessage:
      "Unable to create project at this time. Please try again later.",
  }
);

export const updateProject = createServerAction(
  async (
    formData: Validation["target-project-by-id"] & Validation["update-project"]
  ) => {
    await api.projects.update(formData);
    revalidateTag("projects", "max");
  },
  {
    defaultErrorMessage:
      "We couldn't update the project. Please try again shortly.",
  }
);
export const deleteProject = createServerAction(
  async (formData: Validation["target-project-by-id"]) => {
    await api.projects.remove(formData);
    revalidateTag("projects", "max");
  },
  {
    defaultErrorMessage:
      "Unable to delete the project right now. Please try again later.",
  }
);
