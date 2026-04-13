# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (accessible on local network via --host)
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally
```

No linter, formatter, or test runner is configured. There are no tests in this codebase.

Deploy by dragging the `dist/` folder to Netlify.

## Architecture

**PatellarFix** is a React 18 + Vite PWA for patellar tendinopathy rehabilitation. It has no backend — all data lives in `localStorage` under the key `patellarfix_v1`.

### Navigation & Modals

`App.jsx` owns top-level state: which of the 4 tabs is active (`home`, `today`, `progress`, `settings`) and whether session mode is open. There is no React Router — navigation is conditional rendering. Overlays (Onboarding, SessionMode, ExerciseDetail) are rendered as full-screen layers on top of the tab content.

### State Management

`src/store/useAppStore.js` is a custom hook (not Zustand/Redux) wrapping `useState` + `useEffect` for localStorage sync. It holds:
- `profile`: onboarding answers, `currentPhase` (1–3), `startDate`
- `sessions`: array of completed session records

Key computed values returned by the hook: `currentStreak`, `longestStreak`, `todayComplete`, `totalCompleted`.

Phase advancement logic lives in `checkPhaseAdvancement()`: Phase 2 unlocks after 2 weeks + 4 full sessions; Phase 3 after 8 weeks + 16 full sessions.

### Exercise Data

`src/data/exercises.js` is the single source of truth for all exercise content. Key exports:
- `PHASES`: metadata (title, color, icon) for phases 1–3
- `STRENGTH_EXERCISES`: keyed by phase number, 2–4 exercises each
- `STRETCH_EXERCISES`: 5 exercises, shown every day
- `getSessionType(date)` → `'full'` (Mon/Wed/Fri) or `'stretch'` (all other days)
- `getSessionExercises(phase, type)` → array of exercises for the session
- `determineStartingPhase(painLevel, duration)` → 1 or 2, used during onboarding

Each exercise object has: `name`, `category`, `sets`, `reps`, `restTime`, `instructions[]`, `tips[]`, `videoUrl`, `researchUrl`.

### Styling

All styles are in `src/index.css` using CSS custom properties. No Tailwind or component library. The design is mobile-first, targeting iOS Safari with `safe-area-inset` padding and `viewport-fit=cover`. The `base: './'` in `vite.config.js` ensures asset paths work for offline PWA usage.
