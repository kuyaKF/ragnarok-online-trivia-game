import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, useParams } from 'react-router-dom'
import { useDb, query } from './db'
import NameGuessPage from './trivia/NameGuessPage'
import FactCheckPage from './trivia/FactCheckPage'
import { itemSpriteUrl } from './trivia/itemSprite'
import ItemDropPage from './trivia/ItemDropPage'
import Home from './Home'

const PAGE_SIZE = 20

const RESISTANCES = ['neutral', 'water', 'earth', 'fire', 'wind', 'poison', 'holy', 'shadow', 'ghost', 'undead']

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-100 px-3 py-2">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="font-semibold tabular-nums text-gray-900">{value ?? '—'}</div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-lg font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  )
}

// Full class names must appear literally in the source, otherwise Tailwind won't generate them
const ELEMENT_STYLES = {
  Neutral: 'bg-gray-100 text-gray-700',
  Water: 'bg-blue-100 text-blue-700',
  Earth: 'bg-amber-100 text-amber-800',
  Fire: 'bg-red-100 text-red-700',
  Wind: 'bg-emerald-100 text-emerald-700',
  Poison: 'bg-purple-100 text-purple-700',
  Holy: 'bg-yellow-100 text-yellow-800',
  Shadow: 'bg-slate-300 text-slate-800',
  Ghost: 'bg-indigo-100 text-indigo-700',
  Undead: 'bg-zinc-300 text-zinc-800',
}

function PageButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
    >
      {children}
    </button>
  )
}

const EMPTY_FILTERS = {
  search: '',
  race: '',
  element: '',
  size: '',
  minLevel: '',
  maxLevel: '',
  mvpOnly: false,
  hideGuild: true,
}

// Turns the filter state into a parameterized WHERE clause
function buildWhere(f) {
  const clauses = []
  const params = []

  if (f.search.trim()) {
    const s = `%${f.search.trim()}%`
    clauses.push('(name LIKE ? OR internal_name LIKE ?)')
    params.push(s, s)
  }
  if (f.race) { clauses.push('race = ?'); params.push(f.race) }
  if (f.element) { clauses.push('element = ?'); params.push(f.element) }
  if (f.size) { clauses.push('size = ?'); params.push(f.size) }
  if (f.minLevel !== '') { clauses.push('level >= ?'); params.push(Number(f.minLevel)) }
  if (f.maxLevel !== '') { clauses.push('level <= ?'); params.push(Number(f.maxLevel)) }
  if (f.mvpOnly) clauses.push('is_mvp = 1')
  if (f.hideGuild) clauses.push('is_guild_variant = 0')

  return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params }
}

const inputClasses =
  'rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'

function Database() {
  const { db, error } = useDb()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState(EMPTY_FILTERS)

  // Dropdown options come from the data itself
  const options = useMemo(() => {
    if (!db) return null
    const distinct = (col) =>
      query(db, `SELECT DISTINCT ${col} AS v FROM monsters ORDER BY v`).map((r) => r.v)
    return { races: distinct('race'), elements: distinct('element'), sizes: distinct('size') }
  }, [db])

  if (error) {
    return <p className="min-h-screen bg-gray-950 p-8 text-red-400">Error: {error}</p>
  }
  if (!db) {
    return <p className="min-h-screen bg-gray-950 p-8 text-gray-400">Loading database...</p>
  }

  function updateFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value }))
    setPage(1) // a new filter always starts from the first page
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS)
    setPage(1)
  }

  const { where, params } = buildWhere(filters)
  const total = query(db, `SELECT COUNT(*) AS n FROM monsters ${where}`, params)[0].n
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const rows = query(
    db,
    `SELECT id, name, internal_name, level, hp, race, element, element_level, size
     FROM monsters
     ${where}
     ORDER BY id
     LIMIT ? OFFSET ?`,
    [...params, PAGE_SIZE, (page - 1) * PAGE_SIZE]
  )

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Monster Database</h1>
          <Link to="/" className="text-sm font-medium text-indigo-400 hover:underline">
            ← Back home
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-4 rounded-xl bg-white p-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex min-w-48 flex-1 flex-col text-xs font-medium text-gray-500">
              Search
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Name or internal name"
                className={`mt-1 ${inputClasses}`}
              />
            </label>

            {[
              ['race', 'Race', options.races],
              ['element', 'Element', options.elements],
              ['size', 'Size', options.sizes],
            ].map(([key, label, values]) => (
              <label key={key} className="flex flex-col text-xs font-medium text-gray-500">
                {label}
                <select
                  value={filters[key]}
                  onChange={(e) => updateFilter(key, e.target.value)}
                  className={`mt-1 ${inputClasses}`}
                >
                  <option value="">All</option>
                  {values.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </label>
            ))}

            <label className="flex flex-col text-xs font-medium text-gray-500">
              Level
              <div className="mt-1 flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  value={filters.minLevel}
                  onChange={(e) => updateFilter('minLevel', e.target.value)}
                  placeholder="Min"
                  className={`w-20 ${inputClasses}`}
                />
                <span className="text-gray-400">–</span>
                <input
                  type="number"
                  min="1"
                  value={filters.maxLevel}
                  onChange={(e) => updateFilter('maxLevel', e.target.value)}
                  placeholder="Max"
                  className={`w-20 ${inputClasses}`}
                />
              </div>
            </label>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.mvpOnly}
                onChange={(e) => updateFilter('mvpOnly', e.target.checked)}
              />
              MVPs only
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.hideGuild}
                onChange={(e) => updateFilter('hideGuild', e.target.checked)}
              />
              Hide guild variants
            </label>
            <button
              onClick={resetFilters}
              className="ml-auto text-sm font-medium text-indigo-600 hover:underline"
            >
              Reset filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Sprite</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3 text-right">HP</th>
                <th className="px-4 py-3">Race</th>
                <th className="px-4 py-3">Element</th>
                <th className="px-4 py-3">Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white text-gray-800">
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                    No monsters match these filters.
                  </td>
                </tr>
              )}
              {rows.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-200">
                      <img
                        src={`/sprites/${m.id}.gif`}
                        alt={m.name}
                        className="h-12 w-12 object-contain"
                        loading="lazy"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 tabular-nums text-gray-500">{m.id}</td>
                  <td className="px-4 py-2">
                    <Link to={`/db/${m.id}`} className="font-medium text-indigo-600 hover:underline">
                      {m.name}
                    </Link>
                    <div className="text-xs text-gray-400">{m.internal_name}</div>
                  </td>
                  <td className="px-4 py-2 tabular-nums">{m.level}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{m.hp.toLocaleString()}</td>
                  <td className="px-4 py-2">{m.race}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        ELEMENT_STYLES[m.element] ?? 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {m.element} {m.element_level}
                    </span>
                  </td>
                  <td className="px-4 py-2">{m.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-400">
            Page <span className="font-semibold text-white">{page}</span> of {totalPages} · {total} monsters
          </p>
          <div className="flex gap-2">
            <PageButton onClick={() => setPage(1)} disabled={page === 1}>First</PageButton>
            <PageButton onClick={() => setPage((p) => p - 1)} disabled={page === 1}>Prev</PageButton>
            <PageButton onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>Next</PageButton>
            <PageButton onClick={() => setPage(totalPages)} disabled={page === totalPages}>Last</PageButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function MonsterDetail() {
  const { id } = useParams()
  const { db, error } = useDb()

  if (error) return <p className="min-h-screen bg-gray-950 p-8 text-red-400">Error: {error}</p>
  if (!db) return <p className="min-h-screen bg-gray-950 p-8 text-gray-400">Loading database...</p>

  const m = query(db, 'SELECT * FROM monsters WHERE id = ?', [Number(id)])[0]
  if (!m) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <p className="text-gray-300">No monster with ID {id}.</p>
        <Link to="/db" className="text-indigo-400 hover:underline">← Back to database</Link>
      </div>
    )
  }

  const drops = query(
    db,
    'SELECT item_id, item_name, rate_percent FROM drops WHERE mob_id = ? ORDER BY rate_percent DESC',
    [m.id]
  )
  const modes = m.modes ? m.modes.split('; ') : []
  const maps = m.maps ? m.maps.split('; ') : []

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mx-auto max-w-4xl">
        <Link to="/db" className="text-sm font-medium text-indigo-400 hover:underline">
          ← Back to database
        </Link>

        <div className="mt-4 rounded-xl bg-white p-6">
          <div className="flex items-center gap-5">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-lg bg-gray-200">
              <img src={`/sprites/${m.id}.gif`} alt={m.name} className="h-28 w-28 object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{m.name}</h1>
              <p className="text-gray-500">
                {m.internal_name} · ID #{m.id}
              </p>
              <div className="mt-2 flex gap-2">
                {m.is_mvp === 1 && (
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">MVP</span>
                )}
                {m.is_guild_variant === 1 && (
                  <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700">Guild variant</span>
                )}
              </div>
            </div>
          </div>

          <Section title="Overview">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Level" value={m.level} />
              <Stat label="HP" value={m.hp.toLocaleString()} />
              <Stat label="Race" value={m.race} />
              <Stat label="Element" value={`${m.element} ${m.element_level}`} />
              <Stat label="Size" value={m.size} />
              <Stat label="Attack" value={m.attack_min != null ? `${m.attack_min}–${m.attack_max}` : null} />
              <Stat label="Def / MDef" value={`${m.defense} / ${m.magic_defense}`} />
              <Stat label="Hit / Flee" value={`${m.hit} / ${m.flee}`} />
              <Stat label="Base Exp" value={m.base_exp?.toLocaleString()} />
              <Stat label="Job Exp" value={m.job_exp?.toLocaleString()} />
              {m.is_mvp === 1 && <Stat label="MVP Exp" value={m.mvp_exp?.toLocaleString()} />}
              <Stat label="Walk speed" value={m.walk_speed} />
            </div>
          </Section>

          <Section title="Attributes">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {['str', 'agi', 'vit', 'int', 'dex', 'luk'].map((s) => (
                <Stat key={s} label={s} value={m[s]} />
              ))}
            </div>
          </Section>

          <Section title="Element resistance (damage taken)">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {RESISTANCES.map((el) => (
                <Stat key={el} label={el} value={`${m[`res_${el}`]}%`} />
              ))}
            </div>
          </Section>

          {modes.length > 0 && (
            <Section title="Mode">
              <ul className="flex flex-wrap gap-2">
                {modes.map((mode) => (
                  <li key={mode} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">{mode}</li>
                ))}
              </ul>
            </Section>
          )}

          {maps.length > 0 && (
            <Section title="Found on maps">
              <ul className="flex flex-wrap gap-2">
                {maps.map((map) => (
                  <li key={map} className="rounded-md bg-gray-100 px-2 py-1 font-mono text-sm text-gray-700">{map}</li>
                ))}
              </ul>
            </Section>
          )}

          <Section title={`Drops (${drops.length})`}>
            {drops.length === 0 ? (
              <p className="text-gray-500">No drops recorded.</p>
            ) : (
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
                {drops.map((d, i) => (
                  <li
                    key={`${d.item_id}-${i}`}
                    className="flex items-center justify-between px-4 py-2 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-200">
                        <img src={itemSpriteUrl(d)} alt="" className="h-6 w-6 object-contain" />
                      </div>
                      <span className="text-gray-800">{d.item_name}</span>
                    </div>
                    <span className="tabular-nums text-gray-500">{d.rate_percent}%</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/db" element={<Database />} />
      <Route path="/db/:id" element={<MonsterDetail />} />
      <Route path="/trivia/name" element={<NameGuessPage />} />
      <Route path="/trivia/facts" element={<FactCheckPage />} />
      <Route path="/trivia/drops" element={<ItemDropPage />} />
    </Routes>
  )
}

export default App