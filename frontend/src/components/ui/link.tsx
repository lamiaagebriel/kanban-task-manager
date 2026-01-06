"use client";

import { cn } from "@/lib/utils";
import NextLink, { LinkProps as NextLinkProps } from "next/link";

export type LinkProps = NextLinkProps &
  React.ComponentPropsWithoutRef<typeof NextLink> & {
    href: string;
    disabled?: boolean;
  };
export function Link({ href, disabled, className, ...props }: LinkProps) {
  const isInternalLink = href?.startsWith("/");
  const isAnchorLink = href?.startsWith("#");

  if (isInternalLink || isAnchorLink) {
    return (
      <NextLink
        href={disabled ? "#" : href}
        className={cn(disabled && "cursor-not-allowed opacity-70", className)}
        {...props}
      />
    );
  }

  return (
    <NextLink
      href={disabled ? "#" : href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "items-center gap-2 underline",
        disabled && "cursor-not-allowed opacity-70",
        className
      )}
      {...props}
    />
  );
}
