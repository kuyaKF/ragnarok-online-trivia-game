// Dark page with a centered column. `width` is a Tailwind max-width class, e.g. "max-w-6xl".
export default function PageShell({ width, children }) {
  return (
    <div className="min-h-screen bg-page p-6">
      <div className={`mx-auto ${width}`}>{children}</div>
    </div>
  )
}
