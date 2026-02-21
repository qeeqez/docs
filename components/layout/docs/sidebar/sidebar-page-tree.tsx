"use client";

import type {Node} from "fumadocs-core/page-tree";
import {useTreeContext} from "fumadocs-ui/contexts/tree";
import {Fragment, type ReactNode, useMemo} from "react";
import {SidebarItem} from "@/components/layout/docs/sidebar/sidebar-item";
import {PageTreeFolder} from "@/components/layout/docs/sidebar/sidebar-page-tree-folder";
import {SidebarSeparator} from "@/components/layout/docs/sidebar/sidebar-separator";
import {cn} from "@/lib/cn";

function SidebarNodeList({items, level}: {items: Node[]; level: number}): ReactNode {
  return items.map((item, i) => {
    if (item.type === "separator") {
      return (
        <SidebarSeparator key={item.$id ?? `separator-${i}`} className={cn(i !== 0 && "mt-6 lg:mt-8")}>
          {item.icon}
          {item.name}
        </SidebarSeparator>
      );
    }

    if (item.type === "folder") {
      return (
        <PageTreeFolder key={item.$id ?? `folder-${i}`} item={item}>
          <SidebarNodeList items={item.children} level={level + 1} />
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

export function SidebarPageTree() {
  const {root} = useTreeContext();
  return useMemo(() => {
    return (
      <Fragment key={root.$id}>
        <SidebarNodeList items={root.children} level={1} />
      </Fragment>
    );
  }, [root]);
}
