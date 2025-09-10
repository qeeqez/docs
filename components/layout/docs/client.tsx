"use client";

import {useSidebar} from "fumadocs-ui/contexts/sidebar";
import type {ComponentProps} from "react";
import {cn} from "@/lib/cn";

export function LayoutBody(props: ComponentProps<"main">) {
  const {collapsed} = useSidebar();

  return (
    <main
      // id="nd-docs-layout"
      {...props}
      className={cn(
        // 'flex flex-1 flex-col pt-(--fd-nav-height) transition-[padding]',
        // !collapsed && 'mx-(--fd-layout-offset)',
        // props.className,
      )}
      // style={{
      //   ...props.style,
      //   paddingInlineStart: collapsed
      //     ? 'min(calc(100vw - var(--fd-page-width)), var(--fd-sidebar-width))'
      //     : 'var(--fd-sidebar-width)',
      // >}}
    >
      {props.children}
    </main>
  );
}
