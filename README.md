# AURORA — Stream Beyond

A Netflix-inspired streaming UI built with **Vue 3 + Vite + TypeScript** for a Multimedia class case project. Same UX rhythm as Netflix (hero, content rows, detail, my list, search), but a distinct visual identity — dark base with an aurora gradient (fuchsia → violet → cyan) and gradient "poster cards" rendered in pure CSS instead of stock imagery.

## Features

- **Auto-rotating hero banner** with featured Aurora Originals
- **Horizontally-scrolling content rows** — Trending, Top 10 (with the giant outlined rank numbers), New & Noteworthy, Films, Series
- **Title detail pages** with synopsis, cast, episodes (for series), and "More Like This" recommendations
- **My List** — persists to `localStorage`
- **Search** with live filtering across name, genre, cast, synopsis
- **Browse / Movies / Series / New & Popular** with genre chips and sort
- **Login / Sign-up** flow with animated aurora blobs background
- **Profile** page with avatar picker, plan switcher, and recently-saved row
- **Responsive** down to mobile widths

## Stack

- Vue 3 (`<script setup>` + TypeScript)
- Vue Router
- Vite
- Tailwind v4 (via `@tailwindcss/vite`) — most styling is scoped component CSS for granular control

## Project structure

```
src/
  Pages/        Home, Browse, TitleDetail, MyList, Search, Profile, Login, Navbar
  components/   Row, PosterCard
  composables/  useAuth, useMyList
  data/         titles.ts (12 fictional originals)
  model/        title.ts (types)
  router/       index.ts
```

## Setup

```sh
npm install
npm run dev
```

Build:

```sh
npm run build
```
