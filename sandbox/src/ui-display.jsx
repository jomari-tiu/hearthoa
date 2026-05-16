/* === UI: Cards, Tables, Charts, Stats, Empty states === */

function Card({ children, padded = true, hoverable, footer, header, className = '' }) {
  return (
    <div className={`ui-card${hoverable ? ' is-hoverable' : ''} ${className}`}>
      {header && <div className="ui-card-header">{header}</div>}
      <div className={'ui-card-body' + (padded ? ' is-padded' : '')}>{children}</div>
      {footer && <div className="ui-card-footer">{footer}</div>}
    </div>
  );
}

function StatTile({ label, value, delta, trend, sparkline }) {
  const positive = (trend ?? 0) >= 0;
  return (
    <div className="ui-stat">
      <div className="ui-stat-row">
        <span className="ui-stat-label">{label}</span>
        {delta != null && (
          <span className={'ui-stat-delta ' + (positive ? 'is-pos' : 'is-neg')}>
            {positive ? '▲' : '▼'} {delta}
          </span>
        )}
      </div>
      <div className="ui-stat-value">{value}</div>
      {sparkline && (
        <Sparkline data={sparkline} height={28} />
      )}
    </div>
  );
}

function Sparkline({ data, width = 120, height = 32, color, fill }) {
  const w = width, h = height, pad = 2;
  const min = Math.min(...data), max = Math.max(...data);
  const range = Math.max(1, max - min);
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const c = color || 'var(--primary)';
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {fill && (
        <polygon
          fill={fill}
          opacity="0.18"
          points={`${pad},${h - pad} ${pts.join(' ')} ${w - pad},${h - pad}`}
        />
      )}
      <polyline
        fill="none"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts.join(' ')}
      />
    </svg>
  );
}

function BarChart({ data, height = 140, color, max }) {
  const m = max ?? Math.max(...data.map(d => d.value));
  return (
    <div className="ui-barchart" style={{ height: height + 22 }}>
      <div className="ui-barchart-bars" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="ui-bar-col" title={`${d.label}: ${d.value}`}>
            <div
              className="ui-bar-fill"
              style={{
                height: `${(d.value / m) * 100}%`,
                background: color || 'var(--primary)',
              }}
            />
          </div>
        ))}
      </div>
      <div className="ui-barchart-labels">
        {data.map((d, i) => <span key={i}>{d.label}</span>)}
      </div>
    </div>
  );
}

function DonutChart({ value, total, size = 96, label, sublabel }) {
  const pct = total === 0 ? 0 : value / total;
  const r = 40, c = 2 * Math.PI * r;
  return (
    <div className="ui-donut" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke="var(--primary)" strokeWidth="10"
          strokeDasharray={`${pct * c} ${c}`}
          strokeDashoffset={c * 0.25}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="ui-donut-center">
        <div className="ui-donut-label">{label ?? `${Math.round(pct * 100)}%`}</div>
        {sublabel && <div className="ui-donut-sub">{sublabel}</div>}
      </div>
    </div>
  );
}

/* --- Table --- */
function Table({ columns, rows, selectable, sortable, density = 'compact', onRowClick }) {
  const [sort, setSort] = useState(null);
  const [selected, setSelected] = useState(new Set());

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const { key, dir } = sort;
    return [...rows].sort((a, b) => {
      const av = a[key], bv = b[key];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return dir === 'asc' ? -1 : 1;
      if (av > bv) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, sort]);

  const allSelected = selected.size > 0 && selected.size === rows.length;
  const someSelected = selected.size > 0 && !allSelected;

  return (
    <div className={`ui-table ui-table--${density}`}>
      <table>
        <thead>
          <tr>
            {selectable && (
              <th className="ui-table-check">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={() => setSelected(allSelected ? new Set() : new Set(rows.map((_, i) => i)))}
                />
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                style={{ width: col.width, textAlign: col.align || 'left' }}
                className={sortable && col.sortable !== false ? 'is-sortable' : ''}
                onClick={() => {
                  if (!sortable || col.sortable === false) return;
                  setSort(s => {
                    if (!s || s.key !== col.key) return { key: col.key, dir: 'asc' };
                    if (s.dir === 'asc') return { key: col.key, dir: 'desc' };
                    return null;
                  });
                }}
              >
                <span className="ui-th-content">
                  {col.label}
                  {sortable && col.sortable !== false && (
                    <span className="ui-th-sort">
                      {sort?.key === col.key ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr
              key={i}
              className={selected.has(i) ? 'is-selected' : ''}
              onClick={onRowClick ? () => onRowClick(row, i) : undefined}
              style={{ cursor: onRowClick ? 'pointer' : undefined }}
            >
              {selectable && (
                <td className="ui-table-check" onClick={e => e.stopPropagation()}>
                  <Checkbox
                    checked={selected.has(i)}
                    onChange={() => {
                      const s = new Set(selected);
                      s.has(i) ? s.delete(i) : s.add(i);
                      setSelected(s);
                    }}
                  />
                </td>
              )}
              {columns.map(col => (
                <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                  {col.render ? col.render(row, i) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ icon, title, description, action }) {
  return (
    <div className="ui-empty">
      {icon && <div className="ui-empty-icon"><Icon name={icon} size={22} /></div>}
      <div className="ui-empty-title">{title}</div>
      {description && <div className="ui-empty-desc">{description}</div>}
      {action && <div className="ui-empty-action">{action}</div>}
    </div>
  );
}

function Skeleton({ width = '100%', height = 12, radius = 6 }) {
  return (
    <span className="ui-skeleton" style={{ width, height, borderRadius: radius }} />
  );
}

function Tooltip({ children, content, side = 'top' }) {
  return (
    <span className="ui-tt">
      {children}
      <span className={`ui-tt-pop ui-tt-pop--${side}`}>{content}</span>
    </span>
  );
}

function ProgressBar({ value, max = 100, tone = 'primary', size = 'md', showLabel }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`ui-progress ui-progress--${size}`}>
      <div className="ui-progress-track">
        <div className={`ui-progress-fill ui-progress-fill--${tone}`} style={{ width: pct + '%' }} />
      </div>
      {showLabel && <span className="ui-progress-label">{Math.round(pct)}%</span>}
    </div>
  );
}

Object.assign(window, {
  Card, StatTile, Sparkline, BarChart, DonutChart, Table, EmptyState, Skeleton, Tooltip, ProgressBar,
});
