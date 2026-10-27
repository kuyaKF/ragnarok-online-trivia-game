import { TIERS } from './tiers'

// One square of the inventory grid: the item, its rarity border and a count in the corner
export default function ItemSlot({ entry, Visual, selected, onSelect }) {
  const { item, count } = entry
  return (
    <button
      onClick={() => onSelect(item.id)}
      title={`${item.name} ×${count}`}
      aria-label={`${item.name}, ${count} owned`}
      aria-pressed={selected}
      className={`relative flex aspect-square items-center justify-center rounded-md border-2 bg-well cursor-pointer ${TIERS[item.tier].border} ${selected ? 'ring-2 ring-accent' : ''}`}
    >
      <Visual item={item} size="slot" />
      {count > 1 && (
        <span className="absolute bottom-0 right-0 rounded-tl bg-panel/90 px-1 text-[10px] font-bold leading-4 text-ink">
          {count}
        </span>
      )}
    </button>
  )
}
