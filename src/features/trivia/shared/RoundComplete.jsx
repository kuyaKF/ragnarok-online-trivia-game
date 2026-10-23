import Button from '@/components/ui/Button'
import Panel from '@/components/ui/Panel'

// End-of-round screen shared by all three games
export default function RoundComplete({ score, answered, onRestart }) {
  return (
    <Panel className="p-6 text-center">
      <p className="text-lg font-semibold text-ink">Round complete!</p>
      <p className="mt-1 text-quiet">Final score: {score} / {answered}</p>
      <Button onClick={onRestart} className="mt-4">
        Play again
      </Button>
    </Panel>
  )
}
