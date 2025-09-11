import type {I18nConfig} from "fumadocs-core/i18n";
import {ChevronDown, Languages} from "lucide-react";
import {LanguageToggle, LanguageToggleText} from "@/components/language-toggle";
import {ThemeToggle} from "@/components/theme-toggle";
import {cn} from "@/lib/cn";
import {SearchToggle} from "@/components/search-toggle";
import {Menu, MenuContent, MenuLinkItem, MenuTrigger} from "@/components/layout/home/menu";
import {buttonVariants} from "@/components/ui/button";
import type {LinkItemType} from "@/components/layout/shared";
import {isSecondary} from "@/components/layout/header/is-secondary";
import {Sidebar} from "@/components/layout/docs/sidebar/sidebar";
import {HeaderMobileMenuContent} from "@/components/layout/header/header-mobile-menu-content";

interface HeaderRightProps {
  i18n: boolean | I18nConfig<string>;
  menuItems: LinkItemType[];
  menuEnableHoverToOpen?: boolean;
  className?: string;
}

export function HeaderRight({i18n, menuItems, menuEnableHoverToOpen = false, className}: HeaderRightProps) {
  return <div className={cn("flex items-center space-x-4", className)}>
    <div className="hidden lg:flex space-x-4">
      {menuItems.filter(isSecondary).map((item, i) => (
        <MenuLinkItem key={i} item={item}/>
      ))}
      <ThemeToggle mode="light-dark" className="hidden lg:flex"/>
      {i18n ? (
        <LanguageToggle className="hidden lg:flex">
          <Languages className="size-5"/>
        </LanguageToggle>
      ) : null}
    </div>
    <div className="flex lg:hidden space-x-4">
      <SearchToggle hideIfDisabled/>
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
          enableHover={menuEnableHoverToOpen}
        >
          <ChevronDown className="!size-5.5 transition-transform duration-300 group-data-[state=open]:rotate-180"/>
        </MenuTrigger>
        <HeaderMobileMenuContent i18n={i18n} menuItems={menuItems}/>
      </Menu>
    </div>
  </div>
}