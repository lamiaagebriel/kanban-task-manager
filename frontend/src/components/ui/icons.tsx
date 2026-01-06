import { cva, VariantProps } from "class-variance-authority";
import {
  FolderCode,
  GalleryVerticalEnd,
  Loader2,
  LogOut,
  User,
  type LucideProps,
} from "lucide-react";

import { cn } from "@/lib/utils";

export const IconsVariants = cva("size-4 shrink-0");
export type IconProps = {} & LucideProps & VariantProps<typeof IconsVariants>;
export type Icon = keyof typeof Icons;

export const Icons = {
  logo: ({ className, ...props }: IconProps) => (
    <GalleryVerticalEnd
      className={cn(IconsVariants({}), className)}
      {...props}
    />
  ),
  spinner: ({ className, ...props }: IconProps) => (
    <Loader2
      className={cn(IconsVariants({}), "animate-spin", className)}
      {...props}
    />
  ),
  user: ({ className, ...props }: IconProps) => (
    <User className={cn(IconsVariants({}), className)} {...props} />
  ),
  logout: ({ className, ...props }: IconProps) => (
    <LogOut className={cn(IconsVariants({}), className)} {...props} />
  ),
  folder: ({ className, ...props }: IconProps) => (
    <FolderCode className={cn(IconsVariants({}), className)} {...props} />
  ),
};
