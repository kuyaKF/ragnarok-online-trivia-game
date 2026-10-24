import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Panel from '@/components/ui/Panel'
import Select from '@/components/ui/Select'
import ItemDetail from './ItemDetail'
import ItemSlot from './ItemSlot'
import { SORT_OPTIONS } from './inventoryView'
import { TIER_KEYS, TIERS } from './tiers'

const SLOT_PAGE = 30 // the grid is 6 or 10 wide; 30 fills whole rows for both

// The inventory is a narrow side panel: compact controls and a scrolling grid
export default function InventoryPanel({
  entries, // everything owned
  visible, // after search / sort / filters
  filters,
  onFilter,
  typeFilters,
  selected,
  onSelect,
  Visual,
  describeItem,
  duplicates,
  onTrash,
  onKeepOne,
  onReset,
}) {
  const slotCount = Math.max(SLOT_PAGE, Math.ceil(visible.length / SLOT_PAGE) * SLOT_PAGE)
  const emptySlots = slotCount - visible.length

  return (
    <Panel className="p-3">
      <h2 className="mb-2 text-base font-semibold text-ink">Inventory</h2>

      <Input
        type="text"
        value={filters.search}
        onChange={(e) => onFilter('search', e.target.value)}
        placeholder="Search items"
        aria-label="Search items"
        className="mb-2 w-full"
      />
      <div className="mb-2 grid grid-cols-2 gap-2">
        <Select
          value={filters.sort}
          onChange={(e) => onFilter('sort', e.target.value)}
          aria-label="Sort by"
          className="w-full"
        >
          {SORT_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
        <Select
          value={filters.tier}
          onChange={(e) => onFilter('tier', e.target.value)}
          aria-label="Filter by rarity"
          className="w-full"
        >
          <option value="">All rarities</option>
          {TIER_KEYS.map((key) => (
            <option key={key} value={key}>{TIERS[key].label}</option>
          ))}
        </Select>
        {typeFilters.length > 0 && (
          <Select
            value={filters.type}
            onChange={(e) => onFilter('type', e.target.value)}
            aria-label="Filter by type"
            className="w-full"
          >
            <option value="">All types</option>
            {typeFilters.map((t) => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </Select>
        )}
      </div>

      <div className="mb-2 flex flex-col gap-2">
        <Button variant="outline" onClick={onKeepOne} disabled={duplicates === 0}>
          Keep 1 of each{duplicates > 0 ? ` (trash ${duplicates})` : ''}
        </Button>
        <Button variant="outline" onClick={onReset} disabled={entries.length === 0}>
          Reset inventory
        </Button>
      </div>

      <p className="mb-2 text-xs text-muted">
        Showing {visible.length} of {entries.length}
      </p>

      <ItemDetail entry={selected} Visual={Visual} describeItem={describeItem} onTrash={onTrash} />

      <div className="max-h-[26rem] overflow-y-auto pr-1">
        <div className="grid grid-cols-6 gap-1 sm:grid-cols-10 lg:grid-cols-6">
          {visible.map((entry) => (
            <ItemSlot
              key={entry.item.id}
              entry={entry}
              Visual={Visual}
              selected={selected?.item.id === entry.item.id}
              onSelect={onSelect}
            />
          ))}
          {Array.from({ length: emptySlots }, (_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-md border-2 border-line bg-chip" />
          ))}
        </div>
      </div>

      {entries.length === 0 && (
        <p className="mt-3 text-center text-sm text-muted">Your inventory is empty. Open a box!</p>
      )}
      {entries.length > 0 && visible.length === 0 && (
        <p className="mt-3 text-center text-sm text-muted">No items match these filters.</p>
      )}
    </Panel>
  )
}
