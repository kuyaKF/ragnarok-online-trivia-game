import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import RevealPanel from './RevealPanel'

/*
 * The box-opening scene. `phase` moves through:
 *   shake (rumble + swell) -> zoomout -> zoomin (flash) -> reveal
 * and the parent (CollectionGame) owns the timing, the roll and the confetti.
 * `durations` gives the length in ms of each animated phase.
 */
const PHASE_CLASSES = {
  shake: 'stage-swell',
  zoomout: 'stage-zoomout',
  zoomin: 'stage-zoomin',
}

export default function OpeningModal({
  session,
  durations,
  Visual,
  ownedCount,
  onSkip,
  onClose,
  onAgain,
}) {
  const { box, count, pulls, phase } = session
  const revealed = phase === 'reveal'

  return (
    // Escape or a click outside skips the animation, and closes the modal once the reward is shown
    <Modal
      title={revealed ? `Opened ${box.name}` : `Opening ${box.name}`}
      onClose={revealed ? onClose : onSkip}
      width="max-w-md"
      hideTitle
    >
      {revealed ? (
        <>
          <RevealPanel pulls={pulls} Visual={Visual} ownedCount={ownedCount} />
          <div className="mt-4 flex gap-2">
            <Button onClick={onAgain} autoFocus className="flex-1">
              {count === 1 ? 'Open another' : `Open ×${count} again`}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </>
      ) : (
        <div className="relative flex flex-col items-center py-8">
          <div
            key={phase} // restarts the animation for each phase
            className={PHASE_CLASSES[phase]}
            style={{ '--phase-ms': `${durations[phase]}ms` }}
          >
            <img
              src={box.icon}
              alt=""
              className={`h-40 w-40 object-contain [image-rendering:pixelated] ${phase === 'shake' ? 'stage-rumble' : ''}`}
              style={{ '--phase-ms': `${durations.shake}ms` }}
            />
          </div>

          {phase === 'zoomin' && (
            <div
              className="stage-flash pointer-events-none absolute inset-0 rounded-xl bg-white"
              style={{ '--phase-ms': `${durations.zoomin}ms` }}
            />
          )}

          <p className="mt-6 text-sm font-medium text-muted">
            {count === 1 ? 'Opening…' : `Opening ${count} boxes…`}
          </p>
          <Button variant="ghost" onClick={onSkip} className="mt-2">
            Skip
          </Button>
        </div>
      )}
    </Modal>
  )
}
