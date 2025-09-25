import {ChevronRightIcon} from "lucide-react";
import LogoWide from "@/assets/logo_wide.svg";
import type {FooterSection} from "@/components/layout/footer/footer-content-section";
import DiscordIcon from "@/public/socials/discord.svg";
import GithubIcon from "@/public/socials/github.svg";
import XIcon from "@/public/socials/x.svg";
import YoutubeIcon from "@/public/socials/youtube.svg";
import type {BaseLayoutProps} from "@/components/layout/shared";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <LogoWide className="h-8 fill-black dark:invert"/>
      ),
      transparentMode: "top"
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [
      {
        text: "Home",
        url: "/getting-started/overview",
        active: "nested-url",
        activeSubfolders: [
          "/getting-started",
          "/platform",
          "/legal",
          "/guides",
          "/reference",
          "/images",
          "/video"
        ]
      },
      {
        text: 'SDKs',
        url: '/sdk/getting-started',
        active: "nested-url",
        activeSubfolders: [
          "/sdk/getting-started",
          "/sdk/video-component",
          "/sdk/image-component",
          "/sdk/video-component-examples"
        ]
      },
      {
        text: "APIs",
        url: "/api",
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

export function FooterSections(): FooterSection[] {
  // TODO translations and proper links
  return [
    {
      title: "Resources",
      links: [
        {text: "API", url: "/api"},
        {text: "Documentation", url: "/docs"},
        {text: "Guides", url: "/guides"},
        {text: "Examples", url: "/examples"},
      ],
    },
    {
      title: "Support",
      links: [
        {text: "Help Center", url: "/help"},
        {text: "Community", url: "/community"},
        {text: "Contact", url: "/contact"},
        {text: "Status", url: "/status"},
      ],
    },
    {
      title: "Company",
      links: [
        {text: "rixl.com", url: "https://www.rixl.com"},
        {text: "About", url: "/about"},
        {text: "Blog", url: "/blog"},
        {text: "Careers", url: "/careers"},
        {text: "Privacy", url: "/legal/privacy-policy"},
      ],
    },
    {
      title: "Tools",
      links: [
        {text: "CLI", url: "/cli"},
        {text: "SDK", url: "/sdk"},
        {text: "Integrations", url: "/integrations"},
        {text: "Extensions", url: "/extensions"},
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

export function FooterBottomLinks(): { text: string; url: string }[] {
  // TODO translations
  return [
    {text: "Privacy Policy", url: "/legal/privacy-policy"},
    {text: "Terms of Service", url: "/legal/terms-of-service"},
    {text: "Cookie Policy", url: "/legal/cookie-policy"},
  ];
}
