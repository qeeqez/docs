"use client";

import {SidebarPageTree} from "@/components/layout/docs/sidebar/sidebar-page-tree";
import {SidebarProvider} from "@/components/layout/docs/sidebar/sidebar-provider";
import {cn} from "@/lib/cn";

interface Props {
  className?: string;
}

export function Sidebar({className}: Props) {
  return (
    // <div className={cn("text-sm", className)}>
      <SidebarProvider>
        <SidebarPageTree/>
      </SidebarProvider>
    // </div>
  );
}
