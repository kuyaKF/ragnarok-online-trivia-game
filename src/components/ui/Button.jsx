const VARIANTS = {
  // Main action (Guess, Play again)
  primary:
    'rounded-lg bg-accent px-4 py-2 font-medium text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40',
  // Full-width "Next" button inside a panel (add w-full via className)
  dark: 'rounded-lg bg-ink px-4 py-2 font-medium text-white hover:bg-soft',
  // Small bordered button (pagination)
  outline:
    'rounded-md border border-line-strong bg-panel px-3 py-1.5 text-sm font-medium text-soft hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-panel',
  // Quiet text button (Skip)
  ghost: 'text-sm text-muted hover:text-soft hover:underline',
  // Accent text button (Reset filters)
  link: 'text-sm font-medium text-accent hover:underline',
}

export default function Button({ variant = 'primary', className = '', ...props }) {
  return <button className={`${VARIANTS[variant]} ${className}`.trim()} {...props} />
}
