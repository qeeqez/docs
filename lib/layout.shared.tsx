import type {BaseLayoutProps} from "fumadocs-ui/layouts/shared";
import type {FooterSection} from "@/components/layout/home/footer-content-section";
import DiscordIcon from "@/public/socials/discord.svg";
import GithubIcon from "@/public/socials/github.svg";
import XIcon from "@/public/socials/x.svg";
import YoutubeIcon from "@/public/socials/youtube.svg";

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
        <>
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Logo">
            <circle cx={12} cy={12} r={12} fill="currentColor" />
          </svg>
          My App
        </>
      ),
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [
      {
        // icon: <BookIcon />,
        text: "Docs",
        url: "/docs",
        // secondary items will be displayed differently on navbar
        secondary: false,
      },
      {
        // icon: <BookIcon />,
        text: "API Reference",
        url: "/api",
        // secondary items will be displayed differently on navbar
        secondary: false,
      },
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
        {text: "About", url: "/about"},
        {text: "Blog", url: "/blog"},
        {text: "Careers", url: "/careers"},
        {text: "Privacy", url: "/privacy"},
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
        {text: "X", url: "https://twitter.com/...", external: true, Icon: XIcon},
        {text: "Discord", url: "https://discord.gg/...", external: true, Icon: DiscordIcon},
        {text: "YouTube", url: "https://youtube.com/...", external: true, Icon: YoutubeIcon},
        {text: "GitHub", url: "https://github.com/...", external: true, Icon: GithubIcon},
      ],
    },
  ];
}

export function FooterBottomLinks(): {text: string; url: string}[] {
  // TODO translations and proper links
  return [
    {text: "Privacy Policy", url: "/privacy"},
    {text: "Terms of Use", url: "/terms"},
    {text: "Cookie Preferences", url: "/cookies"},
  ];
}
