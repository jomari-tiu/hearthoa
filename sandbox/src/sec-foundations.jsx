/* === Foundations section === */

const ColorSwatch = ({ name, varName, value, dark }) => (
  <div className="sb-swatch">
    <div className="sb-swatch-color" style={{ background: `var(${varName})`, color: dark ? 'var(--fg)' : 'white' }}>
      {varName}
    </div>
    <div className="sb-swatch-meta">
      <div className="sb-swatch-name">{name}</div>
      <div className="sb-swatch-value">{value}</div>
    </div>
  </div>
);

function FoundationsSection() {
  return (
    <Section
      id="foundations"
      title="Foundations"
      description="Color, typography, spacing, radius, and shadow tokens — driven by CSS variables so the entire system retones from a single hue."
    >
      <Variant
        title="Brand color"
        description="Primary green derived from --hue. All accents share chroma."
        span={2}
        code={`/* tokens.css */
:root {
  --hue: 150;
  --chroma: 0.09;

  --primary:        oklch(55% var(--chroma) var(--hue));
  --primary-hover:  oklch(48% var(--chroma) var(--hue));
  --primary-soft:   oklch(95% 0.035 var(--hue));
  --primary-soft-fg: oklch(35% 0.08 var(--hue));
}`}
      >
        <div className="sb-swatch-grid">
          <ColorSwatch name="Primary" varName="--primary" value="oklch(55% .09 150)" />
          <ColorSwatch name="Primary hover" varName="--primary-hover" value="oklch(48% .09 150)" />
          <ColorSwatch name="Primary soft" varName="--primary-soft" value="oklch(95% .035 150)" dark />
          <ColorSwatch name="Primary soft fg" varName="--primary-soft-fg" value="oklch(35% .08 150)" />
        </div>
      </Variant>

      <Variant title="Surfaces"
        code={`--bg-app:    oklch(96.5% 0.006 150);
--surface:   oklch(100% 0 0);
--surface-2: oklch(97.5% 0.005 150);
--border:    oklch(91% 0.008 150);`}>
        <div className="sb-swatch-grid">
          <ColorSwatch name="App background" varName="--bg-app" value="oklch(96.5% .006 150)" dark />
          <ColorSwatch name="Surface" varName="--surface" value="oklch(100% 0 0)" dark />
          <ColorSwatch name="Surface 2" varName="--surface-2" value="oklch(97.5% .005 150)" dark />
          <ColorSwatch name="Border" varName="--border" value="oklch(91% .008 150)" dark />
        </div>
      </Variant>

      <Variant title="Semantic tones"
        code={`--success: oklch(58% 0.13 150);
--info:    oklch(58% 0.13 240);
--warning: oklch(70% 0.14 75);
--danger:  oklch(57% 0.17 25);`}>
        <div className="sb-swatch-grid">
          <ColorSwatch name="Success" varName="--success" value="oklch(58% .13 150)" />
          <ColorSwatch name="Info" varName="--info" value="oklch(58% .13 240)" />
          <ColorSwatch name="Warning" varName="--warning" value="oklch(70% .14 75)" dark />
          <ColorSwatch name="Danger" varName="--danger" value="oklch(57% .17 25)" />
        </div>
      </Variant>

      <Variant title="Typography" span={2}
        code={`--font-sans: "Plus Jakarta Sans", system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, monospace;

h1 { font-size: 34px; font-weight: 800; letter-spacing: -0.025em; }
h2 { font-size: 26px; font-weight: 700; letter-spacing: -0.015em; }`}>
        <div style={{ width: '100%' }}>
          {[
            { label: 'Display', size: 34, weight: 800, ls: '-0.025em', sample: 'A welcoming home community' },
            { label: 'Heading', size: 22, weight: 700, ls: '-0.015em', sample: 'Pine Ridge HOA — Quarterly digest' },
            { label: 'Subtitle', size: 16, weight: 600, sample: 'Dues, documents, and decisions — all in one place' },
            { label: 'Body', size: 13, weight: 400, sample: 'The board met on Tuesday to review the annual landscaping contract and approve the spring assessment schedule.' },
            { label: 'Caption', size: 11, weight: 500, sample: 'Posted 3 hours ago by Margaret Chen, Board Secretary' },
            { label: 'Mono', size: 12, weight: 500, font: 'mono', sample: 'PR-2026-0241 · unit_residents.move_in = 2024-09-15' },
          ].map(r => (
            <div className="sb-type-row" key={r.label}>
              <div className="sb-type-label">{r.label}</div>
              <div
                className="sb-type-sample"
                style={{
                  fontSize: r.size + 'px',
                  fontWeight: r.weight,
                  letterSpacing: r.ls,
                  fontFamily: r.font === 'mono' ? 'var(--font-mono)' : undefined,
                  lineHeight: 1.3,
                }}
              >{r.sample}</div>
              <div className="sb-type-meta">{r.size}/{Math.round(r.size * 1.3)}px · {r.weight}</div>
            </div>
          ))}
        </div>
      </Variant>

      <Variant title="Spacing"
        code={`--space-1: 4px;  /* hairline */
--space-2: 8px;  /* compact */
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;`}>
        <div style={{ width: '100%' }}>
          {[1, 2, 3, 4, 5, 6, 8, 10].map(n => {
            const px = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40 }[n];
            return (
              <div className="sb-space-row" key={n}>
                <span className="sb-space-label" style={{ width: 60 }}>--space-{n}</span>
                <span className="sb-space-bar" style={{ width: px }} />
                <span className="sb-space-label">{px}px</span>
              </div>
            );
          })}
        </div>
      </Variant>

      <Variant title="Radius"
        code={`--radius:    8px;          /* tunable via Tweaks */
--radius-sm: calc(var(--radius) * 0.5);
--radius-lg: calc(var(--radius) * 1.5);`}>
        <div className="sb-radius-row">
          {[
            { name: 'sm', r: 'var(--radius-sm)' },
            { name: 'md', r: 'var(--radius-md)' },
            { name: 'lg', r: 'var(--radius-lg)' },
            { name: 'pill', r: '999px' },
          ].map(c => (
            <div className="sb-radius-cell" key={c.name}>
              <div className="sb-radius-box" style={{ borderRadius: c.r }} />
              <span className="sb-radius-label">{c.name}</span>
            </div>
          ))}
        </div>
      </Variant>

      <Variant title="Elevation" span={2}
        code={`--shadow-sm: 0 1px 2px oklch(20% .02 150 / 0.06);
--shadow:    0 1px 3px oklch(20% .02 150 / 0.06),
             0 6px 16px oklch(20% .02 150 / 0.05);
--shadow-lg: 0 4px 16px oklch(20% .02 150 / 0.10),
             0 24px 56px oklch(20% .02 150 / 0.10);`}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, width: '100%' }}>
          {['none', 'var(--shadow-sm)', 'var(--shadow)', 'var(--shadow-lg)'].map((sh, i) => (
            <div key={i} className="sb-shadow-cell" style={{ boxShadow: sh, border: i === 0 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ height: 28 }} />
              <span>{['none', 'sm', 'md', 'lg'][i]}</span>
            </div>
          ))}
        </div>
      </Variant>
    </Section>
  );
}

window.FoundationsSection = FoundationsSection;
