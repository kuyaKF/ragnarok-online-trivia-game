// Small rounded label. Use a tone, or pass your own colors via className.
const TONES = {
  mvp: 'bg-red-100 text-red-700',
  guild: 'bg-slate-200 text-slate-700',
}

export default function Badge({ tone, className = '', children }) {
  const colors = tone ? TONES[tone] : className
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors}`}>
      {children}
    </span>
  )
}
