import { query } from '@/lib/db'

// Lowercase and drop everything except letters/digits, so
// "Baphomet Jr." / "baphomet jr" / "BaphometJr" all match
export function normalize(text) {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '')
  return cleaned || text.toLowerCase().trim()
}

// "Chung E / Green Maiden" accepts the full name or either side
export function acceptedAnswers(name) {
  const parts = name.split('/').map((p) => p.trim()).filter(Boolean)
  return [...new Set([name, ...parts].map(normalize))]
}

export function isCorrect(guess, name) {
  const g = normalize(guess)
  return g !== '' && acceptedAnswers(name).includes(g)
}

// Monsters eligible for trivia (guild variants are duplicates, so skip them)
export function loadPool(db) {
  return query(db, 'SELECT id, name FROM monsters WHERE is_guild_variant = 0')
}
