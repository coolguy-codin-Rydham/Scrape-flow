"use client";

import { cn } from "@/lib/utils";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { LucideIcon } from "lucide-react";
import { Separator } from "./ui/separator";

interface Props {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;

  iconClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const CustomDialogHeader = (props: Props) => {
  const Icon = props.icon;
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-2">
          {Icon && (
            <Icon
              size={30}
              className={cn("stroke-primary", props.iconClassName)}
            />
          )}
          {props.title && (
            <h2 className={cn("text-xl text-primary", props.titleClassName)}>
              {props.title}
            </h2>
          )}
          {props.subtitle && (
            <h2
              className={cn(
                "text-sm text-muted-foreground",
                props.subtitleClassName,
              )}
            >
              {props.subtitle}
            </h2>
          )}
        </div>
      </DialogTitle>
      <Separator />
    </DialogHeader>
  );
};

export default CustomDialogHeader;
