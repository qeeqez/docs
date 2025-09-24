import "@/app/global.css";
import {NextProvider} from "fumadocs-core/framework/next";
import {TreeContextProvider} from "fumadocs-ui/contexts/tree";
import {RootProvider} from 'fumadocs-ui/provider';
import {defineI18nUI} from 'fumadocs-ui/i18n';
import {Inter} from "next/font/google";
import type {ReactNode} from "react";
import {cn} from "@/lib/cn";
import {source} from "@/lib/source";
import {Provider} from "@/provider";
import {i18n} from '@/lib/i18n';
import { CustomTranslationProvider } from '@/components/custom-translation-provider';

const inter = Inter({
    subsets: ["latin"],
    display: 'swap',
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
        ru: {
            displayName: 'Russian',
            search: 'Искать',
            toc: 'На этой странице',
            tocNoHeadings: 'Заголовки не найдены',
            lastUpdate: 'Последнее обновление',
            searchNoResult: 'Ничего не найдено',
            chooseLanguage: 'Выберите язык',
            chooseTheme: 'Выберите тему',
        },
    },
});

interface LayoutProps {
    params: Promise<{ lang: string }>;
    children: ReactNode;
}

export default async function Layout({children, params}: LayoutProps) {
    const lang = (await params).lang;
    const tree = source.pageTree[lang] ?? source.pageTree;

    return (
        <html lang={lang} className={cn(
            "scroll-smooth overscroll-y-none",
            inter.className
        )} suppressHydrationWarning>
        <body>
        <NextProvider>
            <RootProvider i18n={provider(lang)}>
                <CustomTranslationProvider locale={lang}>
                <TreeContextProvider tree={tree}>
                    <Provider>
                        {children}
                    </Provider>
                </TreeContextProvider>
                    </CustomTranslationProvider>
            </RootProvider>
        </NextProvider>
        </body>
        </html>
    );
}
