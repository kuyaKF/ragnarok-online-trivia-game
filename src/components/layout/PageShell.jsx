// Dark page with a centered column. `width` is a Tailwind max-width class, e.g. "max-w-6xl".
// The page itself lets the mouse through to the background sprites; only the column is clickable.
export default function PageShell({ width, children }) {
  return (
    <div className="pointer-events-none relative z-10 min-h-screen p-6">
      <div className={`pointer-events-auto mx-auto ${width}`}>{children}</div>
    </div>
  )
}
