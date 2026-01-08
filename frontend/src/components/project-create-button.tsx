"use client";

import * as React from "react";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { validations } from "@/lib/validations";
import { Button } from "./ui/button";

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
import { createProject } from "@/servers/projects";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";

const formSchema = validations["create-project"];
type FormSchema = z.infer<typeof formSchema>;

export function ProjectCreateButton() {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { "project-create-button": t, cmn } = useLocale();

  const defaultValues = {
    name: "",
    description: "",
  };
  const form = useForm<FormSchema>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: FormSchema) => {
    setOpen(true);
    await handleServerAction(() => createProject(values), {
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
        <Button>{t["Create Project"]}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <AlertDialogHeader>
              <AlertDialogTitle>{t["Create Project"]}</AlertDialogTitle>
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
                        placeholder="I'm having an issue with the login button on mobile."
                        rows={6}
                        className="max-h-40 min-h-24 resize-none"
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
