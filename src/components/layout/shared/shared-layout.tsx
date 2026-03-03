import {DocsLayout} from "fumadocs-ui/layouts/docs";
import {ReactNode, useMemo} from "react";
import {baseOptions} from "@/lib/layout.shared";
import type {Folder, Node, Root} from "fumadocs-core/page-tree";

interface LayoutProps {
  lang: string;
  searchToggle?: boolean;
  sidebar?: boolean;
  children: ReactNode;
  dataTree: object;
  treeKey?: string;
}

export default function SharedLayout({lang, searchToggle = true, sidebar = true, dataTree, treeKey, children}: LayoutProps) {
  const tree = useMemo(() => transformPageTree(dataTree as Folder), [dataTree]);
  const options = baseOptions(lang);

  const searchOptions = {
    enabled: searchToggle,
  };

  return (
    <DocsLayout
      key={treeKey}
      tree={tree}
      {...options}
      searchToggle={searchOptions}
      sidebar={{
        enabled: sidebar,
        tabs: false,
      }}
    >
      {children}
    </DocsLayout>
  );
}

function transformPageTree(root: Root): Root {
  function mapNode<T extends Node>(item: T): T {
    if (typeof item.icon === "string") {
      item = {
        ...item,
        icon: (
          <span
            dangerouslySetInnerHTML={{
              __html: item.icon,
            }}
          />
        ),
      };
    }

    if (item.type === "folder") {
      return {
        ...item,
        index: item.index ? mapNode(item.index) : undefined,
        children: item.children.map(mapNode),
      };
    }

    return item;
  }

  return {
    ...root,
    children: root.children.map(mapNode),
    fallback: root.fallback ? transformPageTree(root.fallback) : undefined,
  };
}
