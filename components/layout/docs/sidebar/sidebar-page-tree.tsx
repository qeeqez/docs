"use client";

import type {Node} from "fumadocs-core/page-tree";
import {useTreeContext} from "fumadocs-ui/contexts/tree";
import {Fragment, type ReactNode, useMemo} from "react";
import {SidebarItem} from "@/components/layout/docs/sidebar/sidebar-item";
import {PageTreeFolder} from "@/components/layout/docs/sidebar/sidebar-page-tree-folder";
import {SidebarSeparator} from "@/components/layout/docs/sidebar/sidebar-separator";
import {cn} from "@/lib/cn";

export function SidebarPageTree() {
  const {root} = useTreeContext();
  return useMemo(() => {
    function renderSidebarList(items: Node[], level: number): ReactNode[] {
      return items.map((item, i) => {
        if (item.type === "separator") {
          return (
            <SidebarSeparator key={i} className={cn(i !== 0 && "mt-6 lg:mt-8")}>
              {item.icon}
              {item.name}
            </SidebarSeparator>
          );
        }

        if (item.type === "folder") {
          const children = renderSidebarList(item.children, level + 1);
          return (
            <PageTreeFolder key={i} item={item}>
              {children}
            </PageTreeFolder>
          );
        }

        return (
          <SidebarItem key={item.url} href={item.url} external={item.external} icon={item.icon}>
            {item.name}
          </SidebarItem>
        );
      });
    }

    return <Fragment key={root.$id}>{renderSidebarList(root.children, 1)}</Fragment>;
  }, [root]);
}
