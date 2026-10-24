# Ragnarok Online Trivia

A web-based trivia game about Ragnarok Online, featuring a monster database with filters and pagination, three trivia game modes, and full monster profiles.

## Features

- **Monster Database**: Browse all monsters with search, filters (race, element, size, level range, MVPs) and pagination
- **Three Trivia Games**:
  - **Guess the Monster**: Identify monsters from their sprites
  - **True or False**: Spot the true (or false) statement about a monster
  - **Item Drops**: Pick a monster that drops the item shown
- **Monster Details**: Attributes, elements, resistances, drops, modes, and spawning maps
- **Gift Box Simulator**: Open boxes for random items with rarity tiers, keep them in an inventory saved in your browser for 24 hours, and trash what you don't want
- **Responsive Design**: Works well on mobile and desktop

## Tech Stack

- **React 19** with React Router
- **Vite** for development and building
- **Tailwind CSS v4** for styling
- **sql.js** for an in-browser SQLite database (no backend)
- **canvas-confetti** for the box-opening celebration (loaded on demand)

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
    collection/   Shared engine for box-opening games: saved inventory with expiry, rarity
                  picker, inventory grid, trash dialogs, reveal panel
    giftbox/      Gift Box Simulator (item pool, rarity rules, box icons)
    trivia/
      name/       Guess the Monster
      facts/      True or False
      drops/      Item Drops
      shared/     RoundComplete screen
  hooks/          useDb (shared database), useRound (queue + score for any game)
  lib/            db (sql.js loader + query), sprites (image URLs), shuffle, storage (safe localStorage)
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

## Collection games (Gift Box)

`features/collection` is a reusable engine; a game only supplies its content: the item `pool`
(each item has a rarity `tier`), the `odds` of each tier, the cosmetic `boxes`, and a `Visual`
component that draws an item. See `features/giftbox/GiftBoxPage.jsx` for a complete example.

- Boxes open in a modal: rumble, zoom out, zoom in with a flash, then the reward and confetti.
  Timings are `DURATIONS` in `features/collection/CollectionGame.jsx`; confetti per rarity is in
  `features/collection/confetti.js`. Nothing is added to the inventory until the reveal.
- The inventory is saved in `localStorage` (key set per game) and expires 24 hours after the
  player's last action. Change `EXPIRY_MODE` or `TTL_MS` in `features/collection/inventory.js`.
- Rarity comes from each item's best drop rate (`features/giftbox/giftBoxPool.js`); the chance of
  each tier is `ODDS` in `features/giftbox/giftBoxConfig.js`.
- Saved data lives only in the visitor's browser, per site address.

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
- `/giftbox` - Gift Box Simulator
