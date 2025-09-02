import {useMemo} from "react";
import {getLinks, type LinkItemType} from "@/components/layout/shared";
import {Navbar} from "@/components/layout/home/navbar";
import Link from "fumadocs-core/link";
import {LargeSearchToggle, SearchToggle} from "@/components/search-toggle";
import {ThemeToggle} from "@/components/theme-toggle";
import {LanguageToggle, LanguageToggleText} from "@/components/language-toggle";
import {ChevronDown, Languages} from "lucide-react";
import {Menu, MenuContent, MenuLinkItem, MenuTrigger} from "@/components/layout/home/menu";
import {cn} from "@/lib/cn";
import {buttonVariants} from "@/components/ui/button";
import {HomeLayoutProps} from "@/components/layout/home/index";
import {NavbarLinkItem} from "@/components/layout/home/navbar-link-item";

export function Header({
                         nav = {},
                         i18n = false,
                         links,
                         githubUrl,
                         searchToggle = {},
                       }: HomeLayoutProps) {
  const finalLinks = useMemo(
    () => getLinks(links, githubUrl),
    [links, githubUrl],
  );

  const navItems = finalLinks.filter((item) =>
    ['nav', 'all'].includes(item.on ?? 'all'),
  );
  const menuItems = finalLinks.filter((item) =>
    ['menu', 'all'].includes(item.on ?? 'all'),
  );

  return (
    <Navbar>
      <Link
        href={nav.url ?? '/'}
        className="inline-flex items-center gap-2.5 font-semibold"
      >
        {nav.title}
      </Link>
      {nav.children}
      <ul className="flex flex-row items-center gap-2 px-6 max-sm:hidden">
        {navItems
          .filter((item) => !isSecondary(item))
          .map((item, i) => (
            <NavbarLinkItem key={i} item={item} className="text-sm"/>
          ))}
      </ul>
      <div className="flex flex-row items-center justify-end gap-1.5 flex-1 max-lg:hidden">
        <LargeSearchToggle
          className="w-full rounded-full ps-2.5 max-w-[240px]"
          hideIfDisabled
        />
        <ThemeToggle mode="light-dark"/>
        {i18n ? (
          <LanguageToggle>
            <Languages className="size-5"/>
          </LanguageToggle>
        ) : null}
      </div>
      <ul className="flex flex-row items-center ms-auto -me-1.5 lg:hidden">
        {searchToggle.enabled !== false &&
          (searchToggle.components?.sm ?? (
            <SearchToggle className="p-2" hideIfDisabled/>
          ))}
        <Menu>
          <MenuTrigger
            aria-label="Toggle Menu"
            className={cn(
              buttonVariants({
                size: 'icon',
                color: 'ghost',
                className: 'group',
              }),
            )}
            enableHover={nav.enableHoverToOpen}
          >
            <ChevronDown className="!size-5.5 transition-transform duration-300 group-data-[state=open]:rotate-180"/>
          </MenuTrigger>
          <MenuContent className="sm:flex-row sm:items-center sm:justify-end">
            {menuItems
              .filter((item) => !isSecondary(item))
              .map((item, i) => (
                <MenuLinkItem key={i} item={item} className="sm:hidden"/>
              ))}
            <div className="-ms-1.5 flex flex-row items-center gap-1.5 max-sm:mt-2">
              {menuItems.filter(isSecondary).map((item, i) => (
                <MenuLinkItem key={i} item={item} className="-me-1.5"/>
              ))}
              <div role="separator" className="flex-1"/>
              {i18n ? (
                <LanguageToggle>
                  <Languages className="size-5"/>
                  <LanguageToggleText/>
                  <ChevronDown className="size-3 text-fd-muted-foreground"/>
                </LanguageToggle>
              ) : null}
              <ThemeToggle mode="light-dark"/>
            </div>
          </MenuContent>
        </Menu>
      </ul>
    </Navbar>
  );
}

function isSecondary(item: LinkItemType): boolean {
  if ('secondary' in item && item.secondary != null) return item.secondary;

  return item.type === 'icon';
}