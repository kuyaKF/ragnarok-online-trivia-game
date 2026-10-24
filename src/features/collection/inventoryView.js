import { tierRank } from './tiers.js'

export const SORT_OPTIONS = [
  ['recent', 'Newest'],
  ['rarity', 'Rarest'],
  ['name', 'Name'],
  ['id', 'Item ID'],
  ['count', 'Most owned'],
]

const byName = (a, b) => a.item.name.localeCompare(b.item.name)

const SORTERS = {
  recent: (a, b) => b.at - a.at || byName(a, b),
  rarity: (a, b) => tierRank(b.item.tier) - tierRank(a.item.tier) || byName(a, b),
  name: byName,
  id: (a, b) => a.item.id - b.item.id,
  count: (a, b) => b.count - a.count || byName(a, b),
}

/**
 * entries: [{ item, count, at }]
 * filters: { search, sort, tier, type }  (tier and type are '' for "all")
 * typeFilters: [{ key, label, test(item) }] supplied by the game
 */
export function filterAndSort(entries, filters, typeFilters = []) {
  const search = filters.search.trim().toLowerCase()
  const type = typeFilters.find((t) => t.key === filters.type)

  return entries
    .filter((e) => !search || e.item.name.toLowerCase().includes(search))
    .filter((e) => !filters.tier || e.item.tier === filters.tier)
    .filter((e) => !type || type.test(e.item))
    .sort(SORTERS[filters.sort] ?? SORTERS.recent)
}
