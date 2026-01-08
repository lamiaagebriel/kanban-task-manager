import { createServerAction } from "@/lib/utils";
import { Task } from "@/types";

const initialTasks: Task[] = [
  {
    id: 1,
    projectId: 36,
    title: "Design landing page",
    description: "Create mockups for the new landing page",
    status: "todo",
    createdAt: new Date("2024-01-08")?.toDateString(),
  },
  {
    id: 2,
    projectId: 36,
    title: "Implement authentication",
    description: "Add JWT-based authentication",
    status: "todo",
    createdAt: new Date("2024-01-08")?.toDateString(),
  },
  {
    id: 3,
    projectId: 36,
    title: "Fix responsive layout",
    description: "Mobile view needs adjustments",
    status: "inprogress",
    createdAt: new Date("2024-01-07")?.toDateString(),
  },
  {
    id: 4,
    projectId: 36,
    title: "API integration",
    description: "Connect frontend to backend API",
    status: "inprogress",
    createdAt: new Date("2024-01-07")?.toDateString(),
  },
  {
    id: 5,
    projectId: 36,
    title: "Code review PR #123",
    description: "Review authentication implementation",
    status: "review",
    createdAt: new Date("2024-01-06")?.toDateString(),
  },
  {
    id: 6,
    projectId: 36,
    title: "Update documentation",
    description: "Add API documentation",
    status: "done",
    createdAt: new Date("2024-01-05")?.toDateString(),
  },
  {
    id: 7,
    projectId: 36,
    title: "Setup CI/CD pipeline",
    description: "Configure GitHub Actions",
    status: "done",
    createdAt: new Date("2024-01-04")?.toDateString(),
  },
];
export const tasks = {
  getMany: createServerAction(
    async ({ projectId }: Pick<Task, "projectId">) => {
      // return fetcher<{ tasks: Task[] }>("/api/tasks", {
      //   next: { tags: ["tasks"] },
      // });

      return { ok: true, data: { tasks: initialTasks } };
    }
    // { defaultErrorMessage: "Unable to load your tasks at the moment." }
  ),
};
