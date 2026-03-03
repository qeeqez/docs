"use client";

import {usePathname} from "fumadocs-core/framework";
import Link from "fumadocs-core/link";
import type {ComponentProps} from "react";
import {isActive} from "@/lib/is-active";
import {isApiDocsRoute} from "@/lib/is-api-docs-route";
import type {BaseLinkType} from "./";

export function BaseLinkItem({ref, item, ...props}: Omit<ComponentProps<"a">, "href"> & {item: BaseLinkType}) {
  const pathname = usePathname();
  const activeType = item.active ?? "url";
  const active = activeType !== "none" && isActive(item.url, pathname);
  const useDocumentNavigation = isApiDocsRoute(item.url);

  if (useDocumentNavigation) {
    return (
      <a ref={ref} href={item.url} {...props} data-active={active}>
        {props.children}
      </a>
    );
  }

  return (
    <Link ref={ref} href={item.url} external={item.external} {...props} data-active={active}>
      {props.children}
    </Link>
  );
}
