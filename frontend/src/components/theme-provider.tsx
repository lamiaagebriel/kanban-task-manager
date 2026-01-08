"use client";

import * as React from "react";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

import { useLocale } from "@/components/locale-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { Icons } from "./ui/icons";

export function ThemeProvider({
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} />;
}

export function ModeSwitcher({ ...props }: ButtonProps) {
  const { "mode-switcher": c } = useLocale();
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          {...props}>
          <Icons.sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Icons.moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">
            {c["automatically switch between day and night themes."]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {[
            { value: "light", label: c["light"], Icon: Icons.sun },
            { value: "dark", label: c["dark"], Icon: Icons.moon },
            { value: "system", label: c["system"], Icon: Icons.laptop },
          ].map(({ Icon, ...e }, i) => (
            <DropdownMenuItem key={i} onClick={async () => setTheme(e?.value)}>
              <Icon />
              {e?.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
