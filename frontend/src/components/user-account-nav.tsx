"use client";

import { cn, handleServerAction } from "@/lib/utils";
import { logout } from "@/servers/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";
import { Link } from "@/components/ui/link";
import { Paths } from "@/lib/const";
import React from "react";
import { useAuth } from "./auth-provider";
import { useLocale } from "./locale-provider";

type UserAccountNavProps = {
  items?: {
    value: string;
    children: string | React.ReactNode;
    disabled?: boolean;
    icon?: keyof typeof Icons;
    // color?: string;
  }[];
};

export function UserAccountNav({ items = [] }: UserAccountNavProps) {
  const { user } = useAuth();
  const { cmn } = useLocale();
  const [loading, setLoading] = React.useState(false);

  if (!user)
    return (
      <Link href={Paths.Login} className={buttonVariants({ size: "sm" })}>
        {cmn["Sign up"]}
      </Link>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "rounded-full"
          )}>
          <AvatarImage src={(user as any)?.image!} alt={user?.name ?? ""} />
          <AvatarFallback className="bg-transparent">
            <Icons.user />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        sideOffset={4}
        className="w-48">
        <DropdownMenuLabel>
          <h2>{user?.name}</h2>
          <p className="text-muted-foreground line-clamp-1 truncate text-xs">
            {user?.email}
          </p>
        </DropdownMenuLabel>

        {items?.length ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {items?.map((e, i) => {
                const Icon = e?.icon ? (Icons[e?.icon] ?? null) : null;

                return (
                  <Link key={i} href={e?.value}>
                    <DropdownMenuItem>
                      {Icon && <Icon />}
                      {e?.children}
                    </DropdownMenuItem>
                  </Link>
                );
              })}
            </DropdownMenuGroup>
          </>
        ) : null}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Button
            onClick={async () => {
              await handleServerAction(logout, {
                setLoading,
              });
            }}
            disabled={loading}
            variant="ghost"
            className="focus-visible:ring-none w-full justify-start text-start focus:outline-none focus-visible:ring-0">
            {loading ? <Icons.spinner /> : <Icons.logout />}
            {cmn["Logout"]}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
