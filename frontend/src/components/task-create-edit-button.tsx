"use client";

import * as React from "react";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { TaskStatus, validations } from "@/lib/validations";
import { Button, ButtonProps } from "./ui/button";

import { useLocale } from "@/components/locale-provider";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { handleServerAction } from "@/lib/utils";
import { createTask, updateTask } from "@/servers/tasks";
import { Project, Task } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Input } from "./ui/input";

import { cn } from "@/lib/utils";

import { FieldError } from "@/components/ui/field";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formSchema = validations["update-task"];
type FormSchema = z.infer<typeof formSchema>;

type TaskCreateEditButtonProps = {
  task: Partial<Pick<Task, "id" | "title" | "description" | "status">> | null;
  project: Pick<Project, "id">;
  columns: any;
} & ButtonProps;

export function TaskCreateEditButton({
  task,
  project,
  columns,
  ...props
}: TaskCreateEditButtonProps) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { "/p/[id]": t, cmn } = useLocale();

  const isEditing = !!task?.id;
  const defaultValues: FormSchema = {
    title: task?.title ?? "",
    description: task?.description ?? "",
    status: task?.status ?? TaskStatus.TODO,
  };

  const form = useForm<FormSchema>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const onSubmit = async (values: FormSchema) => {
    setOpen(true);
    await handleServerAction(
      () => {
        if (isEditing && task?.id) {
          return updateTask({
            ...values,
            id: task?.id,
            projectId: project?.id,
          });
        } else {
          return createTask({
            ...values,
            projectId: project?.id,
            title: values?.title!,
          });
        }
      },
      {
        form,
        setLoading,
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        form.reset(defaultValues);
      }}>
      <AlertDialogTrigger asChild>
        <Button {...props}>
          {props?.children ?? (
            <>{isEditing ? t["Edit Task"] : t["Add New Task"]}</>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isEditing ? t["Edit Task"] : t["Add New Task"]}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t["Are you sure you want to delete this task?"]}
                <br />
                {t["This will be deleted forever."]}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex flex-col gap-4">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>{t["Title"]}</FieldLabel>
                    <Input
                      {...field}
                      autoFocus
                      aria-invalid={fieldState.invalid}
                      id={field.name}
                      name={field.name}
                      disabled={loading}
                      placeholder={t["10 Day Workout Challenge"]}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t["Description"]}
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        aria-invalid={fieldState.invalid}
                        id={field.name}
                        name={field.name}
                        disabled={loading}
                        rows={6}
                        className="max-h-40 min-h-24 resize-none"
                        placeholder={
                          t[
                            "A 10 day workout routine designed to help you achieve your fitness goal."
                          ]
                        }
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field?.value?.length ?? 0}/256 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>{t["Status"]}</FieldLabel>

                    <Select
                      {...field}
                      aria-invalid={fieldState.invalid}
                      name={field.name}
                      disabled={loading}
                      onValueChange={(v) => field?.onChange(v)}>
                      <SelectTrigger
                        id={field.name}
                        name={field.name}
                        disabled={loading}
                        className="w-full">
                        <SelectValue placeholder={t["choose status..."]} />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map((col: any) => (
                          <SelectItem key={col.id} value={col.id}>
                            <span
                              className={cn(
                                "bg-primary size-4 rounded-full",
                                col.color
                              )}
                            />
                            {col.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>
                {cmn["Cancel"]}
              </AlertDialogCancel>
              <Field>
                <Button type="submit" disabled={loading}>
                  {isEditing ? t["Update Task"] : t["Add Task"]}
                </Button>
              </Field>
              {/* <AlertDialogAction>Continue</AlertDialogAction> */}
            </AlertDialogFooter>
          </FieldGroup>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
