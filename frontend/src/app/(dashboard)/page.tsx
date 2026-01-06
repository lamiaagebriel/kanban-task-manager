import type { Metadata } from "next";

import { UserNav } from "@/components/user-nav";
import { getDictionary } from "@/servers/locale";

export async function generateMetadata(): Promise<Metadata> {
  const { "/dashboard": c } = await getDictionary();
  return { title: c["Dashboard"] };
}

export default async function Dashboard() {
  const { "/dashboard": c } = await getDictionary();

  return (
    <div className="min-h-screen flex-1">
      <div className="container">
        <h1>{c["Dashboard"]}</h1>
        <UserNav />
      </div>
    </div>
  );
}
