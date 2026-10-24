import { useCallback, useEffect, useRef, useState } from 'react'
import { readJson, removeKey, storageAvailable, writeJson } from '@/lib/storage'
import {
  emptyInventory,
  isExpired,
  isPristine,
  loadInventory,
  withOneOfEach,
  withPulls,
  withTrashed,
} from './inventory'

const CHECK_MS = 30_000 // how often to check whether the inventory has expired

const nowMs = () => Date.now()

/**
 * The player's inventory, kept in localStorage under `storageKey`.
 *
 * - Loads on mount; a save that has expired is dropped and `expiredNotice` is true.
 * - Saves after every change (and clears the key while the inventory is untouched).
 * - Resets itself when it expires while the page is open.
 * - Follows changes made in another tab.
 * - `persistent` is false when the browser blocks storage (nothing will be saved).
 */
export function useInventory(storageKey) {
  const [initial] = useState(() => loadInventory(readJson(storageKey), nowMs()))
  const [inventory, setInventory] = useState(initial.inventory)
  const [expiredNotice, setExpiredNotice] = useState(initial.expired)
  const [persistent] = useState(storageAvailable)

  // Latest inventory for callbacks that run later (timers, event handlers)
  const latest = useRef(inventory)
  useEffect(() => {
    latest.current = inventory
  }, [inventory])

  // Save on every change
  useEffect(() => {
    if (isPristine(inventory)) removeKey(storageKey)
    else writeJson(storageKey, inventory)
  }, [inventory, storageKey])

  // Expire while the page is open, and when the tab becomes visible again
  useEffect(() => {
    function check() {
      if (isExpired(latest.current, nowMs())) {
        setInventory(emptyInventory())
        setExpiredNotice(true)
      }
    }
    const id = setInterval(check, CHECK_MS)
    document.addEventListener('visibilitychange', check)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', check)
    }
  }, [])

  // Keep two open tabs in step
  useEffect(() => {
    function onStorage(e) {
      if (e.key != null && e.key !== storageKey) return
      setInventory(loadInventory(readJson(storageKey), nowMs()).inventory)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [storageKey])

  // Applies a change on top of a fresh inventory if the old one has just expired
  const update = useCallback((change) => {
    const t = nowMs()
    setExpiredNotice(false)
    setInventory((prev) => change(isExpired(prev, t) ? emptyInventory() : prev, t))
  }, [])

  const addPulls = useCallback((ids) => update((inv, t) => withPulls(inv, ids, t)), [update])
  const trash = useCallback(
    (id, qty) => update((inv, t) => withTrashed(inv, id, qty, t)),
    [update]
  )
  const keepOneOfEach = useCallback(() => update((inv, t) => withOneOfEach(inv, t)), [update])
  const reset = useCallback(() => update(() => emptyInventory()), [update])
  const dismissNotice = useCallback(() => setExpiredNotice(false), [])
  const getInventory = useCallback(() => latest.current, [])

  return {
    inventory,
    expiredNotice,
    persistent,
    addPulls,
    trash,
    keepOneOfEach,
    reset,
    dismissNotice,
    getInventory,
  }
}
