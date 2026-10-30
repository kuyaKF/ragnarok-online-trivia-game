# Hover effect on the background sprites: notes

Copy these files over your project (same paths). Nothing to delete, no new dependencies.

```bash
npm run lint && npm run build && npm run dev
```

## What it does

Point at one of the background monsters and it lights up to full opacity, glows softly and does a little trick.
Each monster always does the same one, so you quickly learn who does what:

| Trick | What happens |
|---|---|
| jump | squashes, bounces up, lands with a squash, then a small hop |
| spin | flips like a coin (a full turn around its vertical axis) while growing a little |
| wiggle | shakes side to side |
| pop | swells up and settles slightly bigger while you keep pointing at it |

When you move away it fades back to faint.

## Why it needed more than CSS

- **The page was in the way.** Every page covers the whole window, so the mouse never reached the sprites behind
  it. Page wrappers (`PageShell`, the homepage `main`) now ignore the mouse (`pointer-events-none`) and only the
  content column / content blocks catch it (`pointer-events-auto`). The sprites receive the mouse wherever nothing
  of the page is on top, for example in the margins beside the panels. Panels, tables, buttons and open modals still
  block it as before, so nothing becomes harder to click.
- **Opacity moved from the whole layer to each sprite.** A child can't be more opaque than its parent, so the faint
  look is now set per sprite (`--sprite-opacity` = `OPACITY`) and the hovered sprite can go to 1.

## Details

- Only on devices that really hover (`@media (hover: hover)`), so on a phone a tap doesn't leave a sprite stuck lit.
- With "reduce motion" turned on in the visitor's system, the sprite still lights up but skips the trick.
- Hovered sprites are raised above their neighbours so a growing sprite is never hidden behind another.

## Tuning

- Resting opacity: `OPACITY` in `components/layout/SpriteBackground.jsx`.
- Which trick a monster gets: `EFFECTS` in the same file (monster id modulo the list length). Add a name there and a
  matching `@keyframes sprite-<name>` plus `.sprite-cell:hover .sprite-fx-<name>` rule in `styles/animations.css`.
- Speed and look of each trick: the `sprite-jump/spin/wiggle/pop` keyframes and durations in `styles/animations.css`.
- Glow: the `drop-shadow(...)` in the `.sprite-cell:hover .sprite-img` rule.

## Remember when adding pages

Because page wrappers ignore the mouse, anything you place outside `PageShell`'s column needs `pointer-events-auto`
(added to AGENTS.md).

## How it was verified

`npm run lint` clean, `npm run build` passes. 281 + 121 automated checks in a simulated browser (all pass). New ones, on
every page type including a 404 and with a modal open:

- every background sprite cell is hoverable, has the faint class and exactly one of the four tricks; a monster always
  has the same trick and all four tricks are in use;
- the layer's own opacity is 1 with the faint level set per sprite, so hover can reach full opacity;
- every link, button, input, select, label and table on every page is still inside a click-catching area, and an open
  modal catches clicks too, so the sprites behind it aren't hovered;
- in the stylesheet that actually ships: hover rules only inside `@media (hover: hover)`, full opacity and glow, each
  trick bound to its class, the pop trick keeps its size, hovered sprites are raised, and the reduced-motion rule comes
  after the tricks so it wins.

The old-versus-new comparison of all earlier pages and flows is unchanged.

**Not verified:** how it looks and feels in a real browser. A simulated browser can't test hovering with a real
mouse, so please move the mouse over the sprites on a couple of pages and check the speed, size and glow of the tricks.

## An idea for later

Clicking a sprite could open that monster's page in the database (`/db/<id>`). I haven't added it, because it's easy to
click one by accident while aiming at the page.
