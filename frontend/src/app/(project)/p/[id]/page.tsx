import type { Metadata } from "next";

import { api } from "@/api";
import KanbanDashboard from "@/components/kanban";
import { getDictionary } from "@/servers/locale";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const { "/p/[id]": c } = await getDictionary();
  return { title: c["Project"] };
}

type ProjectProps = { params: Promise<{ id: string }> };
export default async function Project({ params }: ProjectProps) {
  const { id: projectId } = await params;

  const response_ = await api.projects.findOne({ id: projectId });
  const project =
    !!response_?.ok && !!response_?.data?.project
      ? response_.data.project
      : null;
  if (!project) throw notFound();

  const response = await api.tasks.findAll({ projectId });
  const tasks =
    !!response?.ok && response?.data?.tasks?.length ? response.data.tasks : [];

  return <KanbanDashboard project={project} initialTasks={tasks} />;
}
