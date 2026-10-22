import { query } from '../db'

const PARAMS = ['level', 'race', 'property', 'size']
const LABELS = { level: 'Level', race: 'Race', property: 'Property', size: 'Size' }

// Tuning: a false level differs by at least MIN_SHIFT, at most
// MAX_SHIFT_PERCENT of the real level (but never less than MIN_SHIFT)
const MIN_SHIFT = 2
const MAX_SHIFT_PERCENT = 0.15

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export function loadMonsters(db) {
  return query(
    db,
    `SELECT id, name, level, race, element, element_level, size
     FROM monsters WHERE is_guild_variant = 0`
  )
}

// The fixed lists, taken from the data itself
export function loadFixedLists(db) {
  const distinct = (col) =>
    query(db, `SELECT DISTINCT ${col} AS v FROM monsters ORDER BY v`).map((r) => r.v)
  return {
    races: distinct('race'),
    elements: distinct('element'),
    sizes: distinct('size'),
  }
}

function trueValue(m, param) {
  if (param === 'property') return `${m.element} ${m.element_level}`
  return String(m[param])
}

function alterLevel(level) {
  const maxShift = Math.max(MIN_SHIFT, Math.round(level * MAX_SHIFT_PERCENT))
  const shift = MIN_SHIFT + Math.floor(Math.random() * (maxShift - MIN_SHIFT + 1))
  const goUp = level <= shift || Math.random() < 0.5 // never drop below 1
  return String(goUp ? level + shift : level - shift)
}

function falseValue(m, param, lists) {
  switch (param) {
    case 'level':
      return alterLevel(m.level)
    case 'race':
      return pick(lists.races.filter((r) => r !== m.race))
    case 'size':
      return pick(lists.sizes.filter((s) => s !== m.size))
    case 'property': {
      const otherElement = pick(lists.elements.filter((e) => e !== m.element))
      return `${otherElement} ${m.element_level}`
    }
  }
}

export function buildQuestion(monster, lists) {
  const kind = Math.random() < 0.5 ? 'true' : 'false'
  const oddOne = pick(PARAMS) // the one parameter that differs from the other three

  const options = PARAMS.map((param) => {
    // kind 'true'  -> only oddOne is real; kind 'false' -> only oddOne is altered
    const isTrue = kind === 'true' ? param === oddOne : param !== oddOne
    const actual = trueValue(monster, param)
    return {
      param,
      label: LABELS[param],
      shown: isTrue ? actual : falseValue(monster, param, lists),
      actual,
      isTrue,
    }
  })

  // In both modes the correct answer is the odd-one-out parameter
  return { monster, kind, answerParam: oddOne, options }
}