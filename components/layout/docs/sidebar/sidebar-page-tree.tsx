"use client";

import type {Node} from "fumadocs-core/page-tree";
import {useTreeContext} from "fumadocs-ui/contexts/tree";
import {usePathname} from "next/navigation";
import {Fragment, type ReactNode, useMemo} from "react";
import type {SidebarComponents} from "@/components/layout/docs/sidebar/sidebar-components";
import {SidebarItem} from "@/components/layout/docs/sidebar/sidebar-item";
import {PageTreeFolder} from "@/components/layout/docs/sidebar/sidebar-page-tree-folder";
import {SidebarSeparator} from "@/components/layout/docs/sidebar/sidebar-separator";
import {cn} from "@/lib/cn";

export function SidebarPageTree(props: {components?: Partial<SidebarComponents>}) {
  const {root} = useTreeContext();
  const pathname = usePathname();

  return useMemo(() => {
    const {Separator, Item, Folder} = props.components ?? {};

    const SDK_ROUTE_PATTERN = /\/[a-zA-Z]{2}\/sdk(\/|$)/;
    const isSdkRoute = SDK_ROUTE_PATTERN.test(pathname ?? "");

    const filteredItems = isSdkRoute
      ? root.children
      : root.children.filter((node) => {
          if (node.type === "folder") {
            const hasSdk =
              (node.index?.url && SDK_ROUTE_PATTERN.test(node.index.url)) ||
              node.children.some((child) => child.type === "page" && SDK_ROUTE_PATTERN.test(child.url));
            return !hasSdk;
          }
          if (node.type === "page") return !SDK_ROUTE_PATTERN.test(node.url);
          return true;
        });

    function renderSidebarList(items: Node[], level: number): ReactNode[] {
      return items.map((item, i) => {
        if (item.type === "separator") {
          if (Separator) return <Separator key={i} item={item} />;
          return (
            <SidebarSeparator key={i} className={cn(i !== 0 && "mt-6 lg:mt-8")}>
              {item.icon}
              {item.name}
            </SidebarSeparator>
          );
        }

        if (item.type === "folder") {
          const children = renderSidebarList(item.children, level + 1);

          if (Folder)
            return (
              <Folder key={i} item={item} level={level}>
                {children}
              </Folder>
            );
          return (
            <PageTreeFolder key={i} item={item}>
              {children}
            </PageTreeFolder>
          );
        }

        if (Item) return <Item key={item.url} item={item} />;
        return (
          <SidebarItem key={item.url} href={item.url} external={item.external} icon={item.icon}>
            {item.name}
          </SidebarItem>
        );
      });
    }

    return <Fragment key={root.$id}>{renderSidebarList(filteredItems, 1)}</Fragment>;
  }, [props.components, root, pathname]);
}
