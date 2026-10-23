import { query } from '@/lib/db'

// Values for the Race / Element / Size dropdowns, taken from the data itself
export function getFilterOptions(db) {
  const distinct = (col) =>
    query(db, `SELECT DISTINCT ${col} AS v FROM monsters ORDER BY v`).map((r) => r.v)
  return { races: distinct('race'), elements: distinct('element'), sizes: distinct('size') }
}

export function countMonsters(db, where, params) {
  return query(db, `SELECT COUNT(*) AS n FROM monsters ${where}`, params)[0].n
}

export function listMonsters(db, where, params, page, pageSize) {
  return query(
    db,
    `SELECT id, name, internal_name, level, hp, race, element, element_level, size
     FROM monsters
     ${where}
     ORDER BY id
     LIMIT ? OFFSET ?`,
    [...params, pageSize, (page - 1) * pageSize]
  )
}

export function getMonster(db, id) {
  return query(db, 'SELECT * FROM monsters WHERE id = ?', [Number(id)])[0]
}

export function getMonsterDrops(db, monsterId) {
  return query(
    db,
    'SELECT item_id, item_name, rate_percent FROM drops WHERE mob_id = ? ORDER BY rate_percent DESC',
    [monsterId]
  )
}
