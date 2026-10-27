import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BackLink from '@/components/layout/BackLink'
import DbGate from '@/components/layout/DbGate'
import PageShell from '@/components/layout/PageShell'
import FilterBar from './FilterBar'
import MonsterTable from './MonsterTable'
import Pagination from './Pagination'
import {
  PAGE_SIZE,
  buildWhere,
  clearFilterParams,
  filtersFromParams,
  pageFromParams,
  setFilterParam,
  setPageParam,
} from './filters'
import { countMonsters, getFilterOptions, listMonsters } from './queries'

export default function DatabasePage() {
  return <DbGate>{(db) => <DatabaseView db={db} />}</DbGate>
}

/*
 * The page and the filters live in the URL (/db?page=2&race=Dragon), so Back, Forward,
 * refresh and shared links all show the same list. Changing a filter replaces the current
 * history entry (so Back doesn't step through every keystroke); changing the page adds one.
 */
function DatabaseView({ db }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const options = useMemo(() => getFilterOptions(db), [db])

  // The newest query string, including changes the router hasn't shown yet,
  // so two quick changes (like Min and Max level) don't overwrite each other
  const latest = useRef(searchParams)
  useEffect(() => {
    latest.current = searchParams
  }, [searchParams])

  const update = useCallback(
    (change, replace) => {
      const next = new URLSearchParams(latest.current)
      change(next)
      latest.current = next
      const search = next.toString()
      navigate({ search: search ? `?${search}` : '' }, { replace })
    },
    [navigate]
  )

  const updateFilter = useCallback((key, value) => update((p) => setFilterParam(p, key, value), true), [update])
  const resetFilters = useCallback(() => update(clearFilterParams, true), [update])
  const goToPage = (page) => update((p) => setPageParam(p, page), false)

  const filters = filtersFromParams(searchParams, options)
  const { where, params } = buildWhere(filters)
  const total = countMonsters(db, where, params)
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const page = Math.min(pageFromParams(searchParams), totalPages)
  const rows = listMonsters(db, where, params, page, PAGE_SIZE)

  return (
    <PageShell width="max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-on-page">Monster Database</h1>
        <BackLink to="/">← Back home</BackLink>
      </div>

      <FilterBar filters={filters} options={options} onChange={updateFilter} onReset={resetFilters} />
      <Pagination
        label="Pagination, top"
        className="mb-4"
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={goToPage}
      />
      <MonsterTable rows={rows} />
      <Pagination
        label="Pagination, bottom"
        className="mt-4"
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={(n) => {
          goToPage(n)
          window.scrollTo({ top: 0 }) // you are at the bottom of the page, so go back up
        }}
      />
    </PageShell>
  )
}
