import { useLocation, useParams } from 'react-router-dom'
import BackLink from '@/components/layout/BackLink'
import DbGate from '@/components/layout/DbGate'
import NotFound from '@/components/layout/NotFound'
import PageShell from '@/components/layout/PageShell'
import Badge from '@/components/ui/Badge'
import Panel from '@/components/ui/Panel'
import Section from '@/components/ui/Section'
import SpriteBox from '@/components/ui/SpriteBox'
import Stat from '@/components/ui/Stat'
import { itemSpriteUrl, monsterSpriteUrl } from '@/lib/sprites'
import { getMonster, getMonsterDrops } from './queries'

const ATTRIBUTES = ['str', 'agi', 'vit', 'int', 'dex', 'luk']
const RESISTANCES = ['neutral', 'water', 'earth', 'fire', 'wind', 'poison', 'holy', 'shadow', 'ghost', 'undead']

export default function MonsterDetailPage() {
  const { id } = useParams()
  return <DbGate>{(db) => <MonsterDetail db={db} id={id} />}</DbGate>
}

function ChipList({ items, chipClassName }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className={`bg-chip text-soft ${chipClassName}`}>{item}</li>
      ))}
    </ul>
  )
}

function DropList({ drops }) {
  if (drops.length === 0) return <p className="text-muted">No drops recorded.</p>

  return (
    <ul className="divide-y divide-line-soft rounded-lg border border-line">
      {drops.map((d, i) => (
        <li
          key={`${d.item_id}-${i}`}
          className="flex items-center justify-between px-4 py-2 text-sm"
        >
          <div className="flex items-center gap-3">
            <SpriteBox
              src={itemSpriteUrl(d)}
              alt=""
              rounded="rounded"
              className="h-8 w-8"
              imgClassName="h-6 w-6 object-contain"
            />
            <span className="text-body">{d.item_name}</span>
          </div>
          <span className="tabular-nums text-muted">{d.rate_percent}%</span>
        </li>
      ))}
    </ul>
  )
}

function MonsterDetail({ db, id }) {
  const m = getMonster(db, id)

  // The list page we came from (?page=2&race=...), so Back returns to the same page and filters
  const { state } = useLocation()
  const from = typeof state?.from === 'string' && state.from.startsWith('?') ? state.from : ''
  const backTo = `/db${from}`

  if (!m) {
    return (
      <NotFound
        title="Monster not found"
        message={`There's no monster with ID ${id}.`}
        links={[
          { to: backTo, label: '← Back to the database' },
          { to: '/', label: 'Go to the homepage' },
        ]}
      />
    )
  }

  const drops = getMonsterDrops(db, m.id)
  const modes = m.modes ? m.modes.split('; ') : []
  const maps = m.maps ? m.maps.split('; ') : []

  return (
    <PageShell width="max-w-4xl">
      <BackLink to={backTo}>← Back to database</BackLink>

      <Panel className="mt-4 p-6">
        <div className="flex items-center gap-5">
          <SpriteBox
            src={monsterSpriteUrl(m.id)}
            alt={m.name}
            className="h-32 w-32 shrink-0"
            imgClassName="h-28 w-28 object-contain"
          />
          <div>
            <h1 className="text-3xl font-bold text-ink">{m.name}</h1>
            <p className="text-muted">
              {m.internal_name} · ID #{m.id}
            </p>
            <div className="mt-2 flex gap-2">
              {m.is_mvp === 1 && <Badge tone="mvp">MVP</Badge>}
              {m.is_guild_variant === 1 && <Badge tone="guild">Guild variant</Badge>}
            </div>
          </div>
        </div>

        <Section title="Overview">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Level" value={m.level} />
            <Stat label="HP" value={m.hp.toLocaleString()} />
            <Stat label="Race" value={m.race} />
            <Stat label="Element" value={`${m.element} ${m.element_level}`} />
            <Stat label="Size" value={m.size} />
            <Stat label="Attack" value={m.attack_min != null ? `${m.attack_min}–${m.attack_max}` : null} />
            <Stat label="Def / MDef" value={`${m.defense} / ${m.magic_defense}`} />
            <Stat label="Hit / Flee" value={`${m.hit} / ${m.flee}`} />
            <Stat label="Base Exp" value={m.base_exp?.toLocaleString()} />
            <Stat label="Job Exp" value={m.job_exp?.toLocaleString()} />
            {m.is_mvp === 1 && <Stat label="MVP Exp" value={m.mvp_exp?.toLocaleString()} />}
            <Stat label="Walk speed" value={m.walk_speed} />
          </div>
        </Section>

        <Section title="Attributes">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {ATTRIBUTES.map((s) => (
              <Stat key={s} label={s} value={m[s]} />
            ))}
          </div>
        </Section>

        <Section title="Element resistance (damage taken)">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {RESISTANCES.map((el) => (
              <Stat key={el} label={el} value={`${m[`res_${el}`]}%`} />
            ))}
          </div>
        </Section>

        {modes.length > 0 && (
          <Section title="Mode">
            <ChipList items={modes} chipClassName="rounded-full px-3 py-1 text-sm" />
          </Section>
        )}

        {maps.length > 0 && (
          <Section title="Found on maps">
            <ChipList items={maps} chipClassName="rounded-md px-2 py-1 font-mono text-sm" />
          </Section>
        )}

        <Section title={`Drops (${drops.length})`}>
          <DropList drops={drops} />
        </Section>
      </Panel>
    </PageShell>
  )
}
