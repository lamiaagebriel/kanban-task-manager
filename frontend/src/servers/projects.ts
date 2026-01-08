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

export const deleteProject = createServerAction(
  async (formData: Validation["target-project-by-id+ownerId"]) => {
    await api.projects.remove(formData);
    revalidateTag("projects", "max");
  },
  {
    defaultErrorMessage:
      "Unable to delete the project right now. Please try again later.",
  }
);
