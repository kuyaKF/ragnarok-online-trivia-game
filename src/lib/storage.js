// Safe wrappers around localStorage. Storage can be missing, blocked (some private modes,
// disabled cookies) or full, so every call is guarded and failures return null/false.
let store // undefined = not checked yet, null = unavailable

function getStore() {
  if (store === undefined) {
    try {
      const s = window.localStorage
      s.setItem('__probe__', '1')
      s.removeItem('__probe__')
      store = s
    } catch {
      store = null
    }
  }
  return store
}

export const storageAvailable = () => getStore() !== null

export function readJson(key) {
  const s = getStore()
  if (!s) return null
  try {
    const raw = s.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writeJson(key, value) {
  const s = getStore()
  if (!s) return false
  try {
    s.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeKey(key) {
  const s = getStore()
  if (!s) return
  try {
    s.removeItem(key)
  } catch {
    // nothing to do
  }
}
