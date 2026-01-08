"use client";

import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dictionary, i18n, Locale } from "@/lib/locale";
import { handleServerAction } from "@/lib/utils";
import { localeSwitcher } from "@/servers/locale";
import { Button } from "./ui/button";
import { Icons } from "./ui/icons";

type LocaleContextProps = Dictionary & { locale: Locale; isRTL: boolean };
type LocaleProviderProps = React.PropsWithChildren<{
  value: LocaleContextProps;
}>;

const LocaleContext = React.createContext<LocaleContextProps | null>(null);
export function LocaleProvider({ value, ...props }: LocaleProviderProps) {
  return <LocaleContext.Provider value={value} {...props} />;
}

export function useLocale() {
  const context = React.useContext(LocaleContext);
  if (!context)
    throw new Error("useLocale must be used within a LocaleProvider");

  return context;
}

export function LocaleSwitcher({}) {
  const { locale } = useLocale();
  const [loading, setLoading] = React.useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          disabled={loading}>
          {loading ? <Icons.spinner /> : <Icons.globe />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {i18n?.locales?.map((e, i) => (
            <DropdownMenuItem
              key={i}
              disabled={loading || e == locale}
              onClick={async () => {
                await handleServerAction(localeSwitcher({ locale: e }), {
                  setLoading,
                });
              }}>
              {e}

              {locale === e && (
                <DropdownMenuShortcut>
                  <Icons.check />
                </DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
