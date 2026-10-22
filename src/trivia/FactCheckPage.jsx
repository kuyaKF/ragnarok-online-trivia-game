import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDb } from '../db'
import { shuffle } from './nameGuess'
import { loadMonsters, loadFixedLists, buildQuestion } from './factCheck'

export default function FactCheckPage() {
  const { db, error } = useDb()

  if (error) return <p className="p-8 text-red-600">Error: {error}</p>
  if (!db) return <p className="p-8 text-gray-500">Loading database...</p>
  return <FactCheckGame db={db} />
}

function optionClasses(opt, question, selected) {
  const base = 'w-full rounded-lg border px-4 py-3 text-left transition'
  if (selected === null) {
    return `${base} border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50`
  }
  if (opt.param === question.answerParam) {
    return `${base} border-green-500 bg-green-100 text-green-900`
  }
  if (opt.param === selected) {
    return `${base} border-red-500 bg-red-100 text-red-900`
  }
  return `${base} border-gray-200 bg-gray-50 text-gray-400`
}

function FactCheckGame({ db }) {
  const lists = useMemo(() => loadFixedLists(db), [db])
  const [queue, setQueue] = useState(() => shuffle(loadMonsters(db)))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null) // param the player picked
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)

  const monster = queue[index]
  // Built once per monster, so the options don't reshuffle on re-render
  const question = useMemo(
    () => (monster ? buildQuestion(monster, lists) : null),
    [monster, lists]
  )

  function handlePick(param) {
    if (selected !== null) return
    setSelected(param)
    setAnswered((n) => n + 1)
    if (param === question.answerParam) setScore((s) => s + 1)
  }

  function handleNext() {
    setIndex((i) => i + 1)
    setSelected(null)
  }

  function handleRestart() {
    setQueue(shuffle(loadMonsters(db)))
    setIndex(0)
    setSelected(null)
    setScore(0)
    setAnswered(0)
  }

  const isAnswered = selected !== null
  const gotItRight = isAnswered && selected === question?.answerParam

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

      {!question ? (
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
        <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex h-44 items-center justify-center rounded-lg bg-gray-50">
            <img
                src={`/sprites/${monster.id}.gif`}
                alt={monster.name}
                className="max-h-40 object-contain"
            />
            </div>
          <p className="mt-3 text-center text-xl font-bold text-gray-900">{monster.name}</p>

          <h1 className="mt-4 text-lg font-bold text-gray-900">
            Which of these is{' '}
            <span className={question.kind === 'true' ? 'text-green-600' : 'text-red-600'}>
            {question.kind === 'true' ? 'TRUE' : 'FALSE'}
            </span>
            ?
          </h1>

          <div className="mt-3 space-y-2">
            {question.options.map((opt) => (
              <button
                key={opt.param}
                onClick={() => handlePick(opt.param)}
                disabled={isAnswered}
                className={optionClasses(opt, question, selected)}
              >
                <span className="font-semibold">{opt.label}:</span> {opt.shown}
                {isAnswered && !opt.isTrue && (
                  <span className="ml-2 text-xs text-gray-500">(actual: {opt.actual})</span>
                )}
              </button>
            ))}
          </div>

          {isAnswered && (
            <>
              <p
                className={`mt-4 rounded-lg px-3 py-2 font-medium ${
                  gotItRight ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {gotItRight ? 'Correct!' : 'Not quite.'}
              </p>
              <button
                onClick={handleNext}
                autoFocus
                className="mt-3 w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700"
              >
                Next monster
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}