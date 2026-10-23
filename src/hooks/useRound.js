import { useCallback, useState } from 'react'

/**
 * State shared by every trivia game: a shuffled queue of questions, the
 * current position and the score.
 *
 * `buildQueue` returns a fresh, shuffled array. It is called once on mount
 * and again on restart.
 *
 * Input state (typed guess, picked option...) is deliberately NOT here. Each
 * game keeps it in its own question component, rendered with `key={current id}`
 * so it resets by itself for every new question.
 */
export function useRound(buildQueue) {
  const [queue, setQueue] = useState(buildQueue)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)

  // Call once per question with whether the player got it right
  const record = useCallback((correct) => {
    setAnswered((n) => n + 1)
    if (correct) setScore((s) => s + 1)
  }, [])

  const next = useCallback(() => setIndex((i) => i + 1), [])

  const restart = useCallback(() => {
    setQueue(buildQueue())
    setIndex(0)
    setScore(0)
    setAnswered(0)
  }, [buildQueue])

  return { current: queue[index], score, answered, record, next, restart }
}
