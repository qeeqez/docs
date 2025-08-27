import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'RIXL Docs',
  tagline: 'Your Next Media Cloud',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'RIXL', // Usually your GitHub org/user name.
  projectName: 'Documentation', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
      locales: ['en', 'ru', 'uk', 'tr', 'pl', 'it', 'fr', 'es', 'de'],
      localeConfigs: {
          en: { label: 'English' },
          ru: { label: 'Русский' },
          uk: { label: 'Українська' },
          tr: { label: 'Türkçe' },
          pl: { label: 'Polski' },
          it: { label: 'Italiano' },
          fr: { label: 'Français' },
          es: { label: 'Español' },
          de: { label: 'Deutsch' },
      },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // Versioning switcher
  // plugins: [
  //   [
  //       '@docusaurus/plugin-content-docs',
  //       {
  //           id: 'api',
  //           path: 'api',
  //           routeBasePath: 'api',
  //           sidebarPath: require.resolve('./sidebars.js'),
  //       },
  //   ],
  // ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'RIXL',
      logo: {
        alt: 'RIXL Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'right',
          label: 'Documentation',
        },
        {to: '/api', label: 'API', position: 'right'},
        {to: 'https://dash.rixl.com/', label: 'Dashboard', position: 'right'},
          {
              type: 'localeDropdown',
              position: 'right',
          },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Documentation',
              to: '/docs/intro',
            },
            {
              label: 'API Reference',
              to: '/api',
            },
          ],
        },
        {
          title: 'External',
          items: [
              {
                  label: 'Dashboard',
                  href: 'https://dash.rixl.com/',
              },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'TikTok',
              href: 'https://www.tiktok.com/@rixlofficial',
            },
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/@rixlcloud',
            },
            {
              label: 'X',
              href: 'https://x.com/RixlCloud',
            },
              {
                  label: 'Telegram',
                  href: 'https://t.me/rixlcloud',
              },
              {
                  label: 'Instagram',
                  href: 'https://www.instagram.com/rixlcloud',
              },
              {
                  label: 'LinkedIn',
                  href: 'https://linkedin.com/company/rixl',
              },
              {
                  label: 'Discord',
                  href: 'https://discord.gg/GZr8G3KgcH',
              },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/qeeqez',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
