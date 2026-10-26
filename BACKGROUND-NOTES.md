# Sprite background on every page: notes

Copy these files over your project (same paths) and delete the old file:

```bash
# delete: src/features/home/SpriteBackground.jsx   (it moved to src/components/layout/)
npm run lint && npm run build && npm run dev
```

No new dependencies.

## What changed

- **One background for the whole app.** `components/layout/AppLayout.jsx` wraps every route and owns both the dark page
  color and the sprite background. Because it lives there and not in each page, it keeps drifting when you move between
  pages (no restart, no new random monsters, no flicker) and every page, including the ones you add later, gets it.
- **Pages no longer paint their own background.** `PageShell`, `PageMessage`, `HomePage` and the "monster not found"
  message dropped `bg-page` and became `relative z-10`, so their content sits above the sprites. The only place that
  paints the page color now is `AppLayout`.
- `SpriteBackground.jsx` moved from `features/home/` to `components/layout/` (content unchanged).
- Every page has it: home, database, monster detail, the three trivia games and the Gift Box.

## Tuning

- How visible the sprites are, how many different monsters and how fast they drift: the knobs at the top of
  `components/layout/SpriteBackground.jsx` (`OPACITY`, `PERIOD`, `SPEED`, `CELL`).
- To keep it off one particular page later, that page can't opt out yet; tell me and I'll add a prop to `AppLayout`.

## Things to keep in mind

- On pages with text sitting directly on the dark background (titles, "Page 1 of 31", the Back links) the sprites sit
  behind it at low opacity. If any text feels harder to read, lower `OPACITY`.
- The sprites are animated GIFs running behind every page, which costs some CPU and battery while a page is open. If it
  ever feels heavy, the options are lower `PERIOD` (fewer different monsters), a larger `CELL` (fewer on screen), or a
  static-thumbnail version of the background, or an on/off switch for visitors.

## How it was verified

`npm run lint` clean, `npm run build` passes. 201 automated checks in a simulated browser, all passing. New ones:

- on all 8 route types (including a missing monster id) there is exactly one sprite layer, with 20+ sprites, fixed,
  behind the content, click-through and hidden from screen readers, and the page content sits above it;
- only the layout paints the dark page color;
- moving home → database → home → Gift Box → game keeps the very same background elements and the same monsters.

The old-versus-new comparison of the original pages and games (with the layout wrapper stripped from the new side) shows
no differences other than the ones already known (the new homepage card and "Play again").

**Not verified:** how it looks. Please open a couple of pages in your browser and check that the text is still easy to
read over the sprites.
