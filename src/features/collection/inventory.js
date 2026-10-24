/*
 * The saved inventory and everything you can do to it. Plain functions that never
 * touch the browser, so they are easy to test. Every change returns a new object.
 *
 * Shape (this is what gets saved):
 *   {
 *     version: 1,
 *     createdAt: ms | null,    // null until the first action
 *     expiresAt: ms | null,
 *     opened: 0,               // boxes opened so far
 *     items: { [itemId]: { count, at } }   // at = when it was last obtained
 *   }
 */
export const VERSION = 1
export const TTL_MS = 24 * 60 * 60 * 1000

// 'rolling': the 24 hours start again after every action (open, trash, ...).
// 'fixed':   the inventory lasts 24 hours from the first box opened, then resets.
export const EXPIRY_MODE = 'rolling'

export function emptyInventory() {
  return { version: VERSION, createdAt: null, expiresAt: null, opened: 0, items: {} }
}

export const isPristine = (inv) => inv.createdAt === null

export const isExpired = (inv, now) => inv.expiresAt !== null && now >= inv.expiresAt

// Records that the player did something, which sets (or moves) the expiry time
function touch(inv, now) {
  const createdAt = inv.createdAt ?? now
  const expiresAt = EXPIRY_MODE === 'rolling' ? now + TTL_MS : createdAt + TTL_MS
  return { ...inv, createdAt, expiresAt }
}

// Adds one of each id in `ids` (an id can repeat) and counts the boxes opened
export function withPulls(inv, ids, now) {
  const items = { ...inv.items }
  for (const id of ids) {
    items[id] = { count: (items[id]?.count ?? 0) + 1, at: now }
  }
  return touch({ ...inv, items, opened: inv.opened + ids.length }, now)
}

// Removes `qty` of an item (all of it if qty >= what you have)
export function withTrashed(inv, id, qty, now) {
  const current = inv.items[id]
  if (!current || qty < 1) return inv

  const items = { ...inv.items }
  const left = current.count - Math.floor(qty)
  if (left <= 0) delete items[id]
  else items[id] = { ...current, count: left }
  return touch({ ...inv, items }, now)
}

// Trashes every duplicate so exactly one of each item is left
export function withOneOfEach(inv, now) {
  if (duplicateCount(inv) === 0) return inv
  const items = {}
  for (const [id, entry] of Object.entries(inv.items)) items[id] = { ...entry, count: 1 }
  return touch({ ...inv, items }, now)
}

export const uniqueCount = (inv) => Object.keys(inv.items).length
export const totalCount = (inv) =>
  Object.values(inv.items).reduce((sum, e) => sum + e.count, 0)
export const duplicateCount = (inv) => totalCount(inv) - uniqueCount(inv)

// Checks data read from storage. Returns a clean inventory, or null if it can't be trusted.
export function parseInventory(raw) {
  if (!raw || typeof raw !== 'object' || raw.version !== VERSION) return null
  if (!raw.items || typeof raw.items !== 'object') return null

  const items = {}
  for (const [id, entry] of Object.entries(raw.items)) {
    const count = Math.floor(Number(entry?.count))
    const at = Number(entry?.at)
    if (Number.isFinite(count) && count >= 1) {
      items[id] = { count, at: Number.isFinite(at) ? at : 0 }
    }
  }

  const createdAt = Number(raw.createdAt)
  const expiresAt = Number(raw.expiresAt)
  if (!Number.isFinite(createdAt) || !Number.isFinite(expiresAt)) return null

  const opened = Math.max(0, Math.floor(Number(raw.opened)) || 0)
  return { version: VERSION, createdAt, expiresAt, opened, items }
}

// Turns saved data into the inventory to start with.
// `expired` is true when there was a save but it ran out, so the page can say so.
export function loadInventory(raw, now) {
  const inv = parseInventory(raw)
  if (!inv) return { inventory: emptyInventory(), expired: false }
  if (isExpired(inv, now)) return { inventory: emptyInventory(), expired: true }
  return { inventory: inv, expired: false }
}
