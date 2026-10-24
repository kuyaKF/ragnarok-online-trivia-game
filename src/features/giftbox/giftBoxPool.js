import { query } from '@/lib/db'

// Rarity from the best drop rate any monster gives the item (percent)
const TIER_STEPS = [
  [20, 'common'],
  [5, 'uncommon'],
  [1, 'rare'],
  [0.1, 'epic'],
]

export function tierForRate(rate) {
  for (const [min, tier] of TIER_STEPS) if (rate >= min) return tier
  return 'legendary'
}

// Every item monsters can drop, except cards (those get their own game) and
// items only dropped by guild-castle copies of monsters
export function loadGiftBoxPool(db) {
  return query(
    db,
    `SELECT d.item_id AS id, d.item_name AS name,
            MAX(d.rate_percent) AS bestRate,
            COUNT(DISTINCT d.mob_id) AS droppers
     FROM drops d
     JOIN monsters m ON m.id = d.mob_id
     WHERE m.is_guild_variant = 0 AND d.item_name NOT LIKE '% Card'
     GROUP BY d.item_id
     ORDER BY d.item_id`
  ).map((item) => ({ ...item, tier: tierForRate(item.bestRate) }))
}
