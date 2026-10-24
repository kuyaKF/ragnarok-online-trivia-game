import { useEffect, useMemo, useRef, useState } from 'react'
import BackLink from '@/components/layout/BackLink'
import PageShell from '@/components/layout/PageShell'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Panel from '@/components/ui/Panel'
import Stat from '@/components/ui/Stat'
import BoxPicker from './BoxPicker'
import ConfirmDialog from './ConfirmDialog'
import InventoryPanel from './InventoryPanel'
import OpeningModal from './OpeningModal'
import TrashDialog from './TrashDialog'
import { celebrate, preloadConfetti } from './confetti'
import { EXPIRY_MODE, TTL_MS, isExpired } from './inventory'
import { filterAndSort } from './inventoryView'
import { createPicker } from './roll'
import { TIERS, TIER_KEYS, bestTier } from './tiers'
import { useInventory } from './useInventory'

// Length in ms of each animated step of the opening scene (x10 / x100 use a shorter rumble)
const DURATIONS = { shake: 1400, zoomout: 350, zoomin: 300 }
const BATCH_DURATIONS = { ...DURATIONS, shake: 700 }

const EMPTY_FILTERS = { search: '', sort: 'recent', tier: '', type: '' }

const HOURS = Math.round(TTL_MS / 3_600_000)
const EXPIRY_TEXT =
  EXPIRY_MODE === 'rolling' ? `${HOURS} hours after your last action` : `${HOURS} hours after your first box`

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Chance of each rarity, as a row of badges
function OddsLegend({ odds }) {
  const total = TIER_KEYS.reduce((sum, key) => sum + (odds[key] ?? 0), 0)
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-2">
      {TIER_KEYS.map((key) => (
        <Badge key={key} className={TIERS[key].badge}>
          {TIERS[key].label} {Number(((odds[key] / total) * 100).toFixed(1))}%
        </Badge>
      ))}
    </div>
  )
}

/**
 * A "collection" game: open boxes, get random items, keep them in an inventory
 * that is saved in the browser and expires. Each game supplies its own content:
 *
 *   title, tagline   page heading
 *   storageKey       where the inventory is saved
 *   pool             [{ id, name, tier, ... }] everything that can drop
 *   odds             { common: 55, uncommon: 25, ... } chance of each tier
 *   boxes            [{ id, name, icon }] the clickable boxes (cosmetic only)
 *   Visual           component that draws an item: <Visual item size="slot" | "detail" | "large" />
 *   describeItem     (item) => short text shown in the detail panel
 *   typeFilters      [{ key, label, test(item) }] extra inventory filter (optional)
 */
export default function CollectionGame({
  title,
  tagline,
  storageKey,
  pool,
  odds,
  boxes,
  Visual,
  describeItem,
  typeFilters = [],
}) {
  const poolById = useMemo(() => new Map(pool.map((item) => [item.id, item])), [pool])
  const pick = useMemo(() => createPicker(pool, odds), [pool, odds])
  const inv = useInventory(storageKey)

  const [activeBox, setActiveBox] = useState(boxes[0].id)
  const [session, setSession] = useState(null) // the open box scene, or null
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [selectedId, setSelectedId] = useState(null)
  const [dialog, setDialog] = useState(null) // null | 'trash' | 'duplicates' | 'reset'

  const timers = useRef([])
  const sessionCount = useRef(0)
  const committed = useRef(0) // key of the last session whose items were added
  const sessionRef = useRef(null)
  useEffect(() => {
    sessionRef.current = session
  }, [session])
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
    },
    []
  )

  // Everything owned (ignoring saved ids that are no longer in the pool)
  const entries = useMemo(
    () =>
      Object.entries(inv.inventory.items).flatMap(([id, e]) => {
        const item = poolById.get(Number(id))
        return item ? [{ item, count: e.count, at: e.at }] : []
      }),
    [inv.inventory.items, poolById]
  )
  const visible = useMemo(
    () => filterAndSort(entries, filters, typeFilters),
    [entries, filters, typeFilters]
  )
  const selected = entries.find((e) => e.item.id === selectedId) ?? null
  const duplicates = entries.reduce((sum, e) => sum + e.count - 1, 0)
  const totalHeld = entries.reduce((sum, e) => sum + e.count, 0)

  function clearTimers() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  // The animation is over: add the items to the inventory (once) and show the reward
  function finish(sess) {
    if (committed.current === sess.key) return
    committed.current = sess.key
    clearTimers()
    inv.addPulls(sess.pulls.map((p) => p.item.id))
    setSession((s) => (s && s.key === sess.key ? { ...s, phase: 'reveal' } : s))
    celebrate(bestTier(sess.pulls.map((p) => p.item)))
  }

  // The roll happens now, but nothing is added to the inventory until the reveal
  function startOpen(count, box) {
    if (pool.length === 0) return
    clearTimers()

    const current = inv.getInventory()
    const owned = isExpired(current, Date.now()) ? {} : current.items
    const seen = new Set()
    const pulls = Array.from({ length: count }, () => {
      const item = pick()
      const isNew = !owned[item.id] && !seen.has(item.id)
      seen.add(item.id)
      return { item, isNew }
    })

    const sess = { key: ++sessionCount.current, box, count, pulls, phase: 'shake' }
    setActiveBox(box.id)
    setSession(sess)
    preloadConfetti() // have it ready for the burst

    if (prefersReducedMotion()) {
      finish(sess)
      return
    }

    const d = count === 1 ? DURATIONS : BATCH_DURATIONS
    const advance = (phase) => setSession((s) => (s && s.key === sess.key ? { ...s, phase } : s))
    timers.current = [
      setTimeout(() => advance('zoomout'), d.shake),
      setTimeout(() => advance('zoomin'), d.shake + d.zoomout),
      setTimeout(() => finish(sess), d.shake + d.zoomout + d.zoomin),
    ]
  }

  function skip() {
    const s = sessionRef.current
    if (s && s.phase !== 'reveal') finish(s)
  }

  function closeScene() {
    clearTimers()
    setSession(null)
  }

  function updateFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value }))
  }

  const closeDialog = () => setDialog(null)

  return (
    <PageShell width="max-w-6xl">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-page">{title}</h1>
          <p className="text-sm text-on-page-muted">
            {tagline} Saved on this device for {EXPIRY_TEXT}.
          </p>
        </div>
        <BackLink to="/">← Home</BackLink>
      </div>

      {inv.expiredNotice && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg bg-chip px-3 py-2 text-sm font-medium text-soft">
          <span>Your inventory expired and was reset.</span>
          <Button variant="link" onClick={inv.dismissNotice}>
            Dismiss
          </Button>
        </div>
      )}
      {!inv.persistent && (
        <div className="mb-4 rounded-lg bg-chip px-3 py-2 text-sm font-medium text-soft">
          Saving is turned off in this browser, so your inventory will be lost when you leave this page.
        </div>
      )}

      <Panel className="mb-4 p-3">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Boxes opened" value={inv.inventory.opened.toLocaleString()} />
          <Stat label="Unique found" value={`${entries.length} / ${pool.length}`} />
          <Stat label="Items held" value={totalHeld.toLocaleString()} />
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[1fr_21rem] lg:items-start">
        <Panel className="p-6">
          <h2 className="text-xl font-bold text-ink">Open a box</h2>
          <p className="mb-5 text-sm text-muted">Click a box to open it. Every box gives a random item.</p>
          <BoxPicker boxes={boxes} activeBox={activeBox} onOpen={startOpen} />
          <OddsLegend odds={odds} />
        </Panel>

        <InventoryPanel
          entries={entries}
          visible={visible}
          filters={filters}
          onFilter={updateFilter}
          typeFilters={typeFilters}
          selected={selected}
          onSelect={setSelectedId}
          Visual={Visual}
          describeItem={describeItem}
          duplicates={duplicates}
          onTrash={() => setDialog('trash')}
          onKeepOne={() => setDialog('duplicates')}
          onReset={() => setDialog('reset')}
        />
      </div>

      {session && (
        <OpeningModal
          session={session}
          durations={session.count === 1 ? DURATIONS : BATCH_DURATIONS}
          Visual={Visual}
          ownedCount={(id) => inv.inventory.items[id]?.count ?? 0}
          onSkip={skip}
          onClose={closeScene}
          onAgain={() => startOpen(session.count, session.box)}
        />
      )}

      {dialog === 'trash' && selected && (
        <TrashDialog
          entry={selected}
          onConfirm={(qty) => {
            inv.trash(selected.item.id, qty)
            closeDialog()
          }}
          onClose={closeDialog}
        />
      )}
      {dialog === 'duplicates' && (
        <ConfirmDialog
          title="Keep 1 of each?"
          message={`This trashes ${duplicates} duplicate item${duplicates === 1 ? '' : 's'} and keeps one of everything else. This can't be undone.`}
          confirmLabel="Trash duplicates"
          onConfirm={() => {
            inv.keepOneOfEach()
            closeDialog()
          }}
          onClose={closeDialog}
        />
      )}
      {dialog === 'reset' && (
        <ConfirmDialog
          title="Reset inventory?"
          message="This deletes every item and your boxes-opened count. This can't be undone."
          confirmLabel="Reset"
          onConfirm={() => {
            inv.reset()
            setSelectedId(null)
            closeDialog()
          }}
          onClose={closeDialog}
        />
      )}
    </PageShell>
  )
}
