import {cva} from "class-variance-authority";
import {usePathname} from "fumadocs-core/framework";
import Link, {type LinkProps} from "fumadocs-core/link";
import {ExternalLink} from "lucide-react";
import {isActive} from "@fumadocs/ui/urls";
import type {ReactNode} from "react";
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
  const pathname = usePathname();
  const active = props.href !== undefined && isActive(props.href, pathname, false);
  const {prefetch} = useInternalContext();

  return (
    <Link {...props} data-active={active} className={cn(sidebarItemVariants({active}), props.className)} prefetch={prefetch}>
      {icon ?? (props.external ? <ExternalLink /> : null)}
      {props.children}
    </Link>
  );
}
