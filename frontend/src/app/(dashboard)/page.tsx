import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";
import { getDictionary } from "@/servers/locale";

import { api } from "@/api";
import { ProjectCreateButton } from "@/components/project-create-button";
import { ProjectDeleteButton } from "@/components/project-delete-button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Icons } from "@/components/ui/icons";
import { Paths } from "@/lib/const";
import { formatDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { "/dashboard": c } = await getDictionary();
  return { title: c["Dashboard"] };
}

export default async function Dashboard() {
  const { locale, "/dashboard": c } = await getDictionary();

  const response = await api.projects.findAll();
  const projects =
    !!response?.ok && response?.data?.projects?.length
      ? response.data.projects
      : [];

  return (
    <main className="flex-1">
      <div className="container flex flex-1 flex-col py-6">
        <div>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                {c["Dashboard"]}
              </h2>
              <p className="text-muted-foreground max-w-prose text-sm">
                {c["create, browse, edit, and filter all projects easily."]}
              </p>
            </div>

            <div>{!!projects?.length && <ProjectCreateButton />}</div>
          </div>

          <Separator className="my-4" />
        </div>
      </div>

      <div className="container space-y-4">
        {!projects?.length && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Icons.folder />
              </EmptyMedia>
              <EmptyTitle>{c["No Projects Yet"]}</EmptyTitle>
              <EmptyDescription>
                {
                  c[
                    "You haven't created any projects yet. Get started by creating your first project."
                  ]
                }
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <ProjectCreateButton />
            </EmptyContent>
          </Empty>
        )}

        {!!projects?.length && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((e, i) => (
              <Card key={i} className="bg-background gap-2 p-2">
                <CardHeader className="flex flex-row items-center justify-between gap-2 px-2">
                  <div>
                    <Link
                      href={`${Paths.Projects}/${e?.id}`}
                      className="line-clamp-2 underline">
                      <CardTitle className="mb-1">{e.name}</CardTitle>
                    </Link>
                    <CardDescription className="text-xs">
                      {formatDate(e.createdAt, { locale, type: "distance" })}
                    </CardDescription>
                  </div>
                  <ProjectDeleteButton
                    project={e}
                    size="sm"
                    variant="destructive"
                    className="h-6"
                  />
                </CardHeader>
                <CardContent className="px-2">
                  {e.description && (
                    <CardDescription className="line-clamp-2">
                      {e.description}
                    </CardDescription>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
