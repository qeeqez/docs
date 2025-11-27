import {useMemo} from "react";
import {HeaderRight} from "@/components/layout/header/header-right";
import {isSecondary} from "@/components/layout/header/is-secondary";
import {Logo} from "@/components/layout/header/logo";
import type {HomeLayoutProps} from "@/components/layout/home";
import {Navbar} from "@/components/layout/home/navbar";
import {NavbarLinkItem} from "@/components/layout/home/navbar-link-item";
import {getLinks} from "@/components/layout/shared";
import {LargeSearchToggle} from "@/components/search-toggle";
import {cn} from "@/lib/cn";

export function Header({nav = {}, i18n = false, links, githubUrl, searchToggle = {}}: HomeLayoutProps) {
  const finalLinks = useMemo(() => getLinks(links, githubUrl), [links, githubUrl]);

  const navItems = finalLinks.filter((item) => ["nav", "all"].includes(item.on ?? "all"));
  const menuItems = finalLinks.filter((item) => ["menu", "all"].includes(item.on ?? "all"));

  const border = cn("border-b border-gray-500/5 dark:border-gray-300/[0.06]");

  return (
    <Navbar className={cn("sticky top-0 left-0 right-0 w-full z-[9999]", border)}>
      <div className="flex items-center h-header-top min-w-0 lg:px-12 mx-4 lg:mx-0">
        <div className={cn("h-full relative flex-1 flex items-center gap-x-4 min-w-0", border)}>
          <Logo title={nav?.title} url={nav?.url} className="flex-1 flex items-center gap-x-4" />
          {searchToggle.enabled && (
            <LargeSearchToggle className="relative hidden lg:flex items-center gap-2.5 flex-1 cursor-pointer" hideIfDisabled />
          )}
          <HeaderRight
            i18n={i18n}
            menuItems={finalLinks}
            menuEnableHoverToOpen={nav?.enableHoverToOpen}
            searchToggle={searchToggle}
            className="flex-1 relative ml-auto justify-end"
          />
        </div>
      </div>
      <div className="hidden lg:flex lg:px-12 mx-4 lg:mx-0 h-header-bottom">
        <div className="flex flex-row items-center text-sm gap-x-6">
          {navItems
            .filter((item) => !isSecondary(item))
            .map((item, i) => (
              <NavbarLinkItem key={i} item={item} />
            ))}
        </div>
      </div>
    </Navbar>
  );
}
