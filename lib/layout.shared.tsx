import {ChevronRightIcon} from "lucide-react";
import LogoWide from "@/assets/logo_wide.svg";
import type {FooterSection} from "@/components/layout/footer/footer-content-section";
import DiscordIcon from "@/public/socials/discord.svg";
import GithubIcon from "@/public/socials/github.svg";
import XIcon from "@/public/socials/x.svg";
import YoutubeIcon from "@/public/socials/youtube.svg";
import type {BaseLayoutProps} from "@/components/layout/shared";
// import { i18n } from '@/lib/i18n';
import {getServerTranslations} from "@/hooks/use-server-translation";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(lang: string): BaseLayoutProps {
    const { t } = getServerTranslations(lang)

  return {
      // i18n, TODO: Enable language switcher
    nav: {
      title: (
        <LogoWide className="h-8 fill-black dark:invert"/>
      ),
      transparentMode: "top"
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [
      {
        text: `${t('home')}`,
        url: `/${lang}/getting-started/overview`,
        active: "nested-url",
        activeSubfolders: [
          "/getting-started",
          "/platform",
          "/legal",
          "/guides",
          "/reference",
          "/images",
          "/video",
            "/sdk"
        ]
      },
      {
        text: 'SDKs',
        url: `/${lang}/sdk/getting-started`,
        active: "nested-url",
        activeSubfolders: [
          `/getting-started`,
          `/video-component`,
          `/image-component`,
          `/video-component-examples`
        ]
      },
      {
        text: "APIs",
        url: `/${lang}/api`,
        active: "nested-url",
      },
      {
        type: 'button',
        text: <>Get Started <ChevronRightIcon/></>,
        url: "https://dash.rixl.com",
        secondary: true,
      }
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
        {text: "Documentation", url: `/${lang}/docs`},
        {text: "Guides", url: `/${lang}/guides`},
        {text: "Examples", url: `/${lang}/examples`},
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
        {text: "About", url: `/${lang}/about`},
        {text: "Blog", url: `/${lang}/blog`},
        {text: "Careers", url: `/${lang}/careers`},
        {text: "Privacy", url: `/${lang}/legal/privacy-policy`},
      ],
    },
    {
      title: "Tools",
      links: [
        {text: "CLI", url: `/${lang}/cli`},
        {text: "SDK", url: `/${lang}/sdk`},
        {text: "Integrations", url: `/${lang}/integrations`},
        {text: "Extensions", url: `/${lang}/extensions`},
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

export function FooterBottomLinks(lang: string): { text: string; url: string }[] {
  // TODO translations
  return [
    {text: "Privacy Policy", url: `/${lang}/legal/privacy-policy`},
    {text: "Terms of Service", url: `/${lang}/legal/terms-of-service`},
    {text: "Cookie Policy", url: `/${lang}/legal/cookie-policy`},
  ];
}
