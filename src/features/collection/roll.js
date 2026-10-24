import { TIER_KEYS } from './tiers.js'

/**
 * Builds a function that picks one random item from `pool`.
 *
 * Every pool item has a `tier`. `odds` gives the chance of each tier (any positive
 * numbers, they don't have to add up to 100). A tier with no items is skipped and
 * the others share its chance. Inside a tier every item is equally likely.
 *
 * `pick(rand)` takes an optional random function (0 <= n < 1) so tests can control it.
 */
export function createPicker(pool, odds) {
  const byTier = {}
  for (const item of pool) (byTier[item.tier] ??= []).push(item)

  const active = TIER_KEYS.filter((key) => byTier[key]?.length && odds[key] > 0)
  const total = active.reduce((sum, key) => sum + odds[key], 0)

  return function pick(rand = Math.random) {
    if (active.length === 0) return null

    let r = rand() * total
    let tier = active[active.length - 1]
    for (const key of active) {
      if (r < odds[key]) {
        tier = key
        break
      }
      r -= odds[key]
    }

    const list = byTier[tier]
    return list[Math.floor(rand() * list.length)]
  }
}
