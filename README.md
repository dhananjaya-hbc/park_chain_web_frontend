# Park Chain Web Frontend

A Next.js + TypeScript frontend for the Park Chain project. This repository contains the web UI built with Next.js 16, React 19, and Tailwind CSS (Tailwind v4). It uses modern React features and the new Next.js App Router structure (files under `app/`).

## What's in this project

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Linting**: ESLint

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+ (or use pnpm/bun if you prefer)

Verify you have Node and npm installed:

```bash
node -v
npm -v
```

## Install

Install dependencies with npm:

```bash
npm install
```

If you use pnpm or yarn:

```bash
pnpm install
# or
yarn
```

## Available Scripts

All scripts are defined in `package.json`.

| Script | Description |
| :--- | :--- |
| `npm run dev` | Run the development server. Opens on http://localhost:3000. |
| `npm run build` | Build the production application. |
| `npm run start` | Start the production server after building. |
| `npm run lint` | Run ESLint to check for code quality issues. |

### Running in Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## Environment Variables

If the app requires any environment variables, create a `.env.local` file at the project root. Next.js automatically loads `.env.local` during development.

Example `.env.local`:
```
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Project Structure

- `app/` — Next.js App Router pages, layouts, and global styles.
  - `page.tsx` — The main entry page.
  - `layout.tsx` — Root layout and providers.
  - `globals.css` — Global styles (imports Tailwind CSS).
- `lib/` — Utility functions (e.g., `utils.ts` for class merging).
- `public/` — Static assets like images and fonts.
- `components.json` — Configuration for UI components (shadcn/ui compatible).

