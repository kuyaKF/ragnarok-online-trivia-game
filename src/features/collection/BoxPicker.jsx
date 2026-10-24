import Button from '@/components/ui/Button'

// The boxes you click to open. They all do the same thing; the icon is just a skin.
export default function BoxPicker({ boxes, activeBox, onOpen }) {
  const active = boxes.find((b) => b.id === activeBox) ?? boxes[0]

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {boxes.map((box) => (
          <button
            key={box.id}
            onClick={() => onOpen(1, box)}
            aria-label={`Open a ${box.name}`}
            className="group flex flex-col items-center rounded-2xl border-2 border-line bg-chip px-2 py-6 hover:border-accent-edge hover:bg-accent-soft"
          >
            <img
              src={box.icon}
              alt=""
              className="h-20 w-20 object-contain transition-transform duration-200 [image-rendering:pixelated] group-hover:scale-110 sm:h-28 sm:w-28"
            />
            <span className="mt-3 text-center text-sm font-semibold text-soft">{box.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <Button variant="dark" onClick={() => onOpen(10, active)} className="flex-1 text-lg">
          Open ×10
        </Button>
        <Button variant="dark" onClick={() => onOpen(100, active)} className="flex-1 text-lg">
          Open ×100
        </Button>
      </div>
      <p className="mt-2 text-center text-xs text-muted">×10 and ×100 use the {active.name}</p>
    </div>
  )
}
