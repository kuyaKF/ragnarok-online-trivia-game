const BASE =
  'rounded-lg border border-line-strong px-3 text-ink focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus-ring'

const SIZES = {
  sm: 'bg-panel py-1.5 text-sm', // filter bars
  md: 'py-2 disabled:bg-chip', // game answer box
}

export default function Input({ size = 'sm', className = '', ...props }) {
  return <input className={`${BASE} ${SIZES[size]} ${className}`.trim()} {...props} />
}
