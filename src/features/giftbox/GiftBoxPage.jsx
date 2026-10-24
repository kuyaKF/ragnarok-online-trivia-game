import { useMemo } from 'react'
import DbGate from '@/components/layout/DbGate'
import CollectionGame from '@/features/collection/CollectionGame'
import ItemIcon from './ItemIcon'
import { BOXES, ODDS, STORAGE_KEY, TYPE_FILTERS, describeItem } from './giftBoxConfig'
import { loadGiftBoxPool } from './giftBoxPool'

export default function GiftBoxPage() {
  return <DbGate>{(db) => <GiftBoxGame db={db} />}</DbGate>
}

function GiftBoxGame({ db }) {
  const pool = useMemo(() => loadGiftBoxPool(db), [db])

  return (
    <CollectionGame
      title="Gift Box Simulator"
      tagline="Open boxes and collect every item monsters can drop."
      storageKey={STORAGE_KEY}
      pool={pool}
      odds={ODDS}
      boxes={BOXES}
      Visual={ItemIcon}
      describeItem={describeItem}
      typeFilters={TYPE_FILTERS}
    />
  )
}
