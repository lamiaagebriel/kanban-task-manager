import { redirect } from "next/navigation";

import { getAuth } from "@/lib/auth";
import { getDictionary } from "@/servers/locale";

import { Icons } from "@/components/ui/icons";
import { UserAccountNav } from "@/components/user-account-nav";

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

type ProjectLayoutProps = React.PropsWithChildren<{}>;
export default async function ProjectLayout({ children }: ProjectLayoutProps) {
  const { user } = await getAuth();
  if (!user) redirect(Paths.Login);

  const { site } = await getDictionary();
  const project = { id: 36, name: "10 Days Workout" };
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
            {/* <ModeSwitcherDropdownMenu /> */}
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
