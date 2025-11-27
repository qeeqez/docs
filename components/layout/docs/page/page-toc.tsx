"use client";

import {useSidebar} from "fumadocs-ui/contexts/sidebar";
import type {ComponentProps} from "react";
import {useTOCItems} from "@/components/ui/toc";
import {cn} from "@/lib/cn";

export function PageTOC(props: ComponentProps<"div">) {
  const {collapsed} = useSidebar();
  const items = useTOCItems();

  if (items.length === 0) return null;

  return (
    <div
      id="nd-toc"
      {...props}
      className={cn(
        "",
        // 'fixed bottom-0 pt-12 pb-2 pr-(--removed-body-scroll-bar-size,0) max-xl:hidden',
        props.className
      )}
      style={{
        ...props.style,
        // top: 'calc(var(--fd-banner-height) + var(--fd-nav-height))',
        // insetInlineEnd: `max(${offset}, calc(50vw - var(--fd-sidebar-width)/2 - var(--fd-page-width)/2))`,
      }}
    >
      {/*<div className="flex h-full w-(--fd-toc-width) max-w-full flex-col pe-4">*/}
      {props.children}
      {/*</div>*/}
    </div>
  );
}
