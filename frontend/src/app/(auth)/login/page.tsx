import type { Metadata } from "next";

import { getDictionary } from "@/servers/locale";

export async function generateMetadata(): Promise<Metadata> {
  const { "/login": c } = await getDictionary();
  return { title: c["Login"] };
}
export default async function Login() {
  const { "/login": c } = await getDictionary();

  return (
    <div className="min-h-screen flex-1">
      <div className="container">
        <h1>{c["Login"]}</h1>
      </div>
    </div>
  );
}
