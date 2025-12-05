import {TreeContextProvider} from "fumadocs-ui/contexts/tree";
import {ReactNode, useMemo} from "react";
import {HomeLayout} from "@/components/layout/home";
import {baseOptions} from "@/lib/layout.shared";
import type {Folder, Node, Root} from "fumadocs-core/page-tree";

interface LayoutProps {
  lang: string;
  searchToggle?: boolean;
  sidebar?: boolean;
  children: ReactNode;
  dataTree: object;
}

export default function SharedLayout({lang, searchToggle = true, sidebar = true, dataTree, children}: LayoutProps) {
  const options = baseOptions(lang);

  const tree = useMemo(() => transformPageTree(dataTree as Folder), [dataTree]);

  options.searchToggle = {
    enabled: searchToggle,
  };

  return (
    <TreeContextProvider tree={tree}>
      <HomeLayout {...options} sidebar={sidebar}>
        {children}
      </HomeLayout>
    </TreeContextProvider>
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
