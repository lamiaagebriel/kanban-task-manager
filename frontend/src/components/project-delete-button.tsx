"use client";

import * as React from "react";

import { Field, FieldGroup } from "@/components/ui/field";
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
import { deleteProject } from "@/servers/projects";
import { Project } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Icons } from "./ui/icons";

const formSchema = validations["target-project-by-id"];
type FormSchema = z.infer<typeof formSchema>;

type ProjectDeleteButtonProps = { project: Pick<Project, "id"> } & ButtonProps;

export function ProjectDeleteButton({
  project,
  ...props
}: ProjectDeleteButtonProps) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { "project-delete-button": t, cmn } = useLocale();

  const defaultValues = { id: project?.id! };
  const form = useForm<FormSchema>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: FormSchema) => {
    setOpen(true);
    await handleServerAction(() => deleteProject(values), {
      form,
      setLoading,
      onSuccess: () => {
        form.reset(defaultValues);
        setOpen(false);
      },
    });
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
            <>
              <Icons.x />
              {cmn["Delete"]}
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <AlertDialogHeader>
              <AlertDialogTitle>{t["Delete Project"]}</AlertDialogTitle>
              <AlertDialogDescription>
                {t["Are you sure you want to delete this project?"]}
                <br />
                {t["This will be deleted forever."]}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>
                {cmn["Cancel"]}
              </AlertDialogCancel>
              <Field>
                <Button type="submit" variant="destructive" disabled={loading}>
                  {cmn["Continue"]}
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
