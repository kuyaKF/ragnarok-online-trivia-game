import { useEffect, useState } from 'react'
import { getDb } from '@/lib/db'

// Loads the shared database once; returns { db, error } (db is null until ready)
export function useDb() {
  const [db, setDb] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDb().then(setDb).catch((err) => setError(err.message))
  }, [])

  return { db, error }
}
