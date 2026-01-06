import { getAuth } from "@/lib/auth";
import { Paths } from "@/lib/const";
import { redirect } from "next/navigation";

type DashboardLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { user } = await getAuth();
  if (!user) redirect(Paths.Login);
  return <>{children}</>;
}
