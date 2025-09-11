import Link from "fumadocs-core/link";
import {Fragment} from "react";
import {
  NavbarLink,
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMenuTrigger
} from "@/components/layout/home/navbar";
import type {LinkItemType} from "@/components/layout/shared";
import {isActive} from "@/lib/is-active";
import {cn} from "@/lib/cn";

export function NavbarLinkItem({item, ...props}: { item: LinkItemType; className?: string }) {
  if (item.type === "custom") return <div {...props}>{item.children}</div>;

  if (item.type === "menu") {
    const children = item.items.map((child, j) => {
      if (child.type === "custom") return <Fragment key={j}>{child.children}</Fragment>;

      const {
        banner = child.icon ?
          <div className="w-fit rounded-md border bg-fd-muted p-1 [&_svg]:size-4">{child.icon}</div> : null,
        ...rest
      } = child.menu ?? {};

      return (
        <NavbarMenuLink key={j} href={child.url} external={child.external} {...rest}>
          {rest.children ?? (
            <>
              {banner}
              <p className="text-[15px] font-medium">{child.text}</p>
              <p className="text-sm text-fd-muted-foreground empty:hidden">{child.description}</p>
            </>
          )}
        </NavbarMenuLink>
      );
    });

    return (
      <NavbarMenu>
        <NavbarMenuTrigger {...props}>{item.url ? <Link href={item.url}>{item.text}</Link> : item.text}</NavbarMenuTrigger>
        <NavbarMenuContent>{children}</NavbarMenuContent>
      </NavbarMenu>
    );
  }

  return (
    <NavbarLink className=""
    //   className={cn(
    //   "flex items-center gap-2 group relative h-full",
    //   isActive() ? "bg-yellow-400" : "bg-g"
    // )}
      {...props} item={item} variant={item.type} aria-label={item.type === "icon" ? item.label : undefined}>
      <div className="[&>[data-active]]:bg-yellow-400 data-[active=false]:bg-green-400">
        {item.type === "icon" ? item.icon : item.text}
        <div className="absolute bottom-0 h-[1.5px] w-full group-hover:bg-fd-primary dark:group-hover:bg-fd-primary-foreground"></div>
      </div>
    </NavbarLink>
  );
}
