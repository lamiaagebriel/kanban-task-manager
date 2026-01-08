import type { Metadata } from "next";

import { LoginForm } from "@/components/login-form";
import { Icons } from "@/components/ui/icons";
import { getDictionary } from "@/servers/locale";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const { "/login": c } = await getDictionary();
  return { title: c["Login"] };
}
export default async function Login() {
  const { site } = await getDictionary();

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">
            <Icons.logo />

            {site["name"]}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <Image
          height={9999999999}
          width={99999999999}
          src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
