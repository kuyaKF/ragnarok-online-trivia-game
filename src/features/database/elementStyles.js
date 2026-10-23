// Badge colors per element. Full class names must appear literally in the source,
// otherwise Tailwind won't generate them.
const ELEMENT_STYLES = {
  Neutral: 'bg-gray-100 text-gray-700',
  Water: 'bg-blue-100 text-blue-700',
  Earth: 'bg-amber-100 text-amber-800',
  Fire: 'bg-red-100 text-red-700',
  Wind: 'bg-emerald-100 text-emerald-700',
  Poison: 'bg-purple-100 text-purple-700',
  Holy: 'bg-yellow-100 text-yellow-800',
  Shadow: 'bg-slate-300 text-slate-800',
  Ghost: 'bg-indigo-100 text-indigo-700',
  Undead: 'bg-zinc-300 text-zinc-800',
}

export const elementStyle = (element) => ELEMENT_STYLES[element] ?? 'bg-gray-100 text-gray-700'
