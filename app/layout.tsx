import "@/app/global.css";
import {Inter} from "next/font/google";
import {Provider} from "@/provider";
import {cn} from "@/lib/cn";
import type {ReactNode} from "react";
import {source} from "@/lib/source";
import {TreeContextProvider} from "fumadocs-ui/contexts/tree";
import {NextProvider} from "fumadocs-core/framework/next";

const inter = Inter({
  subsets: ["latin"],
});

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({children}: LayoutProps) {
  return (
    <html lang="en" className={cn(
      "scroll-smooth overscroll-y-none",
      inter.className
    )} suppressHydrationWarning>
    <body>
    <NextProvider>
      <TreeContextProvider tree={source.pageTree}>
        <Provider>
          {children}
        </Provider>
      </TreeContextProvider>
    </NextProvider>
    </body>
    </html>
  );
}
