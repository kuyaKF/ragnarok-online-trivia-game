import { useMemo, useState } from 'react'
import BackLink from '@/components/layout/BackLink'
import DbGate from '@/components/layout/DbGate'
import PageShell from '@/components/layout/PageShell'
import FilterBar from './FilterBar'
import MonsterTable from './MonsterTable'
import Pagination from './Pagination'
import { EMPTY_FILTERS, PAGE_SIZE, buildWhere } from './filters'
import { countMonsters, getFilterOptions, listMonsters } from './queries'

export default function DatabasePage() {
  return <DbGate>{(db) => <DatabaseView db={db} />}</DbGate>
}

function DatabaseView({ db }) {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState(EMPTY_FILTERS)

  // Dropdown options come from the data itself
  const options = useMemo(() => getFilterOptions(db), [db])

  function updateFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value }))
    setPage(1) // a new filter always starts from the first page
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS)
    setPage(1)
  }

  const { where, params } = buildWhere(filters)
  const total = countMonsters(db, where, params)
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const rows = listMonsters(db, where, params, page, PAGE_SIZE)

  return (
    <PageShell width="max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-on-page">Monster Database</h1>
        <BackLink to="/">← Back home</BackLink>
      </div>

      <FilterBar filters={filters} options={options} onChange={updateFilter} onReset={resetFilters} />
      <MonsterTable rows={rows} />
      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
    </PageShell>
  )
}
