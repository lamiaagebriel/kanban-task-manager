import { cva, VariantProps } from "class-variance-authority";
import {
  CheckCheck,
  Edit2,
  FolderCode,
  GalleryVerticalEnd,
  Globe,
  GripVertical,
  Laptop,
  Loader2,
  LogOut,
  Moon,
  Plus,
  Projector,
  Sun,
  Trash2,
  User,
  X,
  type LucideProps,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

export const IconsVariants = cva("size-4 shrink-0");
export type IconProps = {} & LucideProps & VariantProps<typeof IconsVariants>;
export type Icon = keyof typeof Icons;

export const Icons = {
  logo: ({ className, ...props }: IconProps) => (
    <div
      className={cn(
        buttonVariants({ size: "icon" }),
        "size-auto rounded-md p-2"
      )}>
      <GalleryVerticalEnd
        className={cn(IconsVariants({}), className)}
        {...props}
      />
    </div>
  ),
  project: ({ className, ...props }: IconProps) => (
    <Projector className={cn(IconsVariants({}), className)} {...props} />
  ),
  spinner: ({ className, ...props }: IconProps) => (
    <Loader2
      className={cn(IconsVariants({}), "animate-spin", className)}
      {...props}
    />
  ),
  x: ({ className, ...props }: IconProps) => (
    <X className={cn(IconsVariants({}), className)} {...props} />
  ),
  plus: ({ className, ...props }: IconProps) => (
    <Plus className={cn(IconsVariants({}), className)} {...props} />
  ),
  edit: ({ className, ...props }: IconProps) => (
    <Edit2 className={cn(IconsVariants({}), className)} {...props} />
  ),
  trash: ({ className, ...props }: IconProps) => (
    <Trash2 className={cn(IconsVariants({}), className)} {...props} />
  ),
  grip: ({ className, ...props }: IconProps) => (
    <GripVertical className={cn(IconsVariants({}), className)} {...props} />
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
  sun: ({ className, ...props }: IconProps) => (
    <Sun className={cn(IconsVariants({}), className)} {...props} />
  ),
  moon: ({ className, ...props }: IconProps) => (
    <Moon className={cn(IconsVariants({}), className)} {...props} />
  ),
  laptop: ({ className, ...props }: IconProps) => (
    <Laptop className={cn(IconsVariants({}), className)} {...props} />
  ),
  globe: ({ className, ...props }: IconProps) => (
    <Globe className={cn(IconsVariants({}), className)} {...props} />
  ),
  check: ({ className, ...props }: IconProps) => (
    <CheckCheck className={cn(IconsVariants({}), className)} {...props} />
  ),
};
