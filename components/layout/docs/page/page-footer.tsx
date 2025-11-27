"use client";

import {usePathname} from "fumadocs-core/framework";
import type {Node, Item as PageTreeItem} from "fumadocs-core/page-tree";
import {useTreeContext} from "fumadocs-ui/contexts/tree";
import {type ComponentProps, useMemo} from "react";
import {FooterItem} from "@/components/layout/docs/page/page-footer-item";
import type {Item} from "@/components/layout/docs/page/types";
import {cn} from "@/lib/cn";
import {isActive} from "@/lib/is-active";
import {PageLastUpdate} from "@/components/layout/docs/page/page-last-update";
import {GithubBlock, GithubBlockProps} from "@/components/layout/docs/page/page-github-block";

const listCache = new Map<string, PageTreeItem[]>();

export interface FooterProps extends ComponentProps<"div"> {
  /**
   * Items including information for the next and previous page
   */
  items?: {
    previous?: Item;
    next?: Item;
  };

  github?: GithubBlockProps;
  lastUpdate?: Date | string | number;
}

export function PageFooter({items, github, lastUpdate, className, ...props}: FooterProps) {
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
    <div {...props} className={cn("space-y-4", className)}>
      <div className="flex flex-row flex-wrap items-center justify-between gap-4 empty:hidden">
        {github && <GithubBlock owner={github.owner} repo={github.repo} path={github.path} raiseIssue={github.raiseIssue} />}
        {lastUpdate && <PageLastUpdate date={lastUpdate} />}
      </div>
      <div className={cn("@container grid gap-4 pb-6", previous && next ? "grid-cols-2" : "grid-cols-1")}>
        {previous ? <FooterItem item={previous} index={0} /> : null}
        {next ? <FooterItem item={next} index={1} /> : null}
      </div>
    </div>
  );
}

function scanNavigationList(tree: Node[]) {
  const list: PageTreeItem[] = [];

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
