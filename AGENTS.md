# Project rules

React + Vite + Tailwind + react-router-dom app ("Ragnarok Online Trivia").
Frontend only: sql.js loads src/assets/monsters.db in the browser.

- Never change behavior while refactoring. UI, routes, SQL results and game rules must stay identical.
- Never edit: public/, src/assets/monsters.db, vercel.json, or dependencies (no new packages).
- Do not run git commit, push, checkout or reset. The developer commits.
- Import paths must match file names exactly, including capitalization (production builds on Linux).
- React hooks must be called before any early return in a component.
- Keep plain JSX. No TypeScript migration.
- After every change set, run `npm run build` and fix errors before continuing.
- Extract a component or hook only when it is used in 2+ places or is a clear unit.