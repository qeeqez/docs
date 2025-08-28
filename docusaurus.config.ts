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

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'es', 'fr', 'it', 'pl', 'ru', 'tr', 'uk'],
    localeConfigs: {
      en: {label: 'English'},
      de: {label: 'Deutsch'},
      es: {label: 'Español'},
      fr: {label: 'Français'},
      it: {label: 'Italiano'},
      pl: {label: 'Polski'},
      ru: {label: 'Русский'},
      tr: {label: 'Türkçe'},
      uk: {label: 'Українська'},
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
            routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
          pages: {
              exclude: [
                  '**/_*.{js,jsx,ts,tsx,md,mdx}',
                  '**/*.test.{js,ts}',
                  '**/index.{js,jsx,ts,tsx}',
              ],
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
    // TODO: Replace with RIXL's social card
    image: 'img/apple-touch-icon.png',
    navbar: {
      title: 'RIXL',
      logo: {
        alt: 'RIXL Logo',
        src: 'img/apple-touch-icon.png',
      },
      items: [
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
                html:
                    ` 
                        <span style="color: #fff">
                          Copyright © ${new Date().getFullYear()} RIXL, Inc.
                        </span>
                    `
            },
          {
              html:
                  ` 
                        <a href="https://rixl.com/privacy-policy" target="_blank" rel="noreferrer noopener" aria-label="Deploys by Netlify" style="color: #fff">
                          Privacy Policy
                        </a>
                    `
          },
              {
                  html:
                      ` 
                            <a href="https://rixl.com/terms-of-use" target="_blank" rel="noreferrer noopener" aria-label="Deploys by Netlify" style="color: #fff">
                              Terms of Use
                            </a>
                        `
              },

          ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
