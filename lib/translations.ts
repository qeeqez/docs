export const customTranslations = {
    en: {
        suggestEdits: 'Suggest edits',
        raiseIssue: 'Raise issue',
    },
    ru: {
        suggestEdits: 'Предложить исправления',
        raiseIssue: 'Поднять вопрос',
    },
} as const;

export type TranslationKey = keyof typeof customTranslations.en;
export type Locale = keyof typeof customTranslations;