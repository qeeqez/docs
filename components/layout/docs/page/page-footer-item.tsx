"use client";

import Link from "fumadocs-core/link";
import {useI18n} from "fumadocs-ui/contexts/i18n";
import {ChevronLeft, ChevronRight} from "lucide-react";
import type {Item} from "@/components/layout/docs/page/types";
import {cn} from "@/lib/cn";

export function FooterItem({item, index}: {item: Item; index: 0 | 1}) {
  const {text} = useI18n();
  const Icon = index === 0 ? ChevronLeft : ChevronRight;

  return (
    <Link
      href={item.url}
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-4 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground @max-lg:col-span-full",
        index === 1 && "text-end"
      )}
    >
      <div className={cn("inline-flex items-center gap-1.5 font-medium", index === 1 && "flex-row-reverse")}>
        <Icon className="-mx-1 size-4 shrink-0 rtl:rotate-180" />
        <p>{item.name}</p>
      </div>
      <p className="text-fd-muted-foreground truncate">{item.description ?? (index === 0 ? text.previousPage : text.nextPage)}</p>
    </Link>
  );
}
