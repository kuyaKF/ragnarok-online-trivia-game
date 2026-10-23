export default function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-chip px-3 py-2">
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="font-semibold tabular-nums text-ink">{value ?? '—'}</div>
    </div>
  )
}
