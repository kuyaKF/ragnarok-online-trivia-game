# Gift Box Simulator: notes

This zip only contains files that are new or changed since the refactor. Copy them over your project
(same paths), nothing needs deleting and no dependencies changed.

```bash
git switch -c feature/giftbox
# copy src/, README.md and AGENTS.md from this zip over your project
npm run lint && npm run build && npm run dev     # then open /giftbox
```

## What's in it

**New: shared engine `src/features/collection/`** (used by any box-opening game)

| File | Job |
|---|---|
| `CollectionGame.jsx` | The page: boxes, reveal, stats, inventory, dialogs. Takes the game's content as props |
| `inventory.js` | Pure functions: add pulls, trash, keep 1 of each, expiry, validating saved data |
| `useInventory.js` | React hook: loads and saves to localStorage, resets on expiry, syncs tabs |
| `roll.js` | Picks a tier by its odds, then an item inside the tier |
| `tiers.js` | The five rarities and their colors |
| `inventoryView.js` | Search, sort, rarity and type filters |
| `BoxPicker`, `RevealPanel`, `InventoryPanel`, `ItemSlot`, `ItemDetail`, `TrashDialog`, `ConfirmDialog`, `format.js` | UI pieces |

**New: `src/features/giftbox/`**: the game itself (pool from `monsters.db`, odds, box icons, filters).
**New:** `src/lib/storage.js` (safe localStorage), `src/components/ui/Modal.jsx`.
**Changed:** `app/App.jsx` (route `/giftbox`), `HomePage.jsx` (new card), `theme.css` (two tokens for the red
Trash button), `animations.css` (box shake, reward pop), `Button.jsx` (`danger` variant), README, AGENTS.md.

## How it plays

- 1,269 possible items: every item monsters drop except cards. Rarity comes from the best drop rate:

  | Tier | Best drop rate | Items | Chance per box |
  |---|---|---|---|
  | Common | 20%+ | 451 | 55% |
  | Uncommon | 5-20% | 179 | 25% |
  | Rare | 1-5% | 188 | 12% |
  | Epic | 0.1-1% | 262 | 6% |
  | Legendary | under 0.1% | 189 | 2% |

- Click any box icon to open one (all five do the same thing), or use Open ×10 / ×100.
- The inventory shows what you own with counters, rarity borders, search, sorting, and rarity and type filters.
  Select an item to see details and Trash it (you choose how many). "Keep 1 of each" trashes all duplicates.
  "Reset inventory" clears everything. Each of these asks first.
- Saved in `localStorage` under `rot.giftbox.inventory`; it expires 24 hours after your **last action**.
  The "Resets in" tile counts down, and an expired inventory is cleared with a notice.

## Settings you may want to change

- Odds per tier: `ODDS` in `features/giftbox/giftBoxConfig.js`.
- Tier cut-offs: `TIER_STEPS` in `features/giftbox/giftBoxPool.js`.
- Expiry length or mode (`'rolling'` = from last action, `'fixed'` = 24h from the first box): `TTL_MS` and
  `EXPIRY_MODE` in `features/collection/inventory.js`.
- Which boxes appear: `BOXES` in `giftBoxConfig.js` (any item whose icon is in `public/items`).

## How it was verified

`npm run lint` clean, `npm run build` passes. 126 automated checks in a simulated browser with your real database:

- **Pool:** 1,269 items, no cards, tier sizes as above, every item and box icon file exists in your `public/items`.
- **Odds:** 200,000 simulated opens match the tier chances within 0.5%.
- **Inventory logic:** counting, trashing (partial, whole stack, more than owned), keep-one, expiry at the exact
  deadline, rolling expiry, and rejecting corrupt saved data.
- **The page:** opening one / ×10 / ×100, saving, reloading with the inventory restored, selecting and trashing
  (clamping, cancel, Escape), keep-one, search, sort, filters, other-tab sync, expiry while the page is open and
  on load, a corrupt save, reset, blocked localStorage (no crash, a notice is shown).
- The existing pages and games are unchanged; the only differences from before are the new homepage card and the
  "Play again" classes noted last time.

**Not verified** (please look in a browser): how it looks (layout, colors, the box shake and reward pop), and the
feel on a phone. Item icons are only about 24 px, so they are scaled up with pixelated rendering; if that looks too
rough, tell me and we'll look for larger art.

## Known limits

- The homepage card points at `public/covers/gift-box.jpg`, which doesn't exist yet (it falls back to a blue card,
  like the other covers).
- "Gear" vs "Other" is guessed from the `[slots]` in item names, because the data has no item types.
- The inventory is per browser and per site address, so your Vercel preview and production URLs have separate ones.
- The expiry uses the device clock.

## Next: Card Album

The engine is ready for it: the card game only needs a card pool (with tiers from the monster each card belongs to),
its own odds and boxes, and a trading-card `Visual`.
