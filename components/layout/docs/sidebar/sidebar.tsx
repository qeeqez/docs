'use client';

import {SidebarPageTree} from "@/components/layout/docs/sidebar/sidebar-page-tree";
import {SidebarProvider} from "@/components/layout/docs/sidebar/sidebar-provider";

export function Sidebar() {
  return (
    <div className="text-sm">
      <SidebarProvider>
        <SidebarPageTree/>
      </SidebarProvider>
    </div>
  )
}
