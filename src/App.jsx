import { useEffect, useState } from 'react'
import { Routes, Route, Link, useParams } from 'react-router-dom'
import { useDb, query } from './db'

const PAGE_SIZE = 20

const RESISTANCES = ['neutral', 'water', 'earth', 'fire', 'wind', 'poison', 'holy', 'shadow', 'ghost', 'undead']

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-2">
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

function Home() {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold text-gray-900">Hello World</h1>
      <Link
        to="/db"
        className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
      >
        View the database
      </Link>
    </div>
  )
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

function Database() {
  const { db, error } = useDb()
  const [page, setPage] = useState(1)

  if (error) {
    return <p className="p-8 text-red-600">Error: {error}</p>
  }
  if (!db) {
    return <p className="p-8 text-gray-500">Loading database...</p>
  }

  const total = query(db, 'SELECT COUNT(*) AS n FROM monsters')[0].n
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const rows = query(
    db,
    `SELECT id, name, internal_name, level, hp, race, element, element_level, size
     FROM monsters
     ORDER BY id
     LIMIT ? OFFSET ?`,
    [PAGE_SIZE, (page - 1) * PAGE_SIZE]
  )

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Monster Database</h1>
        <Link to="/" className="text-sm font-medium text-indigo-600 hover:underline">
          ← Back home
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
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
            {rows.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <img
                    src={`/sprites/${m.id}.gif`}
                    alt={m.name}
                    className="h-12 w-12 object-contain"
                    loading="lazy"
                  />
                </td>
                <td className="px-4 py-2 tabular-nums text-gray-500">{m.id}</td>
                <td className="px-4 py-2">
                  <Link to={`/db/${m.id}`} className="font-medium text-indigo-600 hover:underline">
                    {m.name}
                  </Link>
                  <div className="text-xs text-gray-400">{m.internal_name}</div>
                </td>
                <td className="px-4 py-2 tabular-nums">{m.level}</td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {m.hp.toLocaleString()}
                </td>
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
        <p className="text-sm text-gray-600">
          Page <span className="font-semibold">{page}</span> of {totalPages} · {total} monsters
        </p>
        <div className="flex gap-2">
          <PageButton onClick={() => setPage(1)} disabled={page === 1}>First</PageButton>
          <PageButton onClick={() => setPage((p) => p - 1)} disabled={page === 1}>Prev</PageButton>
          <PageButton onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>Next</PageButton>
          <PageButton onClick={() => setPage(totalPages)} disabled={page === totalPages}>Last</PageButton>
        </div>
      </div>
    </div>
  )
}

function MonsterDetail() {
  const { id } = useParams()
  const { db, error } = useDb()

  if (error) return <p className="p-8 text-red-600">Error: {error}</p>
  if (!db) return <p className="p-8 text-gray-500">Loading database...</p>

  const m = query(db, 'SELECT * FROM monsters WHERE id = ?', [Number(id)])[0]
  if (!m) {
    return (
      <div className="p-8">
        <p className="text-gray-700">No monster with ID {id}.</p>
        <Link to="/db" className="text-indigo-600 hover:underline">← Back to database</Link>
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
    <div className="mx-auto max-w-4xl p-6">
      <Link to="/db" className="text-sm font-medium text-indigo-600 hover:underline">
        ← Back to database
      </Link>

      <div className="mt-4 flex items-center gap-5">
        <img src={`/sprites/${m.id}.gif`} alt={m.name} className="h-28 w-28 object-contain" />
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
              <li key={`${d.item_id}-${i}`} className="flex justify-between px-4 py-2 text-sm">
                <span className="text-gray-800">{d.item_name}</span>
                <span className="tabular-nums text-gray-500">{d.rate_percent}%</span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/db" element={<Database />} />
      <Route path="/db/:id" element={<MonsterDetail />} />
    </Routes>
  )
}

export default App