/*
 * An answer choice. `state` is one of: idle, correct, wrong, dimmed.
 *
 * Two layouts exist because the two games look different:
 *   row  - full-width text choice (True or False)
 *   card - square card with a sprite (Item Drops)
 */
const STATE_COLORS = {
  idle: 'bg-panel hover:border-accent-edge hover:bg-accent-soft',
  correct: 'border-success-edge bg-success-soft',
  wrong: 'border-danger-edge bg-danger-soft',
  dimmed: 'bg-subtle',
}

const LAYOUTS = {
  row: {
    base: 'w-full rounded-lg border px-4 py-3 text-left transition',
    idle: 'border-line-strong',
    correct: 'text-success-ink',
    wrong: 'text-danger-ink',
    dimmed: 'border-line text-faint',
  },
  card: {
    base: 'flex flex-col items-center rounded-lg border-2 p-3 text-center transition',
    idle: 'border-line',
    correct: '',
    wrong: '',
    dimmed: 'border-line opacity-60',
  },
}

export default function OptionButton({ state = 'idle', layout = 'row', children, ...props }) {
  const l = LAYOUTS[layout]
  return (
    <button className={`${l.base} ${STATE_COLORS[state]} ${l[state]}`.trim()} {...props}>
      {children}
    </button>
  )
}
