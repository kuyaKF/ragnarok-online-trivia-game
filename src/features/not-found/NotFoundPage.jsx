import { useLocation } from 'react-router-dom'
import NotFound from '@/components/layout/NotFound'

// Shown for any address that no route matches
export default function NotFoundPage() {
  const { pathname } = useLocation()
  return (
    <NotFound
      title="Page not found"
      message={`There's nothing at ${pathname}.`}
      links={[
        { to: '/', label: 'Back to the homepage' },
        { to: '/db', label: 'Browse the monster database' },
      ]}
    />
  )
}
