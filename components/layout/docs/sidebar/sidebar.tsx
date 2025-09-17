"use client";

import {SidebarPageTree} from "@/components/layout/docs/sidebar/sidebar-page-tree";
import {SidebarProvider} from "@/components/layout/docs/sidebar/sidebar-provider";

export function Sidebar() {
  return (
    <SidebarProvider>
      <SidebarPageTree/>
    </SidebarProvider>
  );
}
