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
  isApiPage?: boolean;
  children: ReactNode;
  dataTree: object;
  sectionLinks?: {
    home: string;
    sdk: string;
    api: string;
  };
  treeKey?: string;
}

export default function SharedLayout({
  lang,
  searchToggle = true,
  sidebar = true,
  isApiPage = false,
  dataTree,
  sectionLinks,
  treeKey,
  children,
}: LayoutProps) {
  const tree = dataTree as Root;
  const options = baseOptions(lang, sectionLinks);
  const layoutWidthClass = isApiPage ? "xl:[--fd-layout-width:2200px]" : "xl:[--fd-layout-width:1760px]";
  const docsLayoutWidthClass = isApiPage ? "xl:layout:[--fd-layout-width:2200px]" : "xl:layout:[--fd-layout-width:1760px]";

  return (
    <div className="relative z-10 flex min-h-svh flex-col">
      <Background />
      <HomeLayout
        {...options}
        searchToggle={{
          enabled: false,
        }}
        className={`flex-1 ${layoutWidthClass}`}
      >
        <DocsLayout
          key={treeKey}
          tree={tree}
          {...options}
          containerProps={{
            className: docsLayoutWidthClass,
          }}
          nav={{
            ...options.nav,
            enabled: false,
            title: null,
            children: null,
          }}
          searchToggle={{
            enabled: searchToggle,
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
