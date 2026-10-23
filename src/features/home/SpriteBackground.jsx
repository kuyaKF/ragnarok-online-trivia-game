import { useEffect, useMemo, useState } from 'react'
import { useDb } from '@/hooks/useDb'
import { query } from '@/lib/db'
import { monsterSpriteUrl } from '@/lib/sprites'

// Tuning knobs
const CELL = 128        // px, size of one chess square
const PERIOD = 10       // must be even; different monsters = PERIOD² / 2 (10 → 50, 12 → 72)
const SPEED = 19        // px per second along each axis, so the drift speed stays the same
const DURATION = (PERIOD * CELL) / SPEED // seconds per loop, calculated for you
const OPACITY = 0.18

const SPRITE_COUNT = (PERIOD * PERIOD) / 2 // one unique sprite per filled cell in the tile

function useViewport() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

export default function SpriteBackground() {
  const { db } = useDb()
  const { w, h } = useViewport()

  // Random monsters, picked once per page load
  const ids = useMemo(() => {
    if (!db) return null
    return query(
      db,
      'SELECT id FROM monsters WHERE is_guild_variant = 0 ORDER BY RANDOM() LIMIT ?',
      [SPRITE_COUNT]
    ).map((r) => r.id)
  }, [db])

  // The repeating tile: a sprite where (row + col) is even, empty otherwise
  const tile = useMemo(() => {
    if (!ids) return null
    let n = 0
    return Array.from({ length: PERIOD }, (_, r) =>
      Array.from({ length: PERIOD }, (_, c) => ((r + c) % 2 === 0 ? ids[n++ % ids.length] : null))
    )
  }, [ids])

  // Cover the viewport plus one tile of margin (the layer slides by one tile)
  const cols = Math.ceil(w / CELL) + PERIOD
  const rows = Math.ceil(h / CELL) + PERIOD

  const cells = useMemo(() => {
    if (!tile) return []
    const out = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = tile[r % PERIOD][c % PERIOD]
        if (id) out.push({ key: `${r}-${c}`, id, r, c })
      }
    }
    return out
  }, [tile, cols, rows])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="sprite-drift absolute left-0 top-0 transition-opacity duration-1000"
        style={{
          width: cols * CELL,
          height: rows * CELL,
          opacity: tile ? OPACITY : 0, // fades in once the database has loaded
          '--shift': `${PERIOD * CELL}px`,
          '--duration': `${DURATION}s`,
        }}
      >
        {cells.map(({ key, id, r, c }) => (
          <div
            key={key}
            className="absolute flex items-center justify-center"
            style={{ left: c * CELL, top: r * CELL, width: CELL, height: CELL }}
          >
            <img
              src={monsterSpriteUrl(id)}
              alt=""
              draggable={false}
              className="max-h-[70%] max-w-[70%] object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}