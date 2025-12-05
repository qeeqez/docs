import type {ComponentPropsWithoutRef} from "react";
import {ScrollArea, ScrollViewport} from "@/components/ui/scroll-area";
import {cn} from "@/lib/cn";

type Props = ComponentPropsWithoutRef<typeof ScrollArea>;

export function SidebarViewport(props: Props) {
  return (
    <ScrollArea {...props} className={cn("h-full", props.className)}>
      <ScrollViewport
        className="p-4 py-8 overscroll-contain"
        style={
          {
            "--sidebar-item-offset": "calc(var(--spacing) * 2)",
            maskImage: "linear-gradient(to bottom, transparent, white 12px, white calc(100% - 12px), transparent)",
          } as object
        }
      >
        {props.children}
      </ScrollViewport>
    </ScrollArea>
  );
}
