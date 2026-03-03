import {cva} from "class-variance-authority";
import {useRouter} from "@tanstack/react-router";
import {usePathname} from "fumadocs-core/framework";
import Link, {type LinkProps} from "fumadocs-core/link";
import {ExternalLink} from "lucide-react";
import {getHttpMethodFromPath} from "@/lib/http-method";
import {isActive} from "@/lib/is-active";
import type {MouseEvent, ReactNode} from "react";
import {useInternalContext} from "@/components/layout/docs/sidebar/sidebar-provider";
import {cn} from "@/lib/cn";

export const sidebarItemVariants = cva(
  cn(
    "relative flex flex-row items-center",
    "gap-2 rounded-xl p-2 ps-(--sidebar-item-offset)",
    "text-start text-sm font-normal antialiased",
    "[overflow-wrap:anywhere]",
    "[&_svg]:size-4 [&_svg]:shrink-0",
    "transition-colors hover:transition-none cursor-pointer"
  ),
  {
    variants: {
      active: {
        true: cn("bg-fd-primary/10 dark:bg-fd-primary/10", "text-fd-primary", "font-semibold"),
        false: cn(
          "hover:bg-gray-600/5 dark:hover:bg-gray-200/5",
          "text-fd-muted-foreground hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
        ),
      },
    },
  }
);

export function SidebarItem({
  icon,
  ...props
}: LinkProps & {
  icon?: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const active = props.href !== undefined && isActive(props.href, pathname, false);
  const {prefetch} = useInternalContext();
  const href = typeof props.href === "string" ? props.href : undefined;
  const method = getHttpMethodFromPath(href);

  const handleMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    props.onMouseEnter?.(event);
    if (!href || props.external || !href.startsWith("/")) return;
    void router.preloadRoute({to: href});
  };

  return (
    <Link
      {...props}
      data-active={active}
      className={cn(sidebarItemVariants({active}), props.className)}
      prefetch={prefetch}
      preloadDelay={0}
      onMouseEnter={handleMouseEnter}
    >
      {icon ?? (props.external ? <ExternalLink /> : null)}
      {props.children}
      {method ? (
        <span
          className={cn(
            "ms-auto rounded-md border px-1.5 py-0.5 text-[10px] leading-none font-medium font-mono uppercase",
            method === "GET" && "text-emerald-500 border-emerald-500/35 bg-emerald-500/10",
            method === "POST" && "text-sky-500 border-sky-500/35 bg-sky-500/10",
            method === "PUT" && "text-amber-500 border-amber-500/35 bg-amber-500/10",
            method === "DELETE" && "text-rose-500 border-rose-500/35 bg-rose-500/10",
            method === "PATCH" && "text-violet-500 border-violet-500/35 bg-violet-500/10",
            method === "HEAD" && "text-teal-500 border-teal-500/35 bg-teal-500/10",
            method === "OPTIONS" && "text-fuchsia-500 border-fuchsia-500/35 bg-fuchsia-500/10"
          )}
        >
          {method}
        </span>
      ) : null}
    </Link>
  );
}
