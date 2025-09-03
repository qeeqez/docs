import Link, {LinkProps} from "fumadocs-core/link";
import {useInternalContext} from "./sidebar-provider";
import {usePathname} from "fumadocs-core/framework";
import {useFolderContext} from "@/components/layout/docs/sidebar/sidebar-folder";
import {cn} from "@/lib/cn";
import {ChevronDown} from "lucide-react";
import {sidebarItemVariants} from "@/components/layout/docs/sidebar/sidebar-item";
import {isActive} from "fumadocs-ui/utils/is-active";

export function SidebarFolderLink(props: LinkProps) {
  const {open, setOpen} = useFolderContext();
  const {prefetch} = useInternalContext();

  const pathname = usePathname();
  const active =
    props.href !== undefined && isActive(props.href, pathname, false);

  return (
    <Link
      {...props}
      data-active={active}
      className={cn(sidebarItemVariants({active}), 'w-full', props.className)}
      onClick={(e) => {
        if (
          e.target instanceof Element &&
          e.target.matches('[data-icon], [data-icon] *')
        ) {
          setOpen(!open);
          e.preventDefault();
        } else {
          setOpen(active ? !open : true);
        }
      }}
      prefetch={prefetch}
    >
      {props.children}
      <ChevronDown
        data-icon
        className={cn('ms-auto transition-transform', !open && '-rotate-90')}
      />
    </Link>
  );
}