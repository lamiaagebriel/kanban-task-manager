"use client";

import * as React from "react";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { validations } from "@/lib/validations";
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
import { createProject, updateProject } from "@/servers/projects";
import { Project } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Input } from "./ui/input";

import { FieldError } from "@/components/ui/field";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";

const formSchema = validations["update-project"];
type FormSchema = z.infer<typeof formSchema>;

type ProjectCreateEditButtonProps = {
  project: Partial<Pick<Project, "id" | "name" | "description">> | null;
} & ButtonProps;

export function ProjectCreateEditButton({
  project,
  ...props
}: ProjectCreateEditButtonProps) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { "project-create-button": t, cmn } = useLocale();

  const isEditing = !!project?.id;
  const defaultValues: FormSchema = {
    name: project?.name ?? "",
    description: project?.description ?? "",
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
        if (isEditing && project?.id) {
          return updateProject({
            ...values,
            id: project?.id,
          });
        } else {
          return createProject({ ...values });
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
            <>{isEditing ? t["Edit Project"] : t["Add New Project"]}</>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isEditing ? t["Edit Project"] : t["Add New Project"]}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {
                  t[
                    "Create a new project in Kanboard by entering the project name below."
                  ]
                }
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex flex-col gap-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>{t["Name"]}</FieldLabel>
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
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>
                {cmn["Cancel"]}
              </AlertDialogCancel>
              <Field>
                <Button type="submit" disabled={loading}>
                  {isEditing ? t["Update Project"] : t["Add Project"]}
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
