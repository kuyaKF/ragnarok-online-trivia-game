import { useMemo, useState } from 'react'
import DbGate from '@/components/layout/DbGate'
import GameShell from '@/components/layout/GameShell'
import Banner from '@/components/ui/Banner'
import Button from '@/components/ui/Button'
import OptionButton from '@/components/ui/OptionButton'
import Panel from '@/components/ui/Panel'
import SpriteBox from '@/components/ui/SpriteBox'
import { useRound } from '@/hooks/useRound'
import { shuffle } from '@/lib/shuffle'
import { monsterSpriteUrl } from '@/lib/sprites'
import RoundComplete from '../shared/RoundComplete'
import { buildQuestion, loadFixedLists, loadMonsters } from './factCheck'

export default function FactCheckPage() {
  return <DbGate>{(db) => <FactCheckGame db={db} />}</DbGate>
}

function FactCheckGame({ db }) {
  const lists = useMemo(() => loadFixedLists(db), [db])
  const round = useRound(() => shuffle(loadMonsters(db)))
  const { current: monster, score, answered } = round

  return (
    <GameShell score={score} answered={answered} width="max-w-md">
      {monster ? (
        <FactQuestion
          key={monster.id}
          monster={monster}
          lists={lists}
          onAnswer={round.record}
          onNext={round.next}
        />
      ) : (
        <RoundComplete score={score} answered={answered} onRestart={round.restart} />
      )}
    </GameShell>
  )
}

function optionState(opt, question, selected) {
  if (selected === null) return 'idle'
  if (opt.param === question.answerParam) return 'correct'
  if (opt.param === selected) return 'wrong'
  return 'dimmed'
}

function FactQuestion({ monster, lists, onAnswer, onNext }) {
  // Built once per monster, so the options don't reshuffle on re-render
  const [question] = useState(() => buildQuestion(monster, lists))
  const [selected, setSelected] = useState(null) // param the player picked

  const isAnswered = selected !== null
  const gotItRight = isAnswered && selected === question.answerParam

  function handlePick(param) {
    if (isAnswered) return
    setSelected(param)
    onAnswer(param === question.answerParam)
  }

  return (
    <Panel className="p-6">
      <SpriteBox
        src={monsterSpriteUrl(monster.id)}
        alt={monster.name}
        className="h-44"
        imgClassName="max-h-40 object-contain"
      />
      <p className="mt-3 text-center text-xl font-bold text-ink">{monster.name}</p>

      <h1 className="mt-4 text-lg font-bold text-ink">
        Which of these is{' '}
        <span className={question.kind === 'true' ? 'text-success-label' : 'text-danger-label'}>
          {question.kind === 'true' ? 'TRUE' : 'FALSE'}
        </span>
        ?
      </h1>

      <div className="mt-3 space-y-2">
        {question.options.map((opt) => (
          <OptionButton
            key={opt.param}
            layout="row"
            state={optionState(opt, question, selected)}
            onClick={() => handlePick(opt.param)}
            disabled={isAnswered}
          >
            <span className="font-semibold">{opt.label}:</span> {opt.shown}
            {isAnswered && !opt.isTrue && (
              <span className="ml-2 text-xs text-muted">(actual: {opt.actual})</span>
            )}
          </OptionButton>
        ))}
      </div>

      {isAnswered && (
        <>
          <Banner variant={gotItRight ? 'correct' : 'wrong'}>
            {gotItRight ? 'Correct!' : 'Not quite.'}
          </Banner>
          <Button variant="dark" onClick={onNext} autoFocus className="mt-3 w-full">
            Next monster
          </Button>
        </>
      )}
    </Panel>
  )
}
