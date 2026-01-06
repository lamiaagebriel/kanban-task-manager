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
import { loginWithPassword } from "@/servers/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const formSchema = validations["login-with-password"];
type FormSchema = z.infer<typeof formSchema>;

export function LoginForm() {
  const [loading, setLoading] = React.useState(false);
  const { "/login": t, cmn } = useLocale();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormSchema) => {
    await handleServerAction(loginWithPassword, { form, setLoading })(values);

    redirect(Paths.Dashboard);
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t["Login to your account"]}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t["Enter your email below to login to your account"]}
          </p>
        </div>

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{t["Email"]}</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id={field.name}
                name={field.name}
                type="email"
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
              <div className="flex items-center">
                <FieldLabel htmlFor={field.name}> {t["Password"]}</FieldLabel>

                {/* <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline">
                  {t["Forgot your password?"]}
                </a> */}
              </div>
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
            {cmn["Continue"]}
          </Button>
        </Field>
        <FieldDescription className="text-center">
          {t["Don't have an account?"]}{" "}
          <Link href="/register">{t["Sign up"]}</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
