import { Link } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import Panel from '@/components/ui/Panel'
import SpriteBox from '@/components/ui/SpriteBox'
import { monsterSpriteUrl } from '@/lib/sprites'
import { elementStyle } from './elementStyles'

const HEADERS = [
  ['Sprite', ''],
  ['ID', ''],
  ['Name', ''],
  ['Level', ''],
  ['HP', 'text-right'],
  ['Race', ''],
  ['Element', ''],
  ['Size', ''],
]

export default function MonsterTable({ rows }) {
  return (
    <Panel className="overflow-x-auto">
      <table className="min-w-full divide-y divide-line text-sm">
        <thead className="bg-subtle text-left text-xs font-semibold uppercase tracking-wide text-muted">
          <tr>
            {HEADERS.map(([label, align]) => (
              <th key={label} className={`px-4 py-3 ${align}`.trim()}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line-soft bg-panel text-body">
          {rows.length === 0 && (
            <tr>
              <td colSpan={HEADERS.length} className="px-4 py-10 text-center text-muted">
                No monsters match these filters.
              </td>
            </tr>
          )}
          {rows.map((m) => (
            <tr key={m.id} className="hover:bg-subtle">
              <td className="px-4 py-2">
                <SpriteBox
                  src={monsterSpriteUrl(m.id)}
                  alt={m.name}
                  className="h-14 w-14"
                  imgClassName="h-12 w-12 object-contain"
                  loading="lazy"
                />
              </td>
              <td className="px-4 py-2 tabular-nums text-muted">{m.id}</td>
              <td className="px-4 py-2">
                <Link to={`/db/${m.id}`} className="font-medium text-accent hover:underline">
                  {m.name}
                </Link>
                <div className="text-xs text-faint">{m.internal_name}</div>
              </td>
              <td className="px-4 py-2 tabular-nums">{m.level}</td>
              <td className="px-4 py-2 text-right tabular-nums">{m.hp.toLocaleString()}</td>
              <td className="px-4 py-2">{m.race}</td>
              <td className="px-4 py-2">
                <Badge className={elementStyle(m.element)}>
                  {m.element} {m.element_level}
                </Badge>
              </td>
              <td className="px-4 py-2">{m.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  )
}
