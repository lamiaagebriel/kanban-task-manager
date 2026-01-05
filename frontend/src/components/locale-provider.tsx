"use client";

import * as React from "react";

import { Dictionary, Locale } from "@/lib/locale";

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
