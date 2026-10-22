import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDb } from '../db'
import { itemSpriteUrl } from './itemSprite'
import { loadItemPools, buildItemQueue, buildItemQuestion } from './itemDrops'

export default function ItemDropPage() {
  const { db, error } = useDb()

  if (error) return <p className="min-h-screen bg-gray-950 p-8 text-red-400">Error: {error}</p>
  if (!db) return <p className="min-h-screen bg-gray-950 p-8 text-gray-400">Loading database...</p>
  return <ItemDropGame db={db} />
}

function optionClasses(opt, picked) {
  const base = 'flex flex-col items-center rounded-lg border-2 p-3 text-center transition'

  if (picked === null) {
    return `${base} border-gray-200 bg-white hover:border-indigo-400 hover:bg-indigo-50`
  }
  // After answering, every valid monster is shown green, a wrong pick red
  if (opt.isCorrect) return `${base} border-green-500 bg-green-100`
  if (opt.id === picked) return `${base} border-red-500 bg-red-100`
  return `${base} border-gray-200 bg-gray-50 opacity-60`
}

function ItemDropGame({ db }) {
  const pools = useMemo(() => loadItemPools(db), [db])
  const [queue, setQueue] = useState(() => buildItemQueue(pools))
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null) // id of the monster the player chose
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)

  const item = queue[index]
  // Built once per item so the options don't reshuffle on re-render
  const question = useMemo(() => (item ? buildItemQuestion(db, item) : null), [db, item])

  const isAnswered = picked !== null
  const pickedOpt = question?.options.find((o) => o.id === picked)
  const wasRight = pickedOpt?.isCorrect === true

  function handlePick(opt) {
    if (isAnswered) return
    setPicked(opt.id)
    setAnswered((n) => n + 1)
    if (opt.isCorrect) setScore((s) => s + 1)
  }

  function handleNext() {
    setIndex((i) => i + 1)
    setPicked(null)
  }

  function handleRestart() {
    setQueue(buildItemQueue(pools))
    setIndex(0)
    setPicked(null)
    setScore(0)
    setAnswered(0)
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mx-auto max-w-lg">
        <div className="mb-4 flex items-center justify-between">
          <Link to="/" className="text-sm font-medium text-indigo-400 hover:underline">
            ← Home
          </Link>
          <p className="text-sm font-semibold text-gray-300">
            Score: {score} / {answered}
          </p>
        </div>

        {!question ? (
          <div className="rounded-xl bg-white p-6 text-center">
            <p className="text-lg font-semibold text-gray-900">Round complete!</p>
            <p className="mt-1 text-gray-600">Final score: {score} / {answered}</p>
            <button
              onClick={handleRestart}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
            >
              Play again
            </button>
          </div>
        ) : (
          <div className="rounded-xl bg-white p-6">
            <div className="flex flex-col items-center rounded-lg bg-gray-200 p-4">
              <img
                src={itemSpriteUrl(question.item)}
                alt=""
                className="h-14 w-14 object-contain"
              />
              <p className="mt-2 text-xl font-bold text-gray-900">{question.item.item_name}</p>
            </div>

            <h1 className="mt-4 text-lg font-bold text-gray-900">
              Which monster drops this item?
            </h1>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {question.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handlePick(opt)}
                  disabled={isAnswered}
                  className={optionClasses(opt, picked)}
                >
                  <img
                    src={`/sprites/${opt.id}.gif`}
                    alt=""
                    className="h-24 object-contain"
                  />
                  <span className="mt-2 font-medium text-gray-900">{opt.name}</span>
                  {isAnswered && opt.isCorrect && (
                    <span className="text-xs text-gray-600">drops at {opt.rate}%</span>
                  )}
                </button>
              ))}
            </div>

            {isAnswered && (
              <>
                <p
                  className={`mt-4 rounded-lg px-3 py-2 font-medium ${
                    wasRight ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {wasRight ? 'Correct!' : 'Not quite.'} This item drops from{' '}
                  {question.totalDroppers} monster{question.totalDroppers === 1 ? '' : 's'} in total.
                </p>
                <button
                  onClick={handleNext}
                  autoFocus
                  className="mt-3 w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700"
                >
                  Next question
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}