import { Link } from 'react-router-dom'

// Link on the dark page, e.g. "← Home"
export default function BackLink({ to, children }) {
  return (
    <Link to={to} className="text-sm font-medium text-link hover:underline">
      {children}
    </Link>
  )
}
