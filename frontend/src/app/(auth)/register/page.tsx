import type { Metadata } from "next";

import { getDictionary } from "@/servers/locale";

export async function generateMetadata(): Promise<Metadata> {
  const { "/register": c } = await getDictionary();
  return { title: c["Register"] };
}
export default async function Register() {
  const { "/register": c } = await getDictionary();

  return (
    <div className="min-h-screen flex-1">
      <div className="container">
        <h1>{c["Register"]}</h1>
      </div>
    </div>
  );
}
