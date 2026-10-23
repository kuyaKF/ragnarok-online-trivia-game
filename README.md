# Ragnarok Online Trivia

A web-based trivia game about Ragnarok Online, featuring a monster database with filters and pagination, three trivia game modes, and full monster profiles.

## Features

- **Monster Database**: Browse all monsters with search, filters (race, element, size, level range, MVPs) and pagination
- **Three Trivia Games**:
  - **Guess the Monster**: Identify monsters from their sprites
  - **True or False**: Spot the true (or false) statement about a monster
  - **Item Drops**: Pick a monster that drops the item shown
- **Monster Details**: Attributes, elements, resistances, drops, modes, and spawning maps
- **Responsive Design**: Works well on mobile and desktop

## Tech Stack

- **React 19** with React Router
- **Vite** for development and building
- **Tailwind CSS v4** for styling
- **sql.js** for an in-browser SQLite database (no backend)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the dev server (Vite default: `http://localhost:5173`) |
| `npm run build` | Builds the production app |
| `npm run lint` | Runs ESLint |
| `npm run preview` | Previews the production build locally |

## Project structure

```
src/
  app/            App.jsx - routes only
  components/
    ui/           Reusable building blocks: Button, Panel, Banner, SpriteBox, Stat,
                  Section, Badge, Input, Select, OptionButton
    layout/       PageShell, GameShell, DbGate, BackLink, PageMessage
  features/
    home/         Homepage and the animated sprite background
    database/     Monster list and detail pages (filters, queries, table, pagination)
    trivia/
      name/       Guess the Monster
      facts/      True or False
      drops/      Item Drops
      shared/     RoundComplete screen
  hooks/          useDb (shared database), useRound (queue + score for any game)
  lib/            db (sql.js loader + query), sprites (image URLs), shuffle
  styles/         theme.css (color tokens), animations.css
  assets/         monsters.db
```

Import app code with the `@` alias: `import Button from '@/components/ui/Button'`.

## Theming

All colors that define the look of the app live in `src/styles/theme.css` as tokens
(`bg-page`, `bg-panel`, `text-muted`, `border-line`, ...). Each token points at a color in
Tailwind's palette, so changing one line there restyles the whole app. Components use the
tokens, never raw colors. The exceptions are domain colors with their own meaning: element
badges (`features/database/elementStyles.js`), MVP and guild badges, and the cover colors
of the homepage cards.

## Adding a trivia game

1. Create `src/features/trivia/<game>/` with the question logic (`<game>.js`) and a page component.
2. In the page, wrap everything in `<DbGate>`, use `useRound(buildQueue)` for queue, score and
   next/restart, and render each question in its own component with `key={question id}`
   so its input state resets automatically. Use `GameShell`, `Panel`, `Banner`, `Button`,
   `OptionButton` and `RoundComplete` for the UI.
3. Add a route in `src/app/App.jsx` and a card in `GAMES` in `src/features/home/HomePage.jsx`.

## Database

Monster data is loaded from `src/assets/monsters.db` using sql.js (WebAssembly). It contains
monster stats, elements, resistances, drops, and spawning locations. Sprites are served from
`public/sprites` (monsters) and `public/items` (item icons).

## Routes

- `/` - Home page
- `/db` - Monster database
- `/db/:id` - Monster profile
- `/trivia/name` - Guess the Monster
- `/trivia/facts` - True or False
- `/trivia/drops` - Item Drops
