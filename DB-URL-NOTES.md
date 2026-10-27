# Database pagination strip, URL state and 404 pages: notes

Copy these files over your project (same paths). Nothing to delete, no new dependencies.

```bash
npm run lint && npm run build && npm run dev
```

## 1. Pagination above the table

The same strip (page text plus First / Prev / Next / Last) now also sits right under the filter panel. Both strips
stay in step. Clicking the one at the bottom scrolls you back to the top; the top one doesn't scroll.

## 2. The page and filters live in the address

`/db?page=2&q=poring&race=Dragon&element=Fire&size=Large&min=50&max=70&mvp=1&guild=1`

Only values that differ from the defaults are written, so the plain list is just `/db`.

- **"Back to database" returns to the page you came from.** Each monster link remembers the list address it was
  clicked from (`?page=2` ...), and the detail page's back link uses it. If you open a monster link directly or from
  somewhere else, it goes to plain `/db`.
- **Browser Back/Forward and refresh work too.** Turning a page adds a history entry (Back steps through pages);
  changing a filter replaces the current one (Back doesn't step through every filter change). A new filter starts at
  page 1. Links can be shared.
- **Bad addresses don't break anything.** `?page=abc`/`0`/`-3` show page 1, a page past the end shows the last page,
  and an unknown race or a non-number level is ignored.
- **Text boxes (search, Min and Max level)** show what you type immediately and update the address and the list about
  0.3 s after you stop typing. They also follow the address when it changes by itself (Back button, Reset filters,
  a pasted link). This is what `src/hooks/useSyncedDraft.js` does; typing straight into the address would make the
  box drop characters while React Router updates.
- **Scroll position:** moving to a different page starts at the top (`ScrollToTop`), but not on browser Back/Forward
  (the browser restores your position) and not when you just turn a database page.

## 3. 404 pages

- Any address no page matches now shows a "404 · Page not found" page (dark page with the sprite background) with a
  "Back to the homepage" button and a link to the database. Before, nothing matched and the page was blank.
- An unknown monster (`/db/999`, `/db/abc`) uses the same page ("Monster not found") with its main button taking you
  back to the database, to the list page you came from if you came from one.
- Heads-up: on Vercel the server still answers these with a normal 200 status, because every address is sent to your
  single page app. Visitors see the 404 page, but search engines don't get a real 404. That is normal for this kind of site.

## Files

New: `components/layout/NotFound.jsx`, `ScrollToTop.jsx`, `features/not-found/NotFoundPage.jsx`, `hooks/useSyncedDraft.js`.
Changed: `app/App.jsx` (catch-all route), `AppLayout.jsx`, `ui/Button.jsx` (new `ButtonLink`), and in
`features/database/`: `DatabasePage`, `FilterBar`, `MonsterTable`, `MonsterDetailPage`, `Pagination`, `filters.js`.
README updated.

## How it was verified

`npm run lint` clean, `npm run build` passes. 121 new automated checks in a simulated browser (all pass), on top of the
201 from before (all still pass):

- both strips: present, in the right place, in step, buttons disabled at the ends, top doesn't scroll, bottom does;
- your Munak case: page 2, open the first monster, "Back to database" returns to page 2 with the same rows, and the
  same with a filter and a later page; direct visits, and tampered link state (`javascript:` and full URLs are refused);
- Back/Forward through pages; filter changes replace instead of adding history; a new filter resets to page 1;
- bad and good addresses; every filter reading and writing the address; Reset;
- typing: instant display, delayed address, trailing spaces kept, two boxes typed together both landing, the box
  following Back and Reset, and a pending search being cancelled by Reset;
- 404 for unknown paths, nested paths and unknown monsters, with the background and working buttons;
- scrolling rules.

Comparing the old and new app side by side across all the earlier pages and flows now shows differences only
where intended (homepage card, the database's top strip, the monster-not-found page, "Play again").
One real bug was found by these tests and fixed before delivery: turning a page with the top strip was also scrolling
the page to the top.

**Not verified:** how it looks (the 404 page and the second strip) and real-browser details like exactly how Back restores
your scroll position.
