import { notFound, redirect } from "next/navigation";

import { getAuth } from "@/lib/auth";
import { getDictionary } from "@/servers/locale";

import { Icons } from "@/components/ui/icons";
import { UserAccountNav } from "@/components/user-account-nav";

import { api } from "@/api";
import { LocaleSwitcher } from "@/components/locale-provider";
import { ModeSwitcher } from "@/components/theme-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Paths } from "@/lib/const";
import { SelectItem } from "@/types";
import React from "react";

type ProjectLayoutProps = React.PropsWithChildren<{
  params: Promise<{ id: string }>;
}>;
export default async function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const { id: projectId } = await params;
  const { user } = await getAuth();
  if (!user) redirect(Paths.Login);

  const response_ = await api.projects.findOne({ id: projectId });
  const project =
    !!response_?.ok && !!response_?.data?.project
      ? response_.data.project
      : null;
  if (!project) throw notFound();

  const { site } = await getDictionary();
  return (
    <div className="bg-muted/50 flex min-h-screen flex-col">
      <header className="bg-background text-foreground z-20 flex flex-col gap-4 py-4">
        <div className="container flex items-center justify-between gap-4">
          <Breadcrumbs
            items={[
              {
                value: Paths.Dashboard,
                children: (
                  <div className="flex items-center gap-2">
                    <Icons.logo />

                    <h1 className="hidden font-semibold sm:block">
                      {site["name"]}
                    </h1>
                  </div>
                ),
              },
              {
                value: `${Paths.Projects}/${project?.id}`,
                children: (
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback>
                        <Icons.project />
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="line-clamp-1 font-semibold">
                      {project?.name}
                    </h1>
                  </div>
                ),
              },
            ]}
          />
          <div className="flex items-center gap-2">
            <ModeSwitcher />
            <LocaleSwitcher />
            <UserAccountNav />
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
function Breadcrumbs({
  items,
  ...props
}: React.ComponentPropsWithoutRef<"nav"> & {
  separator?: React.ReactNode;
  items: SelectItem[];
}) {
  return (
    <Breadcrumb {...props}>
      <BreadcrumbList>
        {items?.map((e, i) => (
          <React.Fragment key={i}>
            <BreadcrumbItem>
              {i + 1 == items?.length ? (
                <BreadcrumbPage {...e} />
              ) : (
                <BreadcrumbLink href={e?.value} {...e} />
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator className="last:hidden">/</BreadcrumbSeparator>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
