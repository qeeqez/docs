import { customTranslations, type TranslationKey, type Locale } from '@/lib/translations';

export function getServerTranslations(locale: string) {
    const validLocale = (locale as Locale) || 'en';

    const t = (key: TranslationKey): string => {
        return customTranslations[validLocale]?.[key] || customTranslations.en[key];
    };

    return { t, locale: validLocale };
}