import "@/app/global.css";
import {Inter} from "next/font/google";
import {HomeLayout} from "@/components/layout/home";
import {baseOptions} from "@/lib/layout.shared";
import {Provider} from "@/provider";
import {cn} from "@/lib/cn";
import type {ReactNode} from "react";

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
    <Provider>
      <HomeLayout {...baseOptions()}>{children}</HomeLayout>
    </Provider>
    </body>
    </html>
  );
}
