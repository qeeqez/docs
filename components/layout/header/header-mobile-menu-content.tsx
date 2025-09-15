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

interface Props {
  i18n: boolean | I18nConfig<string>;
  menuItems: LinkItemType[];
  className?: string;
}

export function HeaderMobileMenuContent({i18n, menuItems}: Props) {
  return <MenuContent className="bg-fd-background mt-16 space-y-4">
    <div className="flex flex-col">
      {menuItems
        .filter((item) => !isSecondary(item))
        .map((item, i) => (
          <MenuLinkItem key={i} item={item}/>
        ))}
    </div>
    <div className="-ms-1.5 flex flex-row items-center justify-between max-sm:mt-2">
      <div className="flex flex-row gap-1.5">
        {menuItems.filter(isSecondary).map((item, i) => (
          <MenuLinkItem key={i} item={item} className="-me-1.5"/>
        ))}
      </div>
      <div>
        {i18n &&
          <LanguageToggle>
            <Languages className="size-5"/>
            <LanguageToggleText/>
            <ChevronDown className="size-3 text-fd-muted-foreground"/>
          </LanguageToggle>
        }
        <ThemeToggle mode="light-dark"/>
      </div>
    </div>
  </MenuContent>
}