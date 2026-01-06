import { getAuth } from "@/lib/auth";
import { Paths } from "@/lib/const";
import { redirect } from "next/navigation";

type AuthLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const { user } = await getAuth();
  if (user) redirect(Paths.Dashboard);

  return <>{children}</>;
}
