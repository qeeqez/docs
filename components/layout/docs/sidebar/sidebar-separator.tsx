import type {ComponentProps} from "react";
import {cn} from "@/lib/cn";

export function SidebarSeparator(props: ComponentProps<"p">) {
  return (
    <h5
      {...props}
      className={cn(
        "flex items-center gap-2.5 mb-3.5 lg:mb-2.5 ps-(--sidebar-item-offset) text-gray-900 dark:text-gray-200 text-sm font-medium empty:mb-0 [&_svg]:size-4 [&_svg]:shrink-0",
        props.className
      )}
    >
      {props.children}
    </h5>
  );
}
