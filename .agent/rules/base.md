---
trigger: always_on
description: Core project guidelines for Rixl Documentation. Apply these rules when working on any code, documentation, or configuration files.
---

# Rixl Documentation

## Project Overview

The official documentation site for Rixl, built with Next.js and Fumadocs. Features MDX-based content, API documentation generation, internationalization support, and static site export. Provides comprehensive guides for the Rixl platform, Video SDK, and API reference.

## Repository Structure

- app/ - Next.js App Router
  - [lang]/ - Internationalized routes
  - api/ - API routes (search, OG image generation)
- components/
  - layout/ - Page layout components
  - mdx/ - MDX rendering components
  - ui/ - Reusable UI primitives
- content/
  - docs/ - MDX documentation content
- lib/ - Utility functions
  - source adapter, translations, OG generation
- public/ - Static assets
- scripts/ - Build and utility scripts
  - lint.ts - Custom linting
  - generate-api-docs.ts - API docs generation

## Technology Stack

- TypeScript 5.9 (strict type safety required)
- Bun (package manager and runtime)
- Next.js 16 with App Router
- React 19
- Fumadocs (documentation framework)
  - fumadocs-core, fumadocs-ui, fumadocs-mdx
  - fumadocs-openapi (API documentation)
- TailwindCSS 4 (styling)
- Radix UI (accessible UI primitives)
- MDX (documentation content)
- Shiki (syntax highlighting)
- Orama (search functionality)
- next-themes (dark mode support)

## Available Commands

```bash
bun dev       # Start Next.js development server
bun run build     # Lint + Next.js production build
bun serve     # Serve static build output
bun lint      # Run Oxlint + fumadocs-mdx + custom lint
bun lint:fix  # Auto-fix Oxlint issues
bun format    # Format code with Oxfmt
```

## Documentation Content (MDX)

### Writing documentation

- Place MDX files in `content/docs/`
- Use frontmatter for metadata (title, description, etc.)
- Follow Fumadocs conventions for file organization
- Use MDX components from `components/mdx/` for rich content
- Include code examples with proper syntax highlighting

### MDX rules

- Keep pages focused on a single topic
- Use clear, concise language
- Include practical code examples
- Link to related documentation
- Keep code examples up-to-date with the SDK

## TypeScript Requirements

- Never use `any` types – Always use proper TypeScript types
- Prefer explicit interfaces and type definitions
- Use generics when appropriate for reusable components
- Leverage type inference where it improves readability

## Component Design Rules

### Do:

- Split components into small, focused units (single responsibility principle)
- Keep components under 150 lines
- Extract reusable logic into custom hooks
- Create one component per file
- Prefer composition over monolithic components
- Co-locate related components in the same directory

### Don't:

- Create components with multiple responsibilities
- Duplicate code – extract and reuse instead
- Put multiple component definitions in one file
- Use inline styles – use Tailwind classes instead

## Static Export

This project uses Next.js static export (`output: 'export'`):
- All pages are pre-rendered at build time
- No server-side rendering
- API routes are build-time only (search index, OG images)
- Output directory: `out/`

## Linting

The project uses multiple linting tools:
- Oxlint for TypeScript/React code
- fumadocs-mdx for MDX content validation
- Custom lint script for additional checks

Always run `bun lint` before committing.

## Step By Step Dev

- When developing, do a step by step approach
- Commit every step
- Always run linting before committing
- Commit only what was changed by step
- Use conventional commits
