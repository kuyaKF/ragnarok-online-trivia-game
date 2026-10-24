import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { TIERS } from './tiers'

// Details of the selected inventory item, with the Trash button (compact, for the narrow inventory)
export default function ItemDetail({ entry, Visual, describeItem, onTrash }) {
  if (!entry) {
    return (
      <p className="mb-3 rounded-lg bg-chip p-2 text-xs text-muted">
        Select an item to see its details.
      </p>
    )
  }

  const { item, count } = entry
  const tier = TIERS[item.tier]
  return (
    <div className="mb-3 rounded-lg bg-chip p-2">
      <div className="flex items-center gap-2">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md border-2 bg-well ${tier.border}`}>
          <Visual item={item} size="detail" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink" title={item.name}>{item.name}</p>
          <div className="mt-0.5 flex items-center gap-2">
            <Badge className={tier.badge}>{tier.label}</Badge>
            <span className="text-xs text-soft">×{count}</span>
          </div>
        </div>
      </div>
      <p className="mt-1 text-xs text-muted">{describeItem(item)}</p>
      <Button variant="danger" onClick={onTrash} className="mt-2 w-full">
        Trash…
      </Button>
    </div>
  )
}
