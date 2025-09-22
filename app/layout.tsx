import "@/app/global.css";
import {NextProvider} from "fumadocs-core/framework/next";
import {TreeContextProvider} from "fumadocs-ui/contexts/tree";
import {Inter} from "next/font/google";
import type {ReactNode} from "react";
import {cn} from "@/lib/cn";
import {source} from "@/lib/source";
import {Provider} from "@/provider";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
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
