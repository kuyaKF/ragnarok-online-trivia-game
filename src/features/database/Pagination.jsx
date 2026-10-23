import Button from '@/components/ui/Button'

// `onPageChange` is a state setter: it accepts a number or an updater function
export default function Pagination({ page, totalPages, total, onPageChange }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-on-page-muted">
        Page <span className="font-semibold text-on-page">{page}</span> of {totalPages} · {total} monsters
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => onPageChange(1)} disabled={page === 1}>First</Button>
        <Button variant="outline" onClick={() => onPageChange((p) => p - 1)} disabled={page === 1}>Prev</Button>
        <Button variant="outline" onClick={() => onPageChange((p) => p + 1)} disabled={page === totalPages}>Next</Button>
        <Button variant="outline" onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>Last</Button>
      </div>
    </div>
  )
}
