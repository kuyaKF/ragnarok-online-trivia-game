import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'

// Asks how many of an item to throw away (the whole stack by default)
export default function TrashDialog({ entry, onConfirm, onClose }) {
  const max = entry.count
  const [qty, setQty] = useState(String(max))
  const amount = Math.min(max, Math.max(1, Math.floor(Number(qty)) || 1))

  function handleSubmit(e) {
    e.preventDefault()
    onConfirm(amount)
  }

  return (
    <Modal title={`Trash ${entry.item.name}?`} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <p className="mt-2 text-sm text-muted">You have ×{max}. This can't be undone.</p>
        <label className="mt-4 flex flex-col text-xs font-medium text-muted">
          Quantity
          <Input
            type="number"
            min="1"
            max={max}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            autoFocus
            className="mt-1"
          />
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="danger">
            Trash {amount}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
