# Rixl Documentation

Documentation site built with **TanStack Start**, **Fumadocs v16.2**, **Bun**, **Tailwind CSS v4**, and **React 19**.

## 🚀 Quick Start

### Install Dependencies
```bash
bun install
```

### Development
```bash
bun dev
```
Visit: http://localhost:3000

### Build
```bash
bun build
```

### Production
```bash
bun start
```

## 📁 Project Structure

```
docs/
├── app/
│   ├── routes/          # TanStack Router routes
│   │   ├── __root.tsx   # Root layout
│   │   ├── index.tsx    # Home page
│   │   └── $lang.*.tsx  # Docs routes
│   ├── client.tsx       # Client entry
│   ├── server.tsx       # Server entry
│   └── global.css       # Global styles
├── components/          # React components
├── lib/                 # Utilities
├── content/             # MDX documentation
│   └── docs/
│       └── en/          # English docs
├── vite.config.ts       # Vite config
└── package.json
```

## 🛠️ Tech Stack

- **Framework**: TanStack Start
- **Build Tool**: Vite (⚡ fast HMR)
- **SSR**: Nitro
- **Router**: TanStack Router
- **Docs**: Fumadocs v16.2
- **Styling**: Tailwind CSS v4
- **Runtime**: Bun
- **Language**: TypeScript

> **Note**: TanStack Start now uses **Vite** (migrated from Vinxi). See `VITE_UPDATE.md` for details.

## 📝 Available Scripts

```bash
bun dev          # Start dev server with HMR
bun build        # Build for production
bun start        # Start production server
bun serve        # Serve static build
bun lint         # Run linter
bun lint:fix     # Fix linting issues
bun format       # Format code
```

## 🔥 Recent Migration

This project was recently migrated from Next.js to TanStack Start. See:
- `MIGRATION_COMPLETE.md` - Migration summary
- `README.migration.md` - Technical details
- `QUICKSTART.md` - Getting started guide
- `FINAL_CHECKLIST.md` - Pre-launch checklist

## 📚 Documentation

- [TanStack Start](https://tanstack.com/start/latest)
- [TanStack Router](https://tanstack.com/router/latest)
- [Fumadocs](https://fumadocs.vercel.app/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🚀 Deployment

Configured for **Cloudflare Pages** by default. To deploy:

```bash
bun build
# Upload .output/public to Cloudflare Pages
```

For other platforms, configure deployment settings in `vite.config.ts`.

## 📄 License

See LICENSE.md

---

Built with ❤️ by the Rixl team
