// Rarity tiers shared by every collection game, from most to least common.
export const TIER_KEYS = ['common', 'uncommon', 'rare', 'epic', 'legendary']

// These colors are part of the game's content (like element badges), so they are
// written out in full here rather than coming from the theme tokens.
export const TIERS = {
  common: {
    label: 'Common',
    border: 'border-gray-300',
    badge: 'bg-gray-100 text-gray-700',
    glow: 'shadow-gray-300/40',
  },
  uncommon: {
    label: 'Uncommon',
    border: 'border-green-500',
    badge: 'bg-green-100 text-green-800',
    glow: 'shadow-green-400/50',
  },
  rare: {
    label: 'Rare',
    border: 'border-blue-500',
    badge: 'bg-blue-100 text-blue-800',
    glow: 'shadow-blue-400/50',
  },
  epic: {
    label: 'Epic',
    border: 'border-purple-500',
    badge: 'bg-purple-100 text-purple-800',
    glow: 'shadow-purple-400/60',
  },
  legendary: {
    label: 'Legendary',
    border: 'border-amber-400',
    badge: 'bg-amber-100 text-amber-800',
    glow: 'shadow-amber-400/70',
  },
}

// 0 = most common, 4 = rarest
export const tierRank = (tier) => TIER_KEYS.indexOf(tier)

// The rarest tier among a list of items (each with a `tier`)
export function bestTier(items) {
  return items.reduce((best, item) => (tierRank(item.tier) > tierRank(best) ? item.tier : best), 'common')
}
