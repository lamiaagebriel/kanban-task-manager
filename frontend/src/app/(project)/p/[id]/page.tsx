import type { Metadata } from "next";

import { api } from "@/api";
import KanbanDashboard from "@/components/kanban";
import { getDictionary } from "@/servers/locale";

export async function generateMetadata(): Promise<Metadata> {
  const { "/p/[id]": c } = await getDictionary();
  return { title: c["Project"] };
}

export default async function Project() {
  const response = await api.tasks.getMany({ projectId: "1" });
  const tasks =
    !!response?.ok && response?.data?.tasks?.length ? response.data.tasks : [];

  const project = { id: 36, name: "10 Days Workout" };
  return <KanbanDashboard project={project} initialTasks={tasks} />;
}
