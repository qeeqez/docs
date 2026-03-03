import {DocsLayout} from "fumadocs-ui/layouts/docs";
import {HomeLayout} from "fumadocs-ui/layouts/home";
import {ReactNode, useMemo} from "react";
import {baseOptions} from "@/lib/layout.shared";
import type {Folder, Node, Root} from "fumadocs-core/page-tree";
import {Background} from "@/components/layout/home/background";
import {getHttpMethodFromPath} from "@/lib/http-method";

interface LayoutProps {
  lang: string;
  searchToggle?: boolean;
  sidebar?: boolean;
  children: ReactNode;
  dataTree: object;
  sectionLinks?: {
    home: string;
    sdk: string;
    api: string;
  };
  treeKey?: string;
}

export default function SharedLayout({lang, searchToggle = true, sidebar = true, dataTree, sectionLinks, treeKey, children}: LayoutProps) {
  const tree = useMemo(() => transformPageTree(dataTree as Folder), [dataTree]);
  const options = baseOptions(lang, sectionLinks);

  const topSearchOptions = {
    enabled: searchToggle,
  };

  return (
    <div className="relative z-10 flex min-h-svh flex-col">
      <Background />
      <HomeLayout {...options} searchToggle={topSearchOptions} className="flex-1">
        <DocsLayout
          key={treeKey}
          tree={tree}
          {...options}
          nav={{
            ...options.nav,
            enabled: false,
            title: null,
            children: null,
          }}
          searchToggle={{
            enabled: false,
          }}
          themeSwitch={{
            enabled: false,
          }}
          sidebar={{
            enabled: sidebar,
            tabs: false,
            footer: null,
            collapsible: false,
          }}
        >
          {children}
        </DocsLayout>
      </HomeLayout>
    </div>
  );
}

function transformPageTree(root: Root): Root {
  function getMethodClass(method: string) {
    switch (method) {
      case "GET":
        return "text-green-600 dark:text-green-400";
      case "POST":
        return "text-blue-600 dark:text-blue-400";
      case "PUT":
        return "text-yellow-600 dark:text-yellow-400";
      case "DELETE":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-fd-muted-foreground";
    }
  }

  function withMethodLabel(name: ReactNode, url: string): ReactNode {
    const method = getHttpMethodFromPath(url);
    if (!method) return name;

    return (
      <>
        <span className="min-w-0">{name}</span>
        <span className={`ms-auto shrink-0 rounded px-1.5 py-0.5 font-mono text-[11px] leading-none ${getMethodClass(method)}`}>
          {method === "DELETE" ? "DEL" : method}
        </span>
      </>
    );
  }

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

    if (item.type === "page" && item.url.includes("/api/")) {
      item = {
        ...item,
        name: withMethodLabel(item.name, item.url),
      } as T;
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
