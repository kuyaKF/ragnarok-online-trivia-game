# Gift Box UI update: notes

Copy these files over your project (same paths), then:

```bash
# delete this one file, it is no longer used:
#   src/features/collection/format.js
npm install          # new dependency: canvas-confetti (package.json and package-lock.json are included)
npm run lint && npm run build && npm run dev
```

## What changed

- **"Resets in" removed.** The tile is gone (and the countdown code with it). I kept the small line under the title,
  "Saved on this device for 24 hours after your last action", so players know the inventory expires; delete the
  `{tagline} Saved on this device for ...` text in `CollectionGame.jsx` if you want that gone too.
- **Boxes:** Treasure Box and Dead Branch Box removed (`BOXES` in `features/giftbox/giftBoxConfig.js`).
  Gift Box, Old Blue Box and Old Purple Box remain.
- **Layout:** the "Open a box" panel is now the wide main panel with large box buttons, Open ×10 / ×100 and a row
  showing the chance of each rarity. The inventory is a narrow side panel (21rem) with compact controls and a
  scrolling grid of smaller slots. On phones and tablets it stacks under the boxes.
- **Opening scene (modal):** click a box and a modal opens with the box:
  1. rumbles with growing intensity while swelling (1.4 s; 0.7 s for ×10 / ×100),
  2. zooms out (0.35 s),
  3. zooms in with a white flash (0.3 s),
  4. then the reward pops in and confetti fires. Rarer rewards get bigger confetti: 1 burst for Common up to 5
     bursts (including from the sides) for Legendary, in colors matching the rarity.
  The reward screen has "Open another" (or "Open ×10 again") and "Close".
- **Skip:** a Skip button, the Escape key, or a click outside jumps straight to the reward. Once the reward is
  shown, Escape or a click outside closes the modal.
- **Nothing is added to the inventory until the reveal**, so the inventory behind the modal never spoils the result.
  Leaving the page mid-animation adds nothing.
- **Reduced motion:** visitors with "reduce motion" turned on skip the animation and see the reward right away
  (the confetti library also turns itself off for them).

## About "confetti.js"

I used the **canvas-confetti** package (the popular one whose file is `confetti.js`). It is loaded only when the
first box is opened (a separate ~4 KB gzipped file), so it doesn't slow down the other pages. If you meant a
different library (for example `js-confetti`), tell me and I'll switch; only `features/collection/confetti.js`
would change.

## Where to tweak things

- Animation timing: `DURATIONS` / `BATCH_DURATIONS` at the top of `features/collection/CollectionGame.jsx`.
- How the box moves: the `stage-*` keyframes in `styles/animations.css`.
- Confetti amounts and colors per rarity: `features/collection/confetti.js`.

## How it was verified

`npm run lint` clean, `npm run build` passes. 153 automated checks in a simulated browser (all pass), including:
the three boxes only, the layout classes, each animation phase appearing in order (rumble, zoom out, zoom in with
flash, reward), nothing saved before the reveal, confetti fired with the right options, Skip / Escape / outside
click, Open another, ×10 and ×100, leaving mid-animation, reduced motion, and the confetti size per rarity.
Everything from before (saving, expiry, trash, filters, other pages) still passes.

**Not verified:** how the animation actually looks and feels (speed, the size of the zoom, how the confetti reads
on screen) and the narrow inventory on a phone. Those are best judged in your browser, and the numbers above are
easy to adjust.
