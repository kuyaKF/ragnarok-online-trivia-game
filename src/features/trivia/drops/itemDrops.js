import { query } from '@/lib/db'
import { shuffle } from '@/lib/shuffle'

// Tuning knobs
const OPTION_COUNT = 4
const MAX_CORRECT = 3
// Drops below this % are never used as a *correct* answer (nobody can know
// a 0.01% drop). They are still never used as distractors. Set to 0 to allow all.
const MIN_CORRECT_RATE = 0.1

// Take up to n items from a list, skipping duplicate monster names
function takeUniqueByName(list, n) {
  const seen = new Set()
  const out = []
  for (const m of shuffle(list)) {
    if (seen.has(m.name)) continue
    seen.add(m.name)
    out.push(m)
    if (out.length === n) break
  }
  return out
}

// Items eligible for this game, split by how many monsters can be a correct answer.
// Cards are excluded because their names contain the monster's name.
export function loadItemPools(db) {
  const items = query(
    db,
    `SELECT d.item_id, d.item_name,
            COUNT(DISTINCT CASE WHEN d.rate_percent >= ? THEN d.mob_id END) AS eligible
     FROM drops d
     JOIN monsters m ON m.id = d.mob_id
     WHERE m.is_guild_variant = 0 AND d.item_name NOT LIKE '% Card'
     GROUP BY d.item_id
     HAVING eligible >= 1`,
    [MIN_CORRECT_RATE]
  )
  return {
    single: items.filter((i) => i.eligible === 1),
    multi: items.filter((i) => i.eligible >= 2),
  }
}

// Alternates single-dropper and multi-dropper items so roughly half the
// questions have more than one possible correct monster, then shuffles
export function buildItemQueue(pools) {
  const single = shuffle(pools.single)
  const multi = shuffle(pools.multi)
  const queue = []
  for (let i = 0; i < Math.max(single.length, multi.length); i++) {
    if (multi[i]) queue.push(multi[i])
    if (single[i]) queue.push(single[i])
  }
  return shuffle(queue)
}

export function buildItemQuestion(db, item) {
  // Every non-guild monster that drops this item (highest rate if it has two slots)
  const droppers = query(
    db,
    `SELECT m.id, m.name, MAX(d.rate_percent) AS rate
     FROM drops d JOIN monsters m ON m.id = d.mob_id
     WHERE d.item_id = ? AND m.is_guild_variant = 0
     GROUP BY m.id`,
    [item.item_id]
  )
  const eligible = droppers.filter((d) => d.rate >= MIN_CORRECT_RATE)

  const uniqueNames = new Set(eligible.map((d) => d.name)).size
  const numCorrect = 1 + Math.floor(Math.random() * Math.min(MAX_CORRECT, uniqueNames))
  const correct = takeUniqueByName(eligible, numCorrect)

  // Distractors: monsters that provably don't drop the item. The name filter also
  // removes look-alikes (e.g. two monsters called "Acidus" where only one drops it)
  const candidates = query(
    db,
    `SELECT id, name FROM monsters
     WHERE is_guild_variant = 0
       AND id NOT IN (SELECT mob_id FROM drops WHERE item_id = ?)
       AND name NOT IN (SELECT m2.name FROM drops d2
                        JOIN monsters m2 ON m2.id = d2.mob_id
                        WHERE d2.item_id = ?)`,
    [item.item_id, item.item_id]
  )
  const wrong = takeUniqueByName(candidates, OPTION_COUNT - correct.length)

  const options = shuffle([
    ...correct.map((m) => ({ ...m, isCorrect: true })),
    ...wrong.map((m) => ({ ...m, rate: null, isCorrect: false })),
  ])

  return { item, options, totalDroppers: droppers.length }
}