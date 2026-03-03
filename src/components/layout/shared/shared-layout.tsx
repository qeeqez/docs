import {DocsLayout} from "fumadocs-ui/layouts/docs";
import {HomeLayout} from "fumadocs-ui/layouts/home";
import {ReactNode} from "react";
import {baseOptions} from "@/lib/layout.shared";
import type {Root} from "fumadocs-core/page-tree";
import {Background} from "@/components/layout/home/background";

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
  const tree = dataTree as Root;
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
