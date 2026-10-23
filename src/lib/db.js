import initSqlJs from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import dbUrl from '../assets/monsters.db?url'

let dbPromise = null

// Loads sql.js + the .db file once; later calls reuse the same promise.
// A failed load is not kept, so the next call can try again.
export function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const [SQL, buffer] = await Promise.all([
        initSqlJs({ locateFile: () => wasmUrl }),
        fetch(dbUrl).then((res) => {
          if (!res.ok) throw new Error(`Could not load database (${res.status})`)
          return res.arrayBuffer()
        }),
      ])
      return new SQL.Database(new Uint8Array(buffer))
    })().catch((err) => {
      dbPromise = null
      throw err
    })
  }
  return dbPromise
}

// Runs a SELECT and returns an array of plain objects
export function query(db, sql, params = []) {
  const stmt = db.prepare(sql)
  stmt.bind(params)
  const rows = []
  while (stmt.step()) rows.push(stmt.getAsObject())
  stmt.free()
  return rows
}
