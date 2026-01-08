"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatDate } from "@/lib/utils";
import { Project, Task } from "@/types";
import React, { useCallback, useRef, useState } from "react";
import { useLocale } from "./locale-provider";
import { Icons } from "./ui/icons";

interface Column {
  id: string;
  title: string;
  color: string;
}

const initialColumns: Column[] = [
  { id: "todo", title: "To Do", color: "bg-slate-200" },
  { id: "inprogress", title: "In Progress", color: "bg-blue-200" },
  // { id: "review", title: "Review", color: "bg-yellow-200" },
  { id: "done", title: "Done", color: "bg-green-200" },
];

type KanbanDashboardProps = {
  initialTasks: Task[];
  project: Pick<Project, "id">;
};
export default function KanbanDashboard({
  initialTasks,
  project,
}: KanbanDashboardProps) {
  const { locale } = useLocale();
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "todo",
  });

  // For scroll while dragging support
  const columnsContainerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  // Add new column
  const addColumn = () => {
    if (!newColumnTitle.trim()) return;
    const newColumn: Column = {
      id: newColumnTitle.toLowerCase().replace(/\s+/g, "-"),
      title: newColumnTitle,
      color: "bg-purple-200",
    };
    setColumns([...columns, newColumn]);
    setNewColumnTitle("");
    setIsAddColumnOpen(false);
  };

  // Delete column
  const deleteColumn = (columnId: string) => {
    setColumns(columns.filter((col) => col.id !== columnId));
    setTasks(tasks.filter((task) => task.status !== columnId));
  };

  // Add or update task
  const saveTask = () => {
    if (!taskForm.title.trim()) return;

    if (editingTask) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? { ...task, ...taskForm } : task
        )
      );
    } else {
      const newTask: Task = {
        id: Date.now(),
        projectId: project?.id,
        ...taskForm,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTasks([...tasks, newTask]);
    }

    setTaskForm({ title: "", description: "", status: "todo" });
    setEditingTask(null);
    setIsTaskDialogOpen(false);
  };

  // Delete task
  const deleteTask = (selectedTask: Task) => {
    setTasks(tasks.filter((task) => task.id !== selectedTask?.id));
  };

  // Edit task
  const editTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setIsTaskDialogOpen(true);
  };

  // Drag and drop handlers
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
    isDraggingRef.current = true;
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
    setDraggedTask(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (columnId: string) => {
    if (!draggedTask) return;

    setTasks(
      tasks.map((task) =>
        task.id === draggedTask.id ? { ...task, status: columnId } : task
      )
    );
    setDraggedTask(null);
    isDraggingRef.current = false;
  };

  const openNewTaskDialog = (status: string) => {
    setEditingTask(null);
    setTaskForm({ title: "", description: "", status });
    setIsTaskDialogOpen(true);
  };

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
        {columns.map((column) => (
          <div
            key={column.id}
            className="w-80 shrink-0"
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
                    ({tasks.filter((task) => task.status === column.id).length})
                  </span>
                </CardTitle>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => openNewTaskDialog(column.id)}>
                    <Icons.plus />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => deleteColumn(column.id)}>
                    <Icons.trash className="text-destructive" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="min-h-[500px] space-y-3 p-4">
                {tasks
                  .filter((task) => task.status === column.id)
                  .map((task) => (
                    <Card
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task)}
                      onDragEnd={handleDragEnd}
                      className="hover:border-primary/40 flex cursor-move flex-row items-start gap-2 border-2 p-4 transition-shadow hover:shadow-lg">
                      <Icons.grip className="text-muted-foreground" />

                      <div className="flex-1">
                        <h3 className="line-clamp-1 text-base font-semibold">
                          {task.title}
                        </h3>

                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {task.description}
                        </p>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground text-xs">
                            {formatDate(task.createdAt, { locale })}
                          </span>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => editTask(task)}
                              className="rounded-full">
                              <Icons.edit />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteTask(task)}
                              className="rounded-full">
                              <Icons.x className="text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <TaskCreateEditButton
        editingTask={editingTask}
        isTaskDialogOpen={isTaskDialogOpen}
        setIsTaskDialogOpen={setIsTaskDialogOpen}
        taskForm={taskForm}
        setTaskForm={setTaskForm}
        columns={columns}
        saveTask={saveTask}
      />
    </main>
  );
}

// function AddNewColumnButton({
//   newColumnTitle,
//   addColumn,
//   setNewColumnTitle,
//   isAddColumnOpen,
//   setIsAddColumnOpen,
// }: {
//   newColumnTitle: any;
//   addColumn: any;
//   setNewColumnTitle: any;
//   isAddColumnOpen: any;
//   setIsAddColumnOpen: any;
// }) {
//   return (
//     <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
//       <DialogTrigger asChild>
//         <Button className="gap-2">
//           <Plus className="h-4 w-4" />
//           Add Column
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add New Column</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4 pt-4">
//           <div>
//             <Label htmlFor="column-title">Column Title</Label>
//             <Input
//               id="column-title"
//               value={newColumnTitle}
//               onChange={(e) => setNewColumnTitle(e.target.value)}
//               placeholder="Enter column title"
//               onKeyPress={(e) => e.key === "Enter" && addColumn()}
//             />
//           </div>
//           <Button onClick={addColumn} className="w-full">
//             Add Column
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

function TaskCreateEditButton({
  editingTask,
  isTaskDialogOpen,
  setIsTaskDialogOpen,
  taskForm,
  setTaskForm,
  columns = [],
  saveTask,
}: any) {
  return (
    <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingTask ? "Edit Task" : "Add New Task"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({ ...taskForm, title: e.target.value })
              }
              placeholder="Enter task title"
            />
          </div>
          <div>
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  description: e.target.value,
                })
              }
              placeholder="Enter task description"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="task-status">Status</Label>
            <select
              id="task-status"
              value={taskForm.status}
              onChange={(e) =>
                setTaskForm({ ...taskForm, status: e.target.value })
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2">
              {columns.map((col: any) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={saveTask} className="w-full">
            {editingTask ? "Update Task" : "Add Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
