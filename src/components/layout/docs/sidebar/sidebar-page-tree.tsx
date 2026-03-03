"use client";

import type {Node} from "fumadocs-core/page-tree";
import {useRouter} from "@tanstack/react-router";
import {useTreeContext} from "fumadocs-ui/contexts/tree";
import type {ReactNode} from "react";
import {useEffect, useMemo} from "react";
import {SidebarItem} from "@/components/layout/docs/sidebar/sidebar-item";
import {PageTreeFolder} from "@/components/layout/docs/sidebar/sidebar-page-tree-folder";
import {SidebarSeparator} from "@/components/layout/docs/sidebar/sidebar-separator";
import {preloadAPIPageRuntime} from "@/components/mdx/api-page";
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
      <SidebarItem key={item.$id ?? item.url} href={item.url} external={item.external} icon={item.icon}>
        {item.name}
      </SidebarItem>
    );
  });
}

export function SidebarPageTree() {
  const router = useRouter();
  const {root} = useTreeContext();
  const pageUrls = useMemo(() => collectPageUrls(root.children), [root.children]);

  useEffect(() => {
    const isApiTree = pageUrls.length > 0 && pageUrls.every((item) => item.includes("/api/"));
    if (!isApiTree) return;

    let cancelled = false;
    const warm = async () => {
      await preloadAPIPageRuntime();
      if (cancelled) return;
      await Promise.allSettled(pageUrls.map((to) => router.preloadRoute({to})));
    };

    void warm();
    return () => {
      cancelled = true;
    };
  }, [pageUrls, router]);

  return <>{SidebarNodeList({items: root.children, level: 1})}</>;
}

function collectPageUrls(items: Node[]): string[] {
  const result: string[] = [];
  const walk = (nodes: Node[]) => {
    for (const node of nodes) {
      if (node.type === "page") {
        result.push(node.url);
        continue;
      }

      if (node.type === "folder") {
        if (node.index) result.push(node.index.url);
        walk(node.children);
      }
    }
  };

  walk(items);
  return result;
}
