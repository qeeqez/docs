"use client";

import {cva, type VariantProps} from "class-variance-authority";
import Link, {type LinkProps} from "fumadocs-core/link";
import type {NavigationMenu as Primitive} from "radix-ui";
import {type ComponentProps, useState} from "react";
import {cn} from "../../../lib/cn";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "../../navigation-menu";
import {buttonVariants} from "../../ui/button";
import {BaseLinkItem} from "../shared/client";

const navItemVariants = cva(
  "inline-flex items-center gap-1 py-2 text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground font-medium data-[active=true]:text-fd-primary [&_svg]:size-4"
);

export function Navbar(props: ComponentProps<"div">) {
  const [value, setValue] = useState("");

  return (
    <NavigationMenu value={value} onValueChange={setValue} asChild>
      <header id="nd-nav" {...props} className={cn("max-w-[92rem] mx-auto relative", props.className)}>
        <div
          id="navbar-transition"
          className={cn(
            "absolute w-full h-full flex-none",
            "backdrop-blur"
            // "transition-colors duration-500 data-[is-opaque=true]:bg-background-light data-[is-opaque=true]:supports-backdrop-blur:bg-background-light/95 data-[is-opaque=true]:dark:bg-background-dark/75 data-[is-opaque=false]:supports-backdrop-blur:bg-background-light/60 data-[is-opaque=false]:dark:bg-transparent",
          )}
          data-is-opaque="false"
        ></div>
        <NavigationMenuList asChild>
          <nav>{props.children}</nav>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </header>
    </NavigationMenu>
  );
}

export const NavbarMenu = NavigationMenuItem;

export function NavbarMenuContent(props: Primitive.NavigationMenuContentProps) {
  return (
    <NavigationMenuContent {...props} className={cn("grid grid-cols-1 gap-2 p-4 md:grid-cols-2 lg:grid-cols-3", props.className)}>
      {props.children}
    </NavigationMenuContent>
  );
}

export function NavbarMenuTrigger(props: Primitive.NavigationMenuTriggerProps) {
  return (
    <NavigationMenuTrigger {...props} className={cn(navItemVariants(), "rounded-md", props.className)}>
      {props.children}
    </NavigationMenuTrigger>
  );
}

export function NavbarMenuLink(props: LinkProps) {
  return (
    <NavigationMenuLink asChild>
      <Link
        {...props}
        className={cn(
          "flex flex-col gap-2 rounded-lg border bg-fd-card p-3 transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground",
          props.className
        )}
      >
        {props.children}
      </Link>
    </NavigationMenuLink>
  );
}

const linkVariants = cva("", {
  variants: {
    variant: {
      main: navItemVariants(),
      button: buttonVariants({
        color: "secondary",
        className: "gap-1.5 [&_svg]:size-4",
      }),
      icon: buttonVariants({
        color: "ghost",
        size: "icon",
      }),
    },
  },
  defaultVariants: {
    variant: "main",
  },
});

export function NavbarLink({item, variant, ...props}: ComponentProps<typeof BaseLinkItem> & VariantProps<typeof linkVariants>) {
  return (
    <NavigationMenuItem asChild>
      <NavigationMenuLink asChild>
        <BaseLinkItem {...props} item={item} className={cn(linkVariants({variant}), props.className)}>
          {props.children}
        </BaseLinkItem>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
