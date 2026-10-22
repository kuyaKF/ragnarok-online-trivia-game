import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { getDb, query } from './db'

const PAGE_SIZE = 20

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
  const [db, setDb] = useState(null)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    getDb().then(setDb).catch((err) => setError(err.message))
  }, [])

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
                  <div className="font-medium">{m.name}</div>
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/db" element={<Database />} />
    </Routes>
  )
}

export default App