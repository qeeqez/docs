'use client';

import React, { createContext, useContext } from 'react';
import { customTranslations, type TranslationKey, type Locale } from '@/lib/translations';

interface TranslationContextType {
    t: (key: TranslationKey) => string;
    locale: string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface CustomTranslationProviderProps {
    locale: string;
    children: React.ReactNode;
}

export function CustomTranslationProvider({ locale, children }: CustomTranslationProviderProps) {
    const validLocale = (locale as Locale) || 'en';

    const t = (key: TranslationKey): string => {
        return customTranslations[validLocale]?.[key] || customTranslations.en[key];
    };

    return (
        <TranslationContext.Provider value={{ t, locale: validLocale }}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useCustomTranslations() {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useCustomTranslations must be used within a CustomTranslationProvider');
    }
    return context;
}