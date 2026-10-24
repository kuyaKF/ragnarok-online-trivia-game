import { useEffect } from 'react'

// Centered dialog over a dimmed page. Closes on Escape or a click outside.
// `width` is a Tailwind max-width class; `hideTitle` keeps the title for screen readers only.
export default function Modal({ title, onClose, width = 'max-w-sm', hideTitle = false, children }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${width} rounded-xl bg-panel p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={hideTitle ? 'sr-only' : 'text-lg font-bold text-ink'}>{title}</h2>
        {children}
      </div>
    </div>
  )
}
