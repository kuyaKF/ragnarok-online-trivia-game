import { useMemo, useState } from 'react'
import DbGate from '@/components/layout/DbGate'
import GameShell from '@/components/layout/GameShell'
import Banner from '@/components/ui/Banner'
import Button from '@/components/ui/Button'
import OptionButton from '@/components/ui/OptionButton'
import Panel from '@/components/ui/Panel'
import { useRound } from '@/hooks/useRound'
import { itemSpriteUrl, monsterSpriteUrl } from '@/lib/sprites'
import RoundComplete from '../shared/RoundComplete'
import { buildItemQueue, buildItemQuestion, loadItemPools } from './itemDrops'

export default function ItemDropPage() {
  return <DbGate>{(db) => <ItemDropGame db={db} />}</DbGate>
}

function ItemDropGame({ db }) {
  const pools = useMemo(() => loadItemPools(db), [db])
  const round = useRound(() => buildItemQueue(pools))
  const { current: item, score, answered } = round

  return (
    <GameShell score={score} answered={answered} width="max-w-lg">
      {item ? (
        <ItemQuestion
          key={item.item_id}
          db={db}
          item={item}
          onAnswer={round.record}
          onNext={round.next}
        />
      ) : (
        <RoundComplete score={score} answered={answered} onRestart={round.restart} />
      )}
    </GameShell>
  )
}

function optionState(opt, picked) {
  if (picked === null) return 'idle'
  // After answering, every valid monster is shown green, a wrong pick red
  if (opt.isCorrect) return 'correct'
  if (opt.id === picked) return 'wrong'
  return 'dimmed'
}

function ItemQuestion({ db, item, onAnswer, onNext }) {
  // Built once per item so the options don't reshuffle on re-render
  const [question] = useState(() => buildItemQuestion(db, item))
  const [picked, setPicked] = useState(null) // id of the monster the player chose

  const isAnswered = picked !== null
  const pickedOpt = question.options.find((o) => o.id === picked)
  const wasRight = pickedOpt?.isCorrect === true

  function handlePick(opt) {
    if (isAnswered) return
    setPicked(opt.id)
    onAnswer(opt.isCorrect)
  }

  return (
    <Panel className="p-6">
      <div className="flex flex-col items-center rounded-lg bg-well p-4">
        <img src={itemSpriteUrl(question.item)} alt="" className="h-14 w-14 object-contain" />
        <p className="mt-2 text-xl font-bold text-ink">{question.item.item_name}</p>
      </div>

      <h1 className="mt-4 text-lg font-bold text-ink">Which monster drops this item?</h1>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {question.options.map((opt) => (
          <OptionButton
            key={opt.id}
            layout="card"
            state={optionState(opt, picked)}
            onClick={() => handlePick(opt)}
            disabled={isAnswered}
          >
            <img src={monsterSpriteUrl(opt.id)} alt="" className="h-24 object-contain" />
            <span className="mt-2 font-medium text-ink">{opt.name}</span>
            {isAnswered && opt.isCorrect && (
              <span className="text-xs text-quiet">drops at {opt.rate}%</span>
            )}
          </OptionButton>
        ))}
      </div>

      {isAnswered && (
        <>
          <Banner variant={wasRight ? 'correct' : 'wrong'}>
            {wasRight ? 'Correct!' : 'Not quite.'} This item drops from{' '}
            {question.totalDroppers} monster{question.totalDroppers === 1 ? '' : 's'} in total.
          </Banner>
          <Button variant="dark" onClick={onNext} autoFocus className="mt-3 w-full">
            Next question
          </Button>
        </>
      )}
    </Panel>
  )
}
