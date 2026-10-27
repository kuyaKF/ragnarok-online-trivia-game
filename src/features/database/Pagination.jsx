import Button from '@/components/ui/Button'

// The page strip. It is shown above and below the table, so `label` tells them apart and
// `className` sets the spacing. `onPageChange` receives the page number to go to.
export default function Pagination({ page, totalPages, total, onPageChange, label, className = '' }) {
  return (
    <nav
      aria-label={label}
      className={`flex flex-wrap items-center justify-between gap-3 ${className}`.trim()}
    >
      <p className="text-sm text-on-page-muted">
        Page <span className="font-semibold text-on-page">{page}</span> of {totalPages} · {total} monsters
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => onPageChange(1)} disabled={page === 1}>First</Button>
        <Button variant="outline" onClick={() => onPageChange(page - 1)} disabled={page === 1}>Prev</Button>
        <Button variant="outline" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next</Button>
        <Button variant="outline" onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>Last</Button>
      </div>
    </nav>
  )
}
