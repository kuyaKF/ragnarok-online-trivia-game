# Refactor notes

Same app, same look, same behavior. The code is reorganized so shared UI and colors live in one place.

## How to apply

```bash
git status                        # should be clean
git switch -c refactor/structure
```

1. Delete the old `src/` folder, then copy this zip's `src/` in (it includes `src/assets/monsters.db`, unchanged).
2. Copy these root files over yours: `package.json`, `package-lock.json`, `vite.config.js`, `jsconfig.json`, `README.md`, `AGENTS.md`.
3. Leave `public/`, `index.html`, `vercel.json`, `.gitignore` and `eslint.config.js` as they are.
4. Do **not** commit `proposal.txt` (Tailwind scans every file in the project and it adds a stray class to your CSS).

```bash
npm run lint && npm run build && npm run dev
git add -A && git commit -m "refactor: feature folders, shared UI, theme tokens"
```

No dependencies changed, so no `npm install` is needed. Vercel will build the branch as a preview URL before you merge.

## What changed

| Before | After |
|---|---|
| `App.jsx` (452 lines: routes + 2 pages + 4 helpers) | `app/App.jsx` routes only; `features/database/` has the list page, detail page, `FilterBar`, `MonsterTable`, `Pagination`, `filters.js`, `queries.js`, `elementStyles.js` |
| `Home.jsx`, `SpriteBackground.jsx` | `features/home/HomePage.jsx`, `SpriteBackground.jsx` |
| `db.js` (loader + query + hook) | `lib/db.js` (loader + query), `hooks/useDb.js` |
| `trivia/*Page.jsx`, `*.js` | `features/trivia/{name,facts,drops}/` (page + logic together), `shared/RoundComplete.jsx` |
| `shuffle` hidden inside `nameGuess.js` | `lib/shuffle.js` |
| `itemSprite.js` | `lib/sprites.js` (monster and item sprite URLs) |
| Tailwind color classes copy-pasted in every page | tokens in `styles/theme.css`; shared pieces in `components/ui` and `components/layout` |
| Loading/error wrapper + queue/index/score/answered state repeated in 3 games and 3 pages | `DbGate`, `useRound`, `GameShell`, `PageShell`, `Banner`, `Panel`, `OptionButton`, `RoundComplete` |

Removed (unused): `App.css`, `src/assets/hero.png`, `react.svg`, `vite.svg`.

`@` is now an alias for `src` (see `vite.config.js` and `jsconfig.json`).

### Theme tokens

`styles/theme.css` defines 36 tokens, each pointing at a palette color (`--color-page: var(--color-gray-950)`).
Use them as normal utilities: `bg-page`, `bg-panel`, `text-muted`, `border-line`. Changing a value there restyles
the whole app. Raw palette classes remain only where the color is part of the content: element badges, MVP/guild
badges, homepage card cover colors, and white text on buttons and cover images.

### Small fixes made along the way

- `Home.jsx` had a stray pasted JSX block at the top (my example snippet from earlier); it is gone, which is what made lint fail.
- Unused `useEffect` import removed.
- `getDb()` no longer caches a failed download, so a transient network error can recover without a page reload.
- Package name is now `ragnarok-online-trivia`; README port corrected (Vite's default is 5173).

## Behavior notes

- `useRound(buildQueue)` owns only queue, position and score. Each game keeps its own input state inside a
  question component rendered with `key={question id}`, so it resets by itself for every new question.
- The two games' option buttons look slightly different from each other; this was kept exactly as it was
  (`OptionButton` has `row` and `card` layouts).
- One class-level difference: the "Play again" button now also carries `disabled:` styles. The button is never
  disabled, so nothing changes visually.

## How it was verified

- `npm run lint`: clean (it had 2 errors before). `npm run build`: passes, bundle size about the same.
- A side-by-side test drove the **old and new app** in a simulated browser with the real database and the same
  seeded "random" questions, and compared the full page structure and class names at **64 checkpoints**
  (token classes mapped back to the original palette names using `theme.css`): every route, every database filter and
  pagination button, and complete rounds of all three games through "Round complete" and "Play again"
  (601, 601 and 1,080 questions). The only difference was the "Play again" class noted above.
- All 45 token classes used in the code exist in the built CSS, and all 36 tokens resolve to a palette color.

**Not verified** (please check in a browser): how it looks on screen (hover and focus states and mobile layout were
compared as class names, not rendered), the animated homepage background, and loading the database at runtime in
the browser (the test replaced the browser-only loader; the production build does resolve the `.db` and wasm files).
Quick smoke test with `npm run dev`: homepage, `/db` (filter + next page), `/db/1713`, and one question in each game.

## Not touched (needs your decision)

- `index.html` links `favicon.ico` with an SVG type, and the apple-touch and android icons in `public/` aren't linked.
- `public/covers/*.jpg` don't exist, so homepage cards fall back to their solid colors (and make 3 failed requests).
- `public/257284.png` and `public/icons.svg` are unused.
- `@types/react` and `@types/react-dom` aren't needed in a JavaScript project.
