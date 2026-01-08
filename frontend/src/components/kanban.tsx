"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatDate, handleServerAction } from "@/lib/utils";
import { TaskStatus } from "@/lib/validations";
import { updateTask } from "@/servers/tasks";
import { Project, Task } from "@/types";
import React, { useCallback, useRef, useState } from "react";
import { useLocale } from "./locale-provider";
import { Icons } from "./ui/icons";

import { TaskCreateEditButton } from "./task-create-edit-button";
import { TaskDeleteButton } from "./task-delete-button";

interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

type KanbanDashboardProps = {
  initialTasks: Task[];
  project: Pick<Project, "id">;
};

// Drag and Drop Handlers Component
function DragAndDropHandlers({
  setDraggedTask,
  isDraggingRef,
  setDraggedTaskNull,
}: any) {
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
    isDraggingRef.current = true;
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
    setDraggedTaskNull();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return { handleDragStart, handleDragEnd, handleDragOver };
}

// Drop Handler Component
function DropHandler({
  draggedTask,
  project,
  setDraggedTask,
  isDraggingRef,
}: any) {
  const handleDrop = async (columnId: TaskStatus) => {
    if (!draggedTask) return;

    await handleServerAction(() =>
      updateTask({
        id: draggedTask?.id,
        projectId: project?.id,
        status: columnId,
      })
    );

    setDraggedTask(null);
    isDraggingRef.current = false;
  };

  return handleDrop;
}

// Task Card Component
function TaskCard({ task, columns, handleDragStart, handleDragEnd }: any) {
  const { locale } = useLocale();
  return (
    <Card
      key={task.id}
      draggable
      onDragStart={() => handleDragStart(task)}
      onDragEnd={handleDragEnd}
      className="hover:border-primary/40 flex cursor-move flex-row items-start gap-2 border-2 p-4 transition-shadow hover:shadow-lg">
      <Icons.grip className="text-muted-foreground" />

      <div className="flex-1">
        <h3 className="line-clamp-1 text-base font-semibold">{task.title}</h3>

        <p className="text-muted-foreground line-clamp-2 text-sm">
          {task.description}
        </p>

        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground text-xs">
            {formatDate(task.createdAt, { locale })}
          </span>

          <div className="flex items-center gap-1">
            <TaskCreateEditButton
              task={task}
              project={{ id: task?.projectId }}
              columns={columns}
              variant="ghost"
              size="icon"
              className="rounded-full">
              <Icons.edit />
            </TaskCreateEditButton>
            <TaskDeleteButton
              task={task}
              variant="ghost"
              size="icon"
              className="rounded-full">
              <Icons.x className="text-destructive" />
            </TaskDeleteButton>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Kanban Column Component
function KanbanColumn({
  column,
  tasks,
  handleDragOver,
  handleDrop,
  handleDragStart,
  handleDragEnd,
  columns,
  project,
}: any) {
  return (
    <div
      key={column.id}
      className="w-104"
      onDragOver={handleDragOver}
      onDrop={() => handleDrop(column.id)}>
      <Card className="h-full gap-0 rounded-none pt-0">
        <CardHeader
          className={cn(
            column.color,
            "flex flex-row items-center justify-between gap-2 py-2"
          )}>
          <CardTitle className="text-lg font-semibold">
            {column.title}{" "}
            <span className="text-muted-foreground text-sm font-normal">
              ({tasks.length})
            </span>
          </CardTitle>
          <div className="flex gap-2">
            <TaskCreateEditButton
              project={project}
              task={{ status: column.id }}
              columns={columns}
              variant="ghost"
              size="icon"
              className="rounded-full">
              <Icons.plus />
            </TaskCreateEditButton>
          </div>
        </CardHeader>
        <CardContent className="min-h-[500px] space-y-3 p-4">
          {tasks.map((task: Task) => (
            <TaskCard
              key={task.id}
              task={task}
              columns={columns}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function KanbanDashboard({
  initialTasks,
  project,
}: KanbanDashboardProps) {
  const { "/p/[id]": t } = useLocale();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const columns: Column[] = [
    { id: TaskStatus.TODO, title: t["Todo"], color: "bg-slate-200" },
    {
      id: TaskStatus.INPROGRESS,
      title: t["In Progress"],
      color: "bg-blue-200",
    },
    // { id: TaskStatus.REVIEW, title: "Review", color: "bg-yellow-200" ,},
    { id: TaskStatus.DONE, title: t["Done"], color: "bg-green-200" },
  ];

  // For scroll while dragging support
  const columnsContainerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  // Drag and Drop Handlers from Component
  const { handleDragStart, handleDragEnd, handleDragOver } =
    DragAndDropHandlers({
      setDraggedTask,
      isDraggingRef,
      setDraggedTaskNull: () => setDraggedTask(null),
    });

  // Drop Handler from Component
  const handleDrop = DropHandler({
    draggedTask,
    project,
    setTasks,
    tasks,
    setDraggedTask,
    isDraggingRef,
  });

  /**
   * Custom Wheel handler: While dragging a task, scrolling the mouse wheel scrolls the kanban columns horizontally.
   */
  const handleColumnsWheel = useCallback((e: React.WheelEvent) => {
    if (isDraggingRef.current && columnsContainerRef.current) {
      // Only scroll horizontally while dragging a card
      columnsContainerRef.current.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, []);

  return (
    <main className="flex flex-1 flex-col">
      <div
        className="container flex max-w-max! flex-1 gap-6 overflow-x-auto px-6"
        ref={columnsContainerRef}
        onWheel={handleColumnsWheel}
        // Touch support for drag-scroll while dragging a card (mobile)
        // Not implemented here, only supports mouse wheel
        data-testid="kanban-columns">
        {columns.map((column) => {
          const filteredTasks = tasks.filter(
            (task) => task.status === column.id
          );
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={filteredTasks}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              columns={columns}
              project={project}
            />
          );
        })}
      </div>
    </main>
  );
}
