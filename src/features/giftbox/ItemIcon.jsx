import { itemSpriteUrl } from '@/lib/sprites'

const SIZES = {
  slot: 'h-8 w-8',
  detail: 'h-10 w-10',
  large: 'h-16 w-16',
}

// Item icons are tiny (about 24px), so they are scaled up with crisp pixels
export default function ItemIcon({ item, size }) {
  return (
    <img
      src={itemSpriteUrl({ item_id: item.id, item_name: item.name })}
      alt=""
      loading="lazy"
      className={`${SIZES[size]} object-contain [image-rendering:pixelated]`}
    />
  )
}
