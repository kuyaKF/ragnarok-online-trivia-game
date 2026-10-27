import { Link } from 'react-router-dom'
import { ButtonLink } from '@/components/ui/Button'
import PageShell from './PageShell'

/*
 * "Nothing here" page. `links` is [{ to, label }]: the first one is the big button,
 * the rest are small links under it.
 */
export default function NotFound({ title, message, links }) {
  const [main, ...others] = links
  return (
    <PageShell width="max-w-md">
      <div className="pt-16 text-center">
        <p className="text-7xl font-extrabold text-on-page">404</p>
        <h1 className="mt-4 text-2xl font-bold text-on-page">{title}</h1>
        <p className="mt-2 break-words text-on-page-muted">{message}</p>
        <ButtonLink to={main.to} className="mt-8 inline-block px-5 py-2.5">
          {main.label}
        </ButtonLink>
        {others.map((link) => (
          <p key={link.to} className="mt-4">
            <Link to={link.to} className="text-sm font-medium text-link hover:underline">
              {link.label}
            </Link>
          </p>
        ))}
      </div>
    </PageShell>
  )
}
