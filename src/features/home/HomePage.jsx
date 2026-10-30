import { Link } from 'react-router-dom'

// `color` shows until the cover image loads (or if it's missing).
// Add a game here and it appears on the homepage.
const GAMES = [
  {
    title: 'Guess the Monster',
    to: '/trivia/name',
    image: '/covers/guess-monster.png',
    color: 'bg-gradient-to-br from-sky-950 via-sky-800 to-cyan-400',
  },
  {
    title: 'True or False',
    to: '/trivia/facts',
    image: '/covers/true-or-false.png',
    color: 'bg-gradient-to-br from-indigo-900 via-violet-700 to-violet-300',
  },
  {
    title: 'Item Drops',
    to: '/trivia/drops',
    image: '/covers/item-drops.jpg',
    color: 'bg-rose-800',
  },
  {
    title: 'Gift Box Simulator',
    to: '/giftbox',
    image: '/covers/gift-box.jpg',
    color: 'bg-sky-800',
  },
]

function GameCard({ game }) {
  return (
    <Link
      to={game.to}
      className={`group relative flex h-56 items-center justify-center overflow-hidden rounded-3xl ring-1 ring-white/10 transition duration-200 hover:-translate-y-1 hover:ring-white/30 ${game.color}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${game.image})` }}
      />
      {/* Darker overlay keeps the title readable on any cover image */}
      <div className="absolute inset-0 bg-black/40 transition group-hover:bg-black/25" />
      <span className="relative px-4 text-center text-3xl font-extrabold text-white drop-shadow-md">
        {game.title}
      </span>
    </Link>
  )
}

// The page lets the mouse through to the background sprites; its content blocks (marked
// pointer-events-auto) do not.
export default function HomePage() {
  return (
    <main className="pointer-events-none relative z-10 min-h-screen px-6 py-16">
      <header className="pointer-events-auto mx-auto max-w-5xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-on-page sm:text-6xl">
          Ragnarok Online Trivia
        </h1>
        <p className="mt-3 text-lg text-on-page-muted">Test your knowledge, made by Felix</p>
      </header>

      <div className="pointer-events-auto mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {GAMES.map((game) => (
          <GameCard key={game.to} game={game} />
        ))}
      </div>

      <footer className="pointer-events-auto mt-16 text-center text-xs text-on-page-faint">
        <Link to="/db" className="hover:text-on-page-soft hover:underline">
          Browse the monster database
        </Link>
        <p className="mt-2">
          Fan-made project, not affiliated with Gravity. Game data and sprites from ratemyserver.net.
        </p>
      </footer>
    </main>
  )
}
