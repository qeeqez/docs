export const customTranslations = {
    en: {
        suggestEdits: 'Suggest edits',
        raiseIssue: 'Raise issue',
        home: "Home",
        sdk: "SDKs",
        api: "APIs"
    },
    ru: {
        suggestEdits: 'Предложить исправления',
        raiseIssue: 'Поднять вопрос',
        home: "Дом",
        sdk: "SDKs",
        api: "APIs"

    },
} as const;

export type TranslationKey = keyof typeof customTranslations.en;
export type Locale = keyof typeof customTranslations;