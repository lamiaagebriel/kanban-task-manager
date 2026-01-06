"use client";

import * as React from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { validations } from "@/lib/validations";
import { Button } from "./ui/button";

import { useLocale } from "@/components/locale-provider";
import { Link } from "@/components/ui/link";
import { Paths } from "@/lib/const";
import { handleServerAction } from "@/lib/utils";
import { registerWithPassword } from "@/servers/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const formSchema = validations["register-with-password"]
  .extend({
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(100, "Password must be at most 100 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
type FormSchema = z.infer<typeof formSchema>;

export function RegisterForm() {
  const [loading, setLoading] = React.useState(false);
  const { "/register": t, cmn } = useLocale();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormSchema) => {
    await handleServerAction(registerWithPassword, { form, setLoading })(
      values
    );
    redirect(Paths.Dashboard);
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t["Create your account"]}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t["Fill in the form below to create your account"]}
          </p>
        </div>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{t["Name"]}</FieldLabel>
              <Input
                {...field}
                type="text"
                aria-invalid={fieldState.invalid}
                id={field.name}
                name={field.name}
                placeholder="John Doe"
                disabled={loading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{t["Email"]}</FieldLabel>
              <Input
                {...field}
                type="email"
                aria-invalid={fieldState.invalid}
                id={field.name}
                name={field.name}
                placeholder="m@example.com"
                disabled={loading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}> {t["Password"]}</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id={field.name}
                name={field.name}
                type="password"
                disabled={loading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {t["Confirm Password"]}
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id={field.name}
                name={field.name}
                type="password"
                disabled={loading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={loading}>
            {t["Create Account"]}
          </Button>
        </Field>
        <FieldDescription className="text-center">
          {t["Already have an account?"]}{" "}
          <Link href="/login">{t["Sign in"]}</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
