export const PAGE_SIZE = 20

export const EMPTY_FILTERS = {
  search: '',
  race: '',
  element: '',
  size: '',
  minLevel: '',
  maxLevel: '',
  mvpOnly: false,
  hideGuild: true,
}

// Turns the filter state into a parameterized WHERE clause
export function buildWhere(f) {
  const clauses = []
  const params = []

  if (f.search.trim()) {
    const s = `%${f.search.trim()}%`
    clauses.push('(name LIKE ? OR internal_name LIKE ?)')
    params.push(s, s)
  }
  if (f.race) { clauses.push('race = ?'); params.push(f.race) }
  if (f.element) { clauses.push('element = ?'); params.push(f.element) }
  if (f.size) { clauses.push('size = ?'); params.push(f.size) }
  if (f.minLevel !== '') { clauses.push('level >= ?'); params.push(Number(f.minLevel)) }
  if (f.maxLevel !== '') { clauses.push('level <= ?'); params.push(Number(f.maxLevel)) }
  if (f.mvpOnly) clauses.push('is_mvp = 1')
  if (f.hideGuild) clauses.push('is_guild_variant = 0')

  return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params }
}
