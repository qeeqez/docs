---
trigger: always_on
description: Frontend code style rules for the RIXL Dashboard.
---

## TypeScript

- Keep strict typing.
- Do not use `any`.
- Use generics only when they improve correctness.
- Use `@/*` for `src/*` imports.

## Structure & Components

- Co-locate feature components, hooks, types, and helpers.
- Keep components small and focused.
- Prefer composition over large components.
- Keep one exported component or hook per file.
- Keep props minimal.
- Extract non-trivial logic into hooks.
- Do not mix data fetching and heavy transformation into UI components.

## Data

- Keep API calls out of presentational components.
- Handle errors by code, not message text.
- Keep loading, empty, error, and success states explicit.

## Styling

- Use Tailwind utilities.
- Avoid inline styles unless needed.
- Reuse existing UI patterns and shadcn components.

## i18n

- Do not hardcode user-facing strings.
- Use `useTranslation` and translations from `public/locales`.
