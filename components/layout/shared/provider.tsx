'use client';

import {defineI18nUI} from "fumadocs-ui/i18n";
import {RootProvider} from 'fumadocs-ui/provider/base';
import dynamic from 'next/dynamic';
import type {ReactNode} from 'react';
import {CustomTranslationProvider} from "@/components/custom-translation-provider";
import {i18n} from "@/lib/i18n";

const SearchDialog = dynamic(() => import('@/components/search'), {
  ssr: false,
});

const {provider} = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: 'English',
      search: 'Search',
      toc: 'On This Page',
      tocNoHeadings: 'No headings found',
      lastUpdate: 'Last updated on',
      searchNoResult: 'No results found',
      chooseLanguage: 'Choose Language',
      chooseTheme: 'Choose Theme',
    },
    // TODO: Uncomment to enable ru
    // ru: {
    //     displayName: 'Русский',
    //     search: 'Искать',
    //     toc: 'На этой странице',
    //     tocNoHeadings: 'Заголовки не найдены',
    //     lastUpdate: 'Последнее обновление',
    //     searchNoResult: 'Ничего не найдено',
    //     chooseLanguage: 'Выберите язык',
    //     chooseTheme: 'Выберите тему',
    // },
  },
});

export function Provider({children, lang}: { children: ReactNode, lang: string }) {
  return (
    <RootProvider
      i18n={provider(lang)}
      search={{SearchDialog}}
    >
      <CustomTranslationProvider locale={lang}>
        {children}
      </CustomTranslationProvider>
    </RootProvider>
  );
}
