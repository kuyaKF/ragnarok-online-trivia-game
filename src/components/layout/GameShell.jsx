import BackLink from './BackLink'
import PageShell from './PageShell'

// Page frame for every trivia game: dark page, "← Home" link and the score
export default function GameShell({ score, answered, width, children }) {
  return (
    <PageShell width={width}>
      <div className="mb-4 flex items-center justify-between">
        <BackLink to="/">← Home</BackLink>
        <p className="text-sm font-semibold text-on-page-soft">
          Score: {score} / {answered}
        </p>
      </div>
      {children}
    </PageShell>
  )
}
