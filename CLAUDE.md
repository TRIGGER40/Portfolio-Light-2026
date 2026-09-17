# midhun-portfolio-v2

Second iteration of Midhun Krishnakumar's personal portfolio. Features 3D elements via React Three Fiber, an AI assistant backed by Anthropic + OpenAI, an easter egg discovery system, and PDF resume export.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript ~5.6 |
| Build | Vite 6 |
| 3D | React Three Fiber v9 + @react-three/drei + Three.js 0.183 |
| Animations | Framer Motion v12 |
| AI | Anthropic SDK v0.32 + OpenAI v6 |
| PDF | @react-pdf/renderer v4 |
| Server | Express 5 + local-api.mjs |
| Routing | React Router DOM v7 |

## Commands

```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # TypeScript check + Vite build → dist/
npm run preview      # Preview production build
npm run lint         # ESLint check
```

## Project Structure

```
midhun-portfolio-v2/
├── src/
│   ├── App.tsx                    # Root — routing, easter egg system, analytics
│   ├── components/
│   │   ├── easter-egg/            # DiscoveryModal, ProgressModal, CompletionOverlay, ManifestoModal
│   │   └── ...                    # Nav, Hero, Work, CursorEffect, ThemeSwitcher, etc.
│   ├── context/                   # EasterEggContext
│   ├── data/                      # articles, portfolioData (case studies)
│   ├── hooks/                     # useScrollRestoration, etc.
│   └── lib/                       # Analytics init (scroll, geo tracking)
├── api/                           # Vercel serverless functions
├── scripts/                       # Build/deploy helpers
├── local-api.mjs                  # Local Express API proxy
└── vercel.json
```

## Rules

- **3D performance**: keep Three.js scene complexity low. Use `@react-three/drei` helpers (e.g. `useGLTF`, `Environment`) rather than raw Three.js where possible. Dispose geometries/materials in cleanup.
- **AI calls server-side**: Anthropic and OpenAI keys must never appear in frontend bundles. Route all AI calls through `local-api.mjs` (local) or `api/` (Vercel).
- **Easter egg system**: new interactions that should be discoverable must be registered in `EasterEggContext`. Do not add hidden behaviors outside that context.
- **Framer Motion for all transitions**: no CSS `transition` on animated layout properties.
- **No em dashes**: rephrase copy with a period or comma instead.
- **Deployment**: always confirm before `vercel deploy` or force-pushing.
