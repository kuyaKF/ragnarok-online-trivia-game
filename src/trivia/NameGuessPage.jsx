import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDb } from '../db'
import { loadPool, shuffle, isCorrect } from './nameGuess'

export default function NameGuessPage() {
  const { db, error } = useDb()

  if (error) return <p className="p-8 text-red-600">Error: {error}</p>
  if (!db) return <p className="p-8 text-gray-500">Loading database...</p>
  return <NameGuessGame db={db} />
}

function NameGuessGame({ db }) {
  // Shuffled once, so every monster is asked at most once per round
  const [queue, setQueue] = useState(() => shuffle(loadPool(db)))
  const [index, setIndex] = useState(0)
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState(null) // null | 'correct' | 'wrong' | 'skipped'
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)

  const monster = queue[index]

  function handleSubmit(e) {
    e.preventDefault()
    if (result || !guess.trim()) return
    const ok = isCorrect(guess, monster.name)
    setResult(ok ? 'correct' : 'wrong')
    setAnswered((n) => n + 1)
    if (ok) setScore((s) => s + 1)
  }

  function handleSkip() {
    if (result) return
    setResult('skipped')
    setAnswered((n) => n + 1)
  }

  function handleNext() {
    setIndex((i) => i + 1)
    setGuess('')
    setResult(null)
  }

  function handleRestart() {
    setQueue(shuffle(loadPool(db)))
    setIndex(0)
    setGuess('')
    setResult(null)
    setScore(0)
    setAnswered(0)
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <div className="mb-4 flex items-center justify-between">
        <Link to="/" className="text-sm font-medium text-indigo-600 hover:underline">
          ← Home
        </Link>
        <p className="text-sm font-semibold text-gray-700">
          Score: {score} / {answered}
        </p>
      </div>

      <h1 className="mb-4 text-2xl font-bold text-gray-900">Who's that monster?</h1>

      {!monster ? (
        <div className="rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-lg font-semibold">Round complete!</p>
          <p className="mt-1 text-gray-600">Final score: {score} / {answered}</p>
          <button
            onClick={handleRestart}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
          >
            Play again
          </button>
        </div>
      ) : (
        // key resets the input and its autofocus for each new monster
        <div key={monster.id} className="rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex h-48 items-center justify-center rounded-lg bg-gray-50">
            {/* Don't put the name in alt, it would give the answer away */}
            <img
              src={`/sprites/${monster.id}.gif`}
              alt="Mystery monster sprite"
              className="max-h-44 object-contain"
            />
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              disabled={result !== null}
              autoFocus
              autoComplete="off"
              placeholder="Type the monster's name"
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={result !== null || !guess.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Guess
            </button>
          </form>

          {result === null && (
            <button
              onClick={handleSkip}
              className="mt-3 text-sm text-gray-500 hover:text-gray-700 hover:underline"
            >
              Skip
            </button>
          )}

          {result === 'correct' && (
            <p className="mt-4 rounded-lg bg-green-100 px-3 py-2 font-medium text-green-800">
              Correct! It's {monster.name}.
            </p>
          )}
          {result === 'wrong' && (
            <p className="mt-4 rounded-lg bg-red-100 px-3 py-2 font-medium text-red-800">
              Not quite. It was {monster.name}.
            </p>
          )}
          {result === 'skipped' && (
            <p className="mt-4 rounded-lg bg-gray-100 px-3 py-2 font-medium text-gray-700">
              Skipped. It was {monster.name}.
            </p>
          )}

          {result !== null && (
            <button
              onClick={handleNext}
              autoFocus
              className="mt-3 w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700"
            >
              Next monster
            </button>
          )}
        </div>
      )}
    </div>
  )
}