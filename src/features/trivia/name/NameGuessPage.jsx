import { useState } from 'react'
import DbGate from '@/components/layout/DbGate'
import GameShell from '@/components/layout/GameShell'
import Banner from '@/components/ui/Banner'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Panel from '@/components/ui/Panel'
import SpriteBox from '@/components/ui/SpriteBox'
import { useRound } from '@/hooks/useRound'
import { shuffle } from '@/lib/shuffle'
import { monsterSpriteUrl } from '@/lib/sprites'
import RoundComplete from '../shared/RoundComplete'
import { isCorrect, loadPool } from './nameGuess'

export default function NameGuessPage() {
  return <DbGate>{(db) => <NameGuessGame db={db} />}</DbGate>
}

function NameGuessGame({ db }) {
  // Shuffled once, so every monster is asked at most once per round
  const round = useRound(() => shuffle(loadPool(db)))
  const { current: monster, score, answered } = round

  return (
    <GameShell score={score} answered={answered} width="max-w-md">
      <h1 className="mb-4 text-2xl font-bold text-on-page">Who's that monster?</h1>

      {monster ? (
        // key resets the input and its autofocus for each new monster
        <NameQuestion
          key={monster.id}
          monster={monster}
          onAnswer={round.record}
          onNext={round.next}
        />
      ) : (
        <RoundComplete score={score} answered={answered} onRestart={round.restart} />
      )}
    </GameShell>
  )
}

function NameQuestion({ monster, onAnswer, onNext }) {
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState(null) // null | 'correct' | 'wrong' | 'skipped'

  function handleSubmit(e) {
    e.preventDefault()
    if (result || !guess.trim()) return
    const ok = isCorrect(guess, monster.name)
    setResult(ok ? 'correct' : 'wrong')
    onAnswer(ok)
  }

  function handleSkip() {
    if (result) return
    setResult('skipped')
    onAnswer(false)
  }

  return (
    <Panel className="p-6">
      {/* Don't put the name in alt, it would give the answer away */}
      <SpriteBox
        src={monsterSpriteUrl(monster.id)}
        alt="Mystery monster sprite"
        className="h-48"
        imgClassName="max-h-44 object-contain"
      />

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Input
          size="md"
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={result !== null}
          autoFocus
          autoComplete="off"
          placeholder="Type the monster's name"
          className="min-w-0 flex-1"
        />
        <Button type="submit" disabled={result !== null || !guess.trim()}>
          Guess
        </Button>
      </form>

      {result === null && (
        <Button variant="ghost" onClick={handleSkip} className="mt-3">
          Skip
        </Button>
      )}

      {result === 'correct' && <Banner variant="correct">Correct! It's {monster.name}.</Banner>}
      {result === 'wrong' && <Banner variant="wrong">Not quite. It was {monster.name}.</Banner>}
      {result === 'skipped' && <Banner variant="neutral">Skipped. It was {monster.name}.</Banner>}

      {result !== null && (
        <Button variant="dark" onClick={onNext} autoFocus className="mt-3 w-full">
          Next monster
        </Button>
      )}
    </Panel>
  )
}
