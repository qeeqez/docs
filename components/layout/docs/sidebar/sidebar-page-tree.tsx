'use client';

import type {PageTree} from "fumadocs-core/server";
import {type SidebarComponents, SidebarSeparator} from "fumadocs-ui/components/layout/sidebar";
import {useTreeContext} from "fumadocs-ui/contexts/tree";
import {Fragment, type ReactNode, useMemo} from "react";
import {SidebarItem} from "@/components/layout/docs/sidebar/sidebar-item";
import {PageTreeFolder} from "@/components/layout/docs/sidebar/sidebar-page-tree-folder";
import {cn} from "@/lib/cn";

export function SidebarPageTree(props: {
  components?: Partial<SidebarComponents>;
}) {
  const {root} = useTreeContext();

  return useMemo(() => {
    const {Separator, Item, Folder} = props.components ?? {};

    function renderSidebarList(
      items: PageTree.Node[],
      level: number,
    ): ReactNode[] {
      return items.map((item, i) => {
        if (item.type === 'separator') {
          if (Separator) return <Separator key={i} item={item}/>;
          return (
            <SidebarSeparator key={i} className={cn(i !== 0 && 'mt-6')}>
              {item.icon}
              {item.name}
            </SidebarSeparator>
          );
        }

        if (item.type === 'folder') {
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

        if (Item) return <Item key={item.url} item={item}/>;
        return (
          <SidebarItem
            key={item.url}
            href={item.url}
            external={item.external}
            icon={item.icon}
          >
            {item.name}
          </SidebarItem>
        );
      });
    }

    return (
      <Fragment key={root.$id}>{renderSidebarList(root.children, 1)}</Fragment>
    );
  }, [props.components, root]);
}