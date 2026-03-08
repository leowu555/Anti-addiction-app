# Monk Mode

**Turn doomscrolling into brain training.** A hackathon project that interrupts passive scrolling and replaces it with a scientifically-backed 2-Back working memory game.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 and tap **Simulate Doomscroll** to demo the flow.

## Demo Flow

1. **Home** → Dashboard with Focus Score and achievements
2. **Simulate Doomscroll** → Triggers interruption modal (or scroll >45s / 2500px)
3. **Interruption Modal** → "Start 2-Back Challenge"
4. **2-Back Game** → 60-second cognitive task
5. **Stats Screen** → Accuracy, reaction time, working memory score
6. **Back to Dashboard** → See updated Focus Score

## Key Files

| File | Purpose |
|------|---------|
| `src/utils/gameLogic.ts` | 2-Back sequence generation, match detection |
| `src/utils/metrics.ts` | localStorage-backed stats, streaks, achievements |
| `src/hooks/useDoomscrollDetector.ts` | Simulated doomscroll detection (time/scroll thresholds) |
| `src/hooks/useTwoBackGame.ts` | Game state, timing, scoring |
| `src/components/Game/TwoBackGame.tsx` | Main game UI and flow |
| `src/App.tsx` | Routing + interruption modal |

## Tech Stack

- React + TypeScript + Vite
- TailwindCSS (dark mode, cyan/purple palette)
- Local storage for persistence
- PWA (manifest + service worker via vite-plugin-pwa)
- React Router

## Chrome Extension

Detects doomscrolling on TikTok, Instagram, and YouTube, then shows an interruption overlay with a link to the 2-Back game.

**Install:**
1. Build the app: `npm run build`
2. Run the app: `npm run preview` (or deploy it)
3. In Chrome, go to `chrome://extensions`
4. Enable "Developer mode"
5. Click "Load unpacked" and select the `extension` folder

**Configure:** Right-click the extension icon → Options, and set the 2-Back game URL (default: `http://localhost:5173/game`). Use your deployed URL when in production.

**Triggers:** After 45 seconds of continuous scrolling or 2500px scrolled on TikTok/Instagram/YouTube.

---

## PWA Installation

- Run `npm run build` then `npm run preview`
- In Chrome/Edge on mobile or desktop: Add to Home Screen / Install
- Or use the **Install App** button when shown on the homepage

## License

MIT
