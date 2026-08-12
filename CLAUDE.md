# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, framework-free sportsbook prototype ("MERKUR XTIP — Rocket Boost & Turbo X") demonstrating a gamified odds-boosting mechanic (crash-game style multiplier flight) layered on top of football and basketball betting. Pure `HTML/CSS/JS`, deployed as a static site on Netlify with one serverless function.

## Running / developing

No build step, no package.json, no bundler. It's plain static assets served as-is.

- Open `index.html` directly, or serve the folder with any static server (the repo includes a VS Code Live Server config on port 5501: `.vscode/settings.json`).
- For local password-gated auth, copy `config.example.json` to `config.json` and set `access_password` (this file is gitignored).
- To exercise the Netlify serverless auth path locally: `netlify dev` (requires Netlify CLI). Otherwise the client falls back to `config.json`-based local password checking automatically (see Auth flow below).
- There is no test suite, linter, or build/compile command in this repo.
- `find_lines.js` (`node find_lines.js`) is a throwaway grep-style helper for locating lines in `app.js` matching hardcoded keywords — edit the keyword list inside the file before running it.

## Architecture

Three files carry essentially the whole app:

- **`index.html`** — full DOM: sidebar league tree, betslip, Turbo X rocket cockpit overlay, parlay slot modal, basketball player props panel, Monte Carlo simulator modal, mobile drawer, password auth overlay. Elements are wired to `app.js` functions via inline `onclick`/`oninput`/`onsubmit` handlers (no event delegation framework, no JSX).
- **`styles.css`** — all styling: glassmorphism UI, flight/rocket animations, responsive/mobile layout.
- **`app.js`** (~4700 lines) — everything else: state, rendering, audio synthesis, business logic. It's one big script with no modules; functions are called directly from HTML attributes and reference global `state`.

### Global state (`app.js` top)

A single `state` object holds the entire app: current language, current bet, parlay `selections[]`, basketball `basketSelections[]`, match data (`allMatches`/`matches`), sidebar UI state, and three nested sub-states:
- `state.game` — Turbo X rocket flight run state (`isRunning`, `currentBoost`, `secretMaxBoost`, demo overrides, VIP tier).
- `state.slot` — parlay slot machine spin state (daily spin caps, active boost type/value).
- `state.sim` — Monte Carlo simulator parameters (trials, base margin, DMS toggle, VIP segment).

There is no persistence layer beyond `localStorage` (used only for the auth flag `rocket_boost_auth`).

### Data flow

1. `fetchMerkurFeed()` tries the live Merkur REST API via the Netlify proxy redirects (`/api/merkur-feed` and `/api/merkur-feed-basketball` → `merkurxtip.rs/restapi/...`, configured in `netlify.toml`), and falls back to hardcoded `MOCK_MATCHES` / `MOCK_BASKETBALL_PLAYERS` (top of `app.js`) if the fetch fails.
2. `renderSidebar()` builds the hierarchical Country → League accordion from fetched matches; `selectLeague()` drives which matches render in the main board.
3. Selecting odds (`selectOdds`, `selectBasketOdds`) pushes into `state.selections` / `state.basketSelections` and calls `renderBetslip()` to redraw the ticket.
4. All UI text is looked up through the `i18n` dictionary (`sr`/`en`) via the `t(key)` helper — there is no external i18n library; `toggleLang()` flips `state.lang` and re-renders. Selection display names (e.g. market outcome labels) are centralized through `getSelectionDisplayName()`, which itself calls `t()`.

### Turbo X / rocket boost mechanic (core gimmick)

- `generateSecretMaxBoost()` computes the hidden target multiplier a bet can reach. It combines:
  - **DMS (Dynamic Margin Scaling)**: caps/throttles the boost based on the match's odds margin (`matchMargin`) — low-margin/"Super Kvota" fixtures get capped much lower (max ~8%) to protect house EV.
  - **VIP tier scaling**: `standard`/`gold`/`diamond` each apply a different beta multiplier and cap.
  - A weighted random draw approximating an "Aviator"-style crash curve (fast/medium/high/jackpot bands).
  - `state.game.demoOverride` can force deterministic outcomes (`'6' | '15' | '38' | 'fast_crash'`) for demoing to stakeholders.
- `startRocketLaunch()` / `stopRocket()` / `triggerCrash()` drive the animated flight loop (requestAnimationFrame-based), sounds, and outcome UI (lock-in vs. crash vs. consolation boost).
- Parlay tickets have a separate, mutually-exclusive promo path: the **slot machine** (`spinParlaySlot()`, capped at `state.slot.maxDailySpins` per day) — Pair Turbo X and the Parlay Slot cannot both be active on the same slip.

### Monte Carlo simulator

`runMonteCarloSimulation()` batch-runs the same boost/crash math over thousands of simulated tickets to validate house margin retention under different player behavior profiles, VIP segments, and DMS on/off — used as the stakeholder-facing profitability proof. Simulator UI lives in the `#profitability-simulator-modal`.

### Auth overlay

Password gate in front of the whole app (`#auth-overlay`, `checkAuthStateOnInit`/`handleAuthSubmit` in `app.js`):
1. Tries `POST /api/verify-password` (Netlify redirect → `netlify/functions/verify-password.js`, which checks `process.env.ACCESS_PASSWORD`, default fallback `'rocketboost2026'`).
2. If that endpoint 404s (e.g. running without Netlify), falls back to comparing against `config.json`'s `access_password` (fetched client-side; `config.json` is gitignored — copy from `config.example.json`).
3. On success, sets `localStorage['rocket_boost_auth'] = 'true'` and calls `initSportsbook()` to boot the app.

## Deployment

Netlify static hosting; `netlify.toml` defines the publish dir (`.`), security headers, and three redirects: the football and basketball Merkur live-feed proxies, and the password-verify serverless function proxy. See `README.md` for full deployment steps (drag-and-drop, Netlify CLI, or git-based continuous deployment).
