const TONES = {
  muted: 'text-on-page-muted',
  error: 'text-danger-on-page',
}

// Full-screen message on the dark page (loading, errors)
export default function PageMessage({ tone = 'muted', children }) {
  return <p className={`min-h-screen bg-page p-8 ${TONES[tone]}`}>{children}</p>
}
