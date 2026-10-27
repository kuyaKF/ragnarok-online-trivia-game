// Same look as the small Input
export default function Select({ className = '', ...props }) {
  return (
    <select
      className={`rounded-lg border border-line-strong bg-panel px-3 py-1.5 text-sm text-ink cursor-pointer focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus-ring ${className}`.trim()}
      {...props}
    />
  )
}
