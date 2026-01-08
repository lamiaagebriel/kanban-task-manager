import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getDictionary } from "@/servers/locale";

import { api } from "@/api";
import { ProjectCreateEditButton } from "@/components/project-create-button";
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
import { Link } from "@/components/ui/link";
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

            <div>
              {!!projects?.length && <ProjectCreateEditButton project={null} />}
            </div>
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
              <ProjectCreateEditButton project={null} />
            </EmptyContent>
          </Empty>
        )}

        {!!projects?.length && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((e, i) => (
              <Card
                key={i}
                className="flex flex-row items-start gap-2 border-2 p-4">
                <div className="flex-1">
                  <Link
                    href={`${Paths.Projects}/${e?.id}`}
                    className="line-clamp-2 text-base font-semibold underline">
                    {e.name}
                  </Link>

                  {e?.description && (
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {e.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground text-xs">
                      {formatDate(e?.createdAt, { locale })}
                    </span>

                    <div className="flex items-center gap-1">
                      <ProjectCreateEditButton
                        project={e}
                        variant="ghost"
                        size="icon"
                        className="rounded-full">
                        <Icons.edit />
                      </ProjectCreateEditButton>
                      <ProjectDeleteButton
                        project={e}
                        variant="ghost"
                        size="icon"
                        className="rounded-full">
                        <Icons.x className="text-destructive" />
                      </ProjectDeleteButton>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
