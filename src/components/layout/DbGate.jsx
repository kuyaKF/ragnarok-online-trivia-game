import { useDb } from '@/hooks/useDb'
import PageMessage from './PageMessage'

/**
 * Waits for the database, then renders children(db).
 *
 *   <DbGate>{(db) => <MyPage db={db} />}</DbGate>
 */
export default function DbGate({ children }) {
  const { db, error } = useDb()

  if (error) return <PageMessage tone="error">Error: {error}</PageMessage>
  if (!db) return <PageMessage>Loading database...</PageMessage>
  return children(db)
}
