import "./globals.css";

import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import { getDictionary } from "@/servers/locale";

import { AuthProvider } from "@/components/auth-provider";
import { LocaleProvider } from "@/components/locale-provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getAuth } from "@/lib/auth";

const inter = Inter({ subsets: ["latin", "latin-ext"] });
const cairo = Cairo({ subsets: ["arabic", "latin", "latin-ext"] });

export async function generateMetadata(): Promise<Metadata> {
  const { site: c } = await getDictionary();

  return {
    title: { template: `%s | ${c?.name}`, default: `${c?.name}` },
    description: c?.description,
  };
}
type RootLayoutProps = React.PropsWithChildren<{}>;
export default async function RootLayout({ children }: RootLayoutProps) {
  const { locale, isRTL, ...dic } = await getDictionary();
  const authValue = await getAuth();

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={cn(
        "",
        // inter?.className,
        cairo?.className
      )}
      suppressHydrationWarning>
      <body>
        <LocaleProvider value={{ ...dic, isRTL, locale }}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <AuthProvider value={authValue}>
              {children}
              <Toaster />
              <TailwindIndicator />
            </AuthProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
