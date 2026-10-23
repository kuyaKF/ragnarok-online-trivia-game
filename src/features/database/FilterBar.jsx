import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Panel from '@/components/ui/Panel'
import Select from '@/components/ui/Select'

const FIELD_LABEL = 'flex flex-col text-xs font-medium text-muted'

export default function FilterBar({ filters, options, onChange, onReset }) {
  return (
    <Panel className="mb-4 p-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className={`min-w-48 flex-1 ${FIELD_LABEL}`}>
          Search
          <Input
            type="text"
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
            placeholder="Name or internal name"
            className="mt-1"
          />
        </label>

        {[
          ['race', 'Race', options.races],
          ['element', 'Element', options.elements],
          ['size', 'Size', options.sizes],
        ].map(([key, label, values]) => (
          <label key={key} className={FIELD_LABEL}>
            {label}
            <Select
              value={filters[key]}
              onChange={(e) => onChange(key, e.target.value)}
              className="mt-1"
            >
              <option value="">All</option>
              {values.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>
          </label>
        ))}

        <label className={FIELD_LABEL}>
          Level
          <div className="mt-1 flex items-center gap-1">
            <Input
              type="number"
              min="1"
              value={filters.minLevel}
              onChange={(e) => onChange('minLevel', e.target.value)}
              placeholder="Min"
              className="w-20"
            />
            <span className="text-faint">–</span>
            <Input
              type="number"
              min="1"
              value={filters.maxLevel}
              onChange={(e) => onChange('maxLevel', e.target.value)}
              placeholder="Max"
              className="w-20"
            />
          </div>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-soft">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.mvpOnly}
            onChange={(e) => onChange('mvpOnly', e.target.checked)}
          />
          MVPs only
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.hideGuild}
            onChange={(e) => onChange('hideGuild', e.target.checked)}
          />
          Hide guild variants
        </label>
        <Button variant="link" onClick={onReset} className="ml-auto">
          Reset filters
        </Button>
      </div>
    </Panel>
  )
}
