import { Link } from 'react-router-dom'

// Adding a game = adding one line here. `color` shows until the cover image loads
// (or if the image is missing). Class names are written out in full so Tailwind finds them.
const GAMES = [
  {
    title: 'Guess the Monster',
    to: '/trivia/name',
    image: '/covers/guess-monster.jpg',
    color: 'bg-emerald-600',
  },
  {
    title: 'True or False',
    to: '/trivia/facts',
    image: '/covers/true-or-false.jpg',
    color: 'bg-amber-600',
  },
  {
    title: 'Item Drops',
    to: '/trivia/drops',
    image: '/covers/item-drops.jpg',
    color: 'bg-rose-600',
  },
]

function GameCard({ game }) {
  return (
    <Link
      to={game.to}
      className={`group relative flex h-44 items-center justify-center overflow-hidden rounded-3xl shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-xl ${game.color}`}
    >
      {/* Cover image: zooms slightly on hover */}
      <div
        className="absolute inset-0 bg-cover bg-center transition duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${game.image})` }}
      />
      {/* Dark overlay keeps the title readable on any image */}
      <div className="absolute inset-0 bg-black/30 transition group-hover:bg-black/20" />
      <span className="relative px-4 text-center text-2xl font-extrabold text-white drop-shadow-md">
        {game.title}
      </span>
    </Link>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <header className="mx-auto max-w-5xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Ragnarok Online Trivia
        </h1>
        <p className="mt-3 text-lg text-gray-500">Test your knowledge by Felix</p>
      </header>

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => (
          <GameCard key={game.to} game={game} />
        ))}
      </div>

      <footer className="mt-16 text-center text-xs text-gray-400">
        <Link to="/db" className="hover:text-gray-600 hover:underline">
          Browse the monster database
        </Link>
        <p className="mt-2">
          Fan-made project, not affiliated with Gravity. Game data and sprites from ratemyserver.net.
        </p>
      </footer>
    </main>
  )
}