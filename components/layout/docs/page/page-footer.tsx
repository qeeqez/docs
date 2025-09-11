"use client";

import {usePathname} from "fumadocs-core/framework";
import type {PageTree} from "fumadocs-core/server";
import {useTreeContext} from "fumadocs-ui/contexts/tree";
import {type ComponentProps, useMemo} from "react";
import {FooterItem} from "@/components/layout/docs/page/page-footer-item";
import type {Item} from "@/components/layout/docs/page/types";
import {cn} from "@/lib/cn";
import {isActive} from "@/lib/is-active";

const listCache = new Map<string, PageTree.Item[]>();

export interface FooterProps extends ComponentProps<"div"> {
  /**
   * Items including information for the next and previous page
   */
  items?: {
    previous?: Item;
    next?: Item;
  };
}

export function PageFooter({items, ...props}: FooterProps) {
  const {root} = useTreeContext();
  const pathname = usePathname();

  const {previous, next} = useMemo(() => {
    if (items) return items;

    const cached = listCache.get(root.$id);
    const list = cached ?? scanNavigationList(root.children);
    listCache.set(root.$id, list);

    const idx = list.findIndex((item) => isActive(item.url, pathname, false));

    if (idx === -1) return {};
    return {
      previous: list[idx - 1],
      next: list[idx + 1],
    };
  }, [items, pathname, root]);

  return (
    <div {...props} className={cn("@container grid gap-4 pb-6", previous && next ? "grid-cols-2" : "grid-cols-1", props.className)}>
      {previous ? <FooterItem item={previous} index={0} /> : null}
      {next ? <FooterItem item={next} index={1} /> : null}
    </div>
  );
}

function scanNavigationList(tree: PageTree.Node[]) {
  const list: PageTree.Item[] = [];

  tree.forEach((node) => {
    if (node.type === "folder") {
      if (node.index) {
        list.push(node.index);
      }

      list.push(...scanNavigationList(node.children));
      return;
    }

    if (node.type === "page" && !node.external) {
      list.push(node);
    }
  });

  return list;
}