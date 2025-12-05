"use client";

import type {ComponentProps} from "react";
import {SidebarViewport} from "@/components/layout/docs/sidebar/sidebar-viewport";
import {cn} from "@/lib/cn";

export function SidebarWrapper({children, className}: ComponentProps<"aside">) {
  return (
    <aside
      className={cn(
        "group/aside",
        "flex flex-col grow-0 shrink-0",
        "sticky top-(--height-header) h-(--sidebar-height) max-h-(--sidebar-height)",
        "w-sidebar",
        "overflow-y-auto",
        "motion-safe:transition-[width,max-width,margin,opacity,display] motion-safe:duration-300 motion-safe:transition-discrete",
        className
      )}
    >
      <SidebarViewport>{children}</SidebarViewport>
    </aside>
  );
}
