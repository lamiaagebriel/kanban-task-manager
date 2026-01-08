import { redirect } from "next/navigation";

import { getAuth } from "@/lib/auth";
import { getDictionary } from "@/servers/locale";

import { LocaleSwitcher } from "@/components/locale-provider";
import { ModeSwitcher } from "@/components/theme-provider";
import { Icons } from "@/components/ui/icons";
import { UserAccountNav } from "@/components/user-account-nav";
import { Paths } from "@/lib/const";

type DashboardLayoutProps = React.PropsWithChildren<{}>;
export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { user } = await getAuth();
  if (!user) redirect(Paths.Login);

  const { site } = await getDictionary();

  return (
    <div className="bg-muted/50 flex min-h-screen flex-col">
      <header className="bg-background text-foreground z-20 flex flex-col gap-4 py-4">
        <div className="container flex items-center justify-between gap-4">
          <div className="flex justify-center gap-2 md:justify-start">
            <div className="flex items-center gap-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <Icons.logo />
              </div>
              {site["name"]}
            </div>
          </div>

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
