import type {BaseLayoutProps} from "@/components/layout/shared";
import {FooterSection} from "@/components/layout/footer/footer-content-section.tsx";
import LogoWide from "@/assets/logo_wide.svg?react";
import DiscordIcon from "@/assets/socials/discord.svg?react";
import GithubIcon from "@/assets/socials/github.svg?react";
import XIcon from "@/assets/socials/x.svg?react";
import YoutubeIcon from "@/assets/socials/youtube.svg?react";
import {ArrowUpRightIcon} from "lucide-react";
import {ThemeToggle} from "@/components/theme-toggle";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/shared-layout.tsx
 * Docs Layout: app/docs/shared-layout.tsx
 */
export function baseOptions(
  lang: string,
  sectionLinks?: {
    home: string;
    sdk: string;
    api: string;
  }
): BaseLayoutProps {
  return baseOptionsWithSectionLinks(lang, sectionLinks);
}

export function baseOptionsWithSectionLinks(
  lang: string,
  _sectionLinks?: {
    home: string;
    sdk: string;
    api: string;
  }
): BaseLayoutProps {
  // TODO tanstack translations
  // const {t} = getServerTranslations(lang);
  const homeUrl = `/${lang}/home`;
  const sdkUrl = `/${lang}/sdk`;
  const apiUrl = `/${lang}/api`;

  return {
    // i18n, TODO: Enable language switcher
    nav: {
      title: <LogoWide className="h-8 fill-black dark:invert" />,
      transparentMode: "top",
    },
    themeSwitch: {
      enabled: false,
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [
      {
        text: "Home", // TODO kek `${t("home")}`,
        url: homeUrl,
        on: "nav",
        active: "nested-url",
        activeSubfolders: [`/${lang}/home`],
      },
      {
        text: "SDK",
        url: sdkUrl,
        on: "nav",
        active: "nested-url",
        activeSubfolders: [`/${lang}/sdk`],
      },
      {
        text: "API",
        url: apiUrl,
        on: "nav",
        active: "nested-url",
        activeSubfolders: [`/${lang}/api`],
      },
      {
        type: "button",
        on: "nav",
        text: (
          <>
            Dashboard <ArrowUpRightIcon className="size-4" />
          </>
        ),
        url: "https://dash.rixl.com",
        secondary: true,
      },
      {
        type: "custom",
        on: "nav",
        secondary: true,
        children: <ThemeToggle />,
      },
    ],
  };
}

export function FooterSections(lang: string): FooterSection[] {
  // TODO translations and proper links
  return [
    {
      title: "Resources",
      links: [
        {text: "API", url: `/${lang}/api`},
        {text: "Documentation", url: `/${lang}/home/getting-started/overview`},
        {text: "Guides", url: `/${lang}/home/guides`},
        {text: "Examples", url: `/${lang}/sdk/examples`},
      ],
    },
    {
      title: "Support",
      links: [
        {text: "Help Center", url: `/${lang}/help`},
        {text: "Community", url: `/${lang}/community`},
        {text: "Contact", url: `/${lang}/contact`},
        {text: "Status", url: `/${lang}/status`},
      ],
    },
    {
      title: "Company",
      links: [
        {text: "rixl.com", url: "https://www.rixl.com"},
        {text: "About", url: `/${lang}/home/getting-started/overview`},
        {text: "Blog", url: "https://www.rixl.com/blog"},
        {text: "Careers", url: "https://www.rixl.com/careers"},
        {text: "Privacy", url: `/${lang}/home/legal/privacy-policy`},
      ],
    },
    {
      title: "Tools",
      links: [
        {text: "CLI", url: `/${lang}/home/platform/api-documentation/overview`},
        {text: "SDK", url: `/${lang}/sdk`},
        {text: "Integrations", url: `/${lang}/home/guides`},
        {text: "Extensions", url: `/${lang}/sdk/examples`},
      ],
    },
    {
      title: "Community",
      links: [
        {text: "X", url: "https://x.com/rixlcloud", external: true, Icon: XIcon},
        {text: "Discord", url: "https://discord.gg/...", external: true, Icon: DiscordIcon},
        {text: "YouTube", url: "https://youtube.com/@rixlcloud", external: true, Icon: YoutubeIcon},
        {text: "GitHub", url: "https://github.com/qeeqez", external: true, Icon: GithubIcon}, // TODO replace github when migrated
      ],
    },
  ];
}

export function FooterBottomLinks(lang: string): {text: string; url: string}[] {
  // TODO translations
  return [
    {text: "Privacy Policy", url: `/${lang}/home/legal/privacy-policy`},
    {text: "Terms of Service", url: `/${lang}/home/legal/terms-of-service`},
    {text: "Cookie Policy", url: `/${lang}/home/legal/cookie-policy`},
  ];
}
