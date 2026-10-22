import { Link } from 'react-router-dom'
import SpriteBackground from './SpriteBackground'

// in Home():
<main className="relative isolate min-h-screen bg-gray-950 px-6 py-16">
  <SpriteBackground />
  <div className="relative z-10">
    {/* ...your existing header, grid of game cards, and footer go here... */}
  </div>
</main>

// `color` shows until the cover image loads (or if it's missing)
const GAMES = [
  {
    title: 'Guess the Monster',
    to: '/trivia/name',
    image: '/covers/guess-monster.jpg',
    color: 'bg-emerald-800',
  },
  {
    title: 'True or False',
    to: '/trivia/facts',
    image: '/covers/true-or-false.jpg',
    color: 'bg-amber-800',
  },
  {
    title: 'Item Drops',
    to: '/trivia/drops',
    image: '/covers/item-drops.jpg',
    color: 'bg-rose-800',
  },
]

function GameCard({ game }) {
  return (
    <Link
      to={game.to}
      className={`group relative flex h-44 items-center justify-center overflow-hidden rounded-3xl ring-1 ring-white/10 transition duration-200 hover:-translate-y-1 hover:ring-white/30 ${game.color}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${game.image})` }}
      />
      {/* Slightly darker overlay than before, so the covers sit well on a dark page */}
      <div className="absolute inset-0 bg-black/40 transition group-hover:bg-black/25" />
      <span className="relative px-4 text-center text-2xl font-extrabold text-white drop-shadow-md">
        {game.title}
      </span>
    </Link>
  )
}

export default function Home() {
  return (
    <main className="relative isolate min-h-screen bg-gray-950 px-6 py-16">
      <SpriteBackground />
        <div className="relative z-10">
            <header className="mx-auto max-w-5xl text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                Ragnarok Online Trivia
                </h1>
                <p className="mt-3 text-lg text-gray-400">Test your knowledge, made by Felix</p>
            </header>

            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {GAMES.map((game) => (
                <GameCard key={game.to} game={game} />
                ))}
            </div>

            <footer className="mt-16 text-center text-xs text-gray-500">
                <Link to="/db" className="hover:text-gray-300 hover:underline">
                Browse the monster database
                </Link>
                <p className="mt-2">
                Fan-made project, not affiliated with Gravity. Game data and sprites from ratemyserver.net.
                </p>
            </footer>
        </div>
    </main>
  )
}