import {NextProvider} from "fumadocs-core/framework/next";
import {TreeContextProvider} from "fumadocs-ui/contexts/tree";
import {Inter} from "next/font/google";
import type {ReactNode} from "react";
import {HomeLayout} from "@/components/layout/home";
import {cn} from "@/lib/cn";
import {baseOptions} from "@/lib/layout.shared";
import {source} from "@/lib/source";
import {Body} from "@/components/layout/shared/layout.client";
import {Provider} from "@/components/layout/shared/provider";
import "@/app/global.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

interface LayoutProps {
  lang: string;
  searchToggle?: boolean;
  sidebar?: boolean;
  children: ReactNode;
}

export default function SharedLayout({lang, searchToggle = true, sidebar = true, children}: LayoutProps) {
  const options = baseOptions(lang);
  const tree = source.pageTree[lang] ?? source.pageTree;

  options.searchToggle = {
    enabled: searchToggle,
  };

  return (
    <html lang={lang} className={cn("scroll-smooth overscroll-y-none", inter.className)} suppressHydrationWarning>
      <Body>
        <NextProvider>
          <TreeContextProvider tree={tree}>
            <Provider lang={lang}>
              <HomeLayout {...options} sidebar={sidebar}>
                {children}
              </HomeLayout>
            </Provider>
          </TreeContextProvider>
        </NextProvider>
      </Body>
    </html>
  );
}
