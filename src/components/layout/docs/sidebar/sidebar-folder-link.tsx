import {usePathname} from "fumadocs-core/framework";
import Link, {type LinkProps} from "fumadocs-core/link";
import {isActive} from "@/lib/is-active";
import {isApiDocsRoute} from "@/lib/is-api-docs-route";
import {ChevronDown} from "lucide-react";
import type {MouseEvent} from "react";
import {useFolderContext} from "@/components/layout/docs/sidebar/sidebar-folder";
import {sidebarItemVariants} from "@/components/layout/docs/sidebar/sidebar-item";
import {cn} from "@/lib/cn";
import {useInternalContext} from "./sidebar-provider";

export function SidebarFolderLink(props: LinkProps) {
  const {open, setOpen} = useFolderContext();
  const {prefetch} = useInternalContext();

  const pathname = usePathname();
  const active = props.href !== undefined && isActive(props.href, pathname, false);
  const useDocumentNavigation = props.href !== undefined && isApiDocsRoute(props.href);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (e.target instanceof Element && e.target.matches("[data-icon], [data-icon] *")) {
      setOpen(!open);
      e.preventDefault();
    } else {
      setOpen(active ? !open : true);
    }
  };

  if (useDocumentNavigation) {
    return (
      <a
        href={props.href}
        data-active={active}
        className={cn(sidebarItemVariants({active}), "w-full", props.className)}
        onClick={handleClick}
      >
        {props.children}
        <ChevronDown data-icon className={cn("ms-auto transition-transform", !open && "-rotate-90")} />
      </a>
    );
  }

  return (
    <Link
      {...props}
      data-active={active}
      className={cn(sidebarItemVariants({active}), "w-full", props.className)}
      onClick={handleClick}
      prefetch={prefetch}
    >
      {props.children}
      <ChevronDown data-icon className={cn("ms-auto transition-transform", !open && "-rotate-90")} />
    </Link>
  );
}
