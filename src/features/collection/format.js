// "23h 41m", "12m"
export function formatRemaining(ms) {
  if (ms <= 0) return 'now'
  const minutes = Math.ceil(ms / 60000)
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h === 0 ? `${m}m` : `${h}h ${m}m`
}
