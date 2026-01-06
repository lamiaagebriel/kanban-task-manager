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
import { getAuth } from "@/lib/auth";
import { getDictionary } from "@/servers/locale";

import { api } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Icons } from "@/components/ui/icons";

export async function generateMetadata(): Promise<Metadata> {
  const { "/dashboard": c } = await getDictionary();
  return { title: c["Dashboard"] };
}

export default async function Dashboard() {
  const user = (await getAuth())?.user!;

  const { "/dashboard": c } = await getDictionary();
  const {
    data: { projects },
  } = await api.projects.getMany({
    userId: user?.id,
  });
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
              {!!projects?.length && <Button>{c["Create Project"]}</Button>}
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
              <Button>{c["Create Project"]}</Button>
            </EmptyContent>
          </Empty>
        )}

        {!!projects?.length && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((e, i) => (
              <Link key={i} href={`/p/${e?.id}`}>
                <Card className="bg-background">
                  <CardHeader className="flex flex-row items-center justify-between gap-2">
                    <CardTitle>{e.name}</CardTitle>
                    <CardDescription>
                      {new Date(e.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {e.description && (
                      <CardDescription>{e.description}</CardDescription>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
