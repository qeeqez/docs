import Link, {type LinkProps} from "fumadocs-core/link";
import {useInternalContext} from "@/components/layout/docs/sidebar/sidebar-provider";
import {usePathname} from "fumadocs-core/framework";
import {ReactNode} from "react";
import {cn} from "@/lib/cn";
import {ExternalLink} from "fumadocs-ui/internal/icons";
import {cva} from "class-variance-authority";
import {isActive} from "fumadocs-ui/utils/is-active";

export const sidebarItemVariants = cva(
  'relative flex flex-row items-center gap-2 rounded-xl p-2 ps-(--sidebar-item-offset) text-start text-fd-muted-foreground text-sm [overflow-wrap:anywhere] [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      active: {
        true: 'bg-fd-primary/10 text-fd-primary',
        false:
          'transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none',
      },
    },
  },
);

export function SidebarItem({
                              icon,
                              ...props
                            }: LinkProps & {
  icon?: ReactNode;
}) {
  const pathname = usePathname();
  const active =
    props.href !== undefined && isActive(props.href, pathname, false);
  const {prefetch} = useInternalContext();

  return (
    <Link
      {...props}
      data-active={active}
      className={cn(sidebarItemVariants({active}), props.className)}
      prefetch={prefetch}
    >
      {icon ?? (props.external ? <ExternalLink/> : null)}
      {props.children}
    </Link>
  );
}

