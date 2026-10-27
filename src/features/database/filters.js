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

/*
 * The URL: /db?page=2&q=poring&race=Dragon&element=Fire&size=Large&min=50&max=70&mvp=1&guild=1
 * Only values that differ from the defaults are written, so the plain list is just /db.
 */
const PARAM_NAMES = {
  search: 'q',
  race: 'race',
  element: 'element',
  size: 'size',
  minLevel: 'min',
  maxLevel: 'max',
}

export function pageFromParams(params) {
  const n = Number.parseInt(params.get('page') ?? '', 10)
  return Number.isInteger(n) && n >= 1 ? n : 1
}

// Reads the filters from the URL. Anything unusable (a race that doesn't exist, text where a
// level should be) is ignored instead of breaking the page.
export function filtersFromParams(params, options) {
  const oneOf = (name, allowed) => {
    const value = params.get(name) ?? ''
    return allowed.includes(value) ? value : ''
  }
  const level = (name) => {
    const value = params.get(name) ?? ''
    return /^\d+$/.test(value) ? value : ''
  }
  return {
    search: params.get('q') ?? '',
    race: oneOf('race', options.races),
    element: oneOf('element', options.elements),
    size: oneOf('size', options.sizes),
    minLevel: level('min'),
    maxLevel: level('max'),
    mvpOnly: params.get('mvp') === '1',
    hideGuild: params.get('guild') !== '1',
  }
}

// Changes one filter in `params` (a URLSearchParams, changed in place). A new filter starts at page 1.
export function setFilterParam(params, key, value) {
  params.delete('page')
  if (key === 'mvpOnly') {
    if (value) params.set('mvp', '1')
    else params.delete('mvp')
  } else if (key === 'hideGuild') {
    if (value) params.delete('guild')
    else params.set('guild', '1')
  } else if (value === '' || value == null) {
    params.delete(PARAM_NAMES[key])
  } else {
    params.set(PARAM_NAMES[key], value)
  }
}

export function setPageParam(params, page) {
  if (page > 1) params.set('page', String(page))
  else params.delete('page')
}

export function clearFilterParams(params) {
  for (const name of [...Object.values(PARAM_NAMES), 'mvp', 'guild', 'page']) params.delete(name)
}
