import { itemSpriteUrl } from '@/lib/sprites'

export const STORAGE_KEY = 'rot.giftbox.inventory'

// Chance of each rarity per box (they don't need to add up to 100)
export const ODDS = { common: 55, uncommon: 25, rare: 12, epic: 6, legendary: 2 }

// The boxes are only a skin: every one gives the same random item.
// Their icons are in public/items because monsters drop them.
export const BOXES = [
  { id: 644, name: 'Gift Box' },
  { id: 603, name: 'Old Blue Box' },
  { id: 617, name: 'Old Purple Box' },
].map((box) => ({ ...box, icon: itemSpriteUrl({ item_id: box.id, item_name: box.name }) }))

// The data has no item types, so "gear" is guessed from the slot brackets in the name
export const TYPE_FILTERS = [
  { key: 'gear', label: 'Gear', test: (item) => item.name.includes('[') },
  { key: 'other', label: 'Other', test: (item) => !item.name.includes('[') },
]

export function describeItem(item) {
  const monsters = `${item.droppers} monster${item.droppers === 1 ? '' : 's'}`
  return `Best drop rate ${item.bestRate}% · dropped by ${monsters}`
}
