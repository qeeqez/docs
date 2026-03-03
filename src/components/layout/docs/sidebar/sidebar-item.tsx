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
    "gap-1.5 rounded-lg py-1 pe-2.5 ps-(--sidebar-item-offset)",
    "min-w-0 text-start text-sm font-normal antialiased",
    "[&_svg]:size-4 [&_svg]:shrink-0",
    "transition-colors hover:transition-none cursor-pointer"
  ),
  {
    variants: {
      active: {
        true: cn("text-fd-primary"),
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
  const methodLabel = method === "DELETE" ? "DEL" : method;

  const handleMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    props.onMouseEnter?.(event);
    if (!href || props.external || !href.startsWith("/")) return;
    void router.preloadRoute({to: href});
  };

  return (
    <Link
      {...props}
      data-active={active}
      className={cn(sidebarItemVariants({active}), "w-full overflow-hidden", props.className)}
      prefetch={prefetch}
      preloadDelay={0}
      onMouseEnter={handleMouseEnter}
    >
      {icon ?? (props.external ? <ExternalLink /> : null)}
      <span className={cn("min-w-0 flex-1", method ? "whitespace-normal break-words leading-5" : "truncate whitespace-nowrap")}>
        {props.children}
      </span>
      {method ? (
        <span
          className={cn(
            "ms-2 inline-flex min-w-[4.75rem] shrink-0 justify-end whitespace-nowrap text-right text-[0.72rem] leading-5 font-semibold tracking-[0.08em] uppercase",
            method === "POST" && "text-emerald-400/90",
            method === "GET" && "text-sky-400/90",
            method === "PUT" && "text-amber-400/90",
            method === "DELETE" && "text-red-400/90",
            method === "PATCH" && "text-violet-400/90",
            method === "HEAD" && "text-teal-300/90",
            method === "OPTIONS" && "text-fuchsia-400/90"
          )}
        >
          {methodLabel}
        </span>
      ) : null}
    </Link>
  );
}
