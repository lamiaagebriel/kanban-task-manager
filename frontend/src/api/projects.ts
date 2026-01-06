const projectsData = [
  {
    id: "p1",
    createdBy: "1",
    name: "Personal Kanban",
    description: "A board for tracking personal tasks and habits.",
    createdAt: new Date("2024-04-01T09:00:00.000Z").toISOString(),
  },
  {
    id: "p2",
    createdBy: "1",
    name: "Work Project",
    description: "Project board for team collaboration at the office.",
    createdAt: new Date("2024-05-01T13:24:00.000Z").toISOString(),
  },
  {
    id: "p3",
    createdBy: "1",
    name: "Startup Roadmap",
    description: "Planning board for startup product milestones.",
    createdAt: new Date("2024-06-05T08:30:00.000Z").toISOString(),
  },
];

export const projects = {
  getMany: async ({ userId }: { userId: string }) => {
    return { ok: true, data: { projects: projectsData } };
  },
};
