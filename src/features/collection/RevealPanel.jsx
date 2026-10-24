import Badge from '@/components/ui/Badge'
import { TIER_KEYS, TIERS, tierRank } from './tiers'

// What the opened box(es) gave you. `pulls` is [{ item, isNew }].
export default function RevealPanel({ pulls, Visual, ownedCount }) {
  if (pulls.length === 1) return <SinglePull pull={pulls[0]} Visual={Visual} ownedCount={ownedCount} />
  return <BatchPull pulls={pulls} Visual={Visual} />
}

function SinglePull({ pull, Visual, ownedCount }) {
  const { item, isNew } = pull
  const tier = TIERS[item.tier]
  return (
    <div className="reveal-pop flex flex-col items-center rounded-lg bg-well p-4 text-center">
      <div className={`rounded-lg border-2 bg-panel p-3 shadow-lg ${tier.border} ${tier.glow}`}>
        <Visual item={item} size="large" />
      </div>
      <p className="mt-3 text-lg font-bold text-ink">{item.name}</p>
      <div className="mt-1 flex items-center gap-2">
        <Badge className={tier.badge}>{tier.label}</Badge>
        {isNew && <Badge className="bg-accent text-white">NEW!</Badge>}
      </div>
      <p className="mt-2 text-sm text-muted">You now have ×{ownedCount(item.id)}</p>
    </div>
  )
}

function BatchPull({ pulls, Visual }) {
  const newCount = pulls.filter((p) => p.isNew).length
  const perTier = Object.fromEntries(TIER_KEYS.map((key) => [key, 0]))
  for (const p of pulls) perTier[p.item.tier]++

  // The rarest distinct items, best first
  const best = []
  const seen = new Set()
  for (const p of [...pulls].sort((a, b) => tierRank(b.item.tier) - tierRank(a.item.tier))) {
    if (seen.has(p.item.id)) continue
    seen.add(p.item.id)
    best.push(p)
    if (best.length === 12) break
  }

  return (
    <div className="reveal-pop rounded-lg bg-well p-4">
      <p className="text-center text-lg font-bold text-ink">Opened {pulls.length} boxes</p>
      <p className="text-center text-sm text-muted">
        {newCount} new item{newCount === 1 ? '' : 's'}
      </p>

      <div className="mt-3 flex flex-wrap justify-center gap-1">
        {TIER_KEYS.filter((key) => perTier[key] > 0).map((key) => (
          <Badge key={key} className={TIERS[key].badge}>
            {TIERS[key].label} ×{perTier[key]}
          </Badge>
        ))}
      </div>

      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted">Best pulls</p>
      <div className="mt-1 grid grid-cols-6 gap-1">
        {best.map(({ item, isNew }) => (
          <div
            key={item.id}
            title={`${item.name}${isNew ? ' (new)' : ''}`}
            className={`relative flex aspect-square items-center justify-center rounded-md border-2 bg-panel ${TIERS[item.tier].border}`}
          >
            <Visual item={item} size="slot" />
            {isNew && (
              <span className="absolute -right-1 -top-1 rounded bg-accent px-1 text-[9px] font-bold leading-3 text-white">
                NEW
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
