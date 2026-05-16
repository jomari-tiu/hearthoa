/* === App shell === */

const SANDBOX_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "hue": 150,
  "density": "compact",
  "radius": 8,
  "fontFamily": "Plus Jakarta Sans"
}/*EDITMODE-END*/;

const NAV_GROUPS = [
  {
    label: 'Get started',
    items: [
      { value: 'foundations', label: 'Foundations', icon: 'sparkles' },
    ],
  },
  {
    label: 'Primitives',
    items: [
      { value: 'inputs', label: 'Buttons & forms', icon: 'edit' },
      { value: 'data', label: 'Data display', icon: 'inbox' },
      { value: 'nav', label: 'Navigation', icon: 'chevronRight' },
      { value: 'feedback', label: 'Feedback', icon: 'bell' },
    ],
  },
  {
    label: 'HOA patterns',
    items: [
      { value: 'hoa', label: 'Composite components', icon: 'home' },
    ],
  },
];

function ThemeToggle({ value, onChange }) {
  return (
    <div className="sb-themetoggle">
      <button className={value === 'light' ? 'is-active' : ''} onClick={() => onChange('light')} aria-label="Light theme">
        <Icon name="sun" size={13} />
      </button>
      <button className={value === 'dark' ? 'is-active' : ''} onClick={() => onChange('dark')} aria-label="Dark theme">
        <Icon name="moon" size={13} />
      </button>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(SANDBOX_DEFAULTS);
  const [active, setActive] = useState(() => {
    return (location.hash || '#foundations').replace('#', '');
  });
  const [navQuery, setNavQuery] = useState('');

  useEffect(() => {
    location.hash = '#' + active;
    const main = document.querySelector('.sb-main');
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
  }, [active]);

  // Apply theme + hue + density + radius + font to root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', t.theme);
    root.style.setProperty('--hue', t.hue);
    root.style.setProperty('--radius', t.radius + 'px');
    root.style.setProperty('--density', t.density === 'compact' ? 1 : 1.2);
    root.style.setProperty('--font-sans', `"${t.fontFamily}", system-ui, sans-serif`);
  }, [t.theme, t.hue, t.density, t.radius, t.fontFamily]);

  const sections = useMemo(() => ({
    foundations: <FoundationsSection />,
    inputs: <InputsSection />,
    data: <DataSection />,
    nav: <NavSection />,
    feedback: <FeedbackSection />,
    hoa: <HOASection />,
  }), []);

  const filteredGroups = useMemo(() => {
    if (!navQuery.trim()) return NAV_GROUPS;
    const q = navQuery.toLowerCase();
    return NAV_GROUPS.map(g => ({
      ...g,
      items: g.items.filter(it => it.label.toLowerCase().includes(q)),
    })).filter(g => g.items.length > 0);
  }, [navQuery]);

  return (
    <div className="sb-app">
      <header className="sb-head">
        <div className="sb-brand">
          <div className="sb-brand-mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1Z" fill="currentColor"/>
              <circle cx="12" cy="11" r="2.2" fill="oklch(99% 0.003 150)" />
            </svg>
          </div>
          <div>
            <span className="sb-brand-name">HearthHOA</span>
            <span className="sb-brand-sub">Sandbox · v0.1</span>
          </div>
        </div>
        <div className="sb-head-center">
          <SearchInput
            size="sm"
            placeholder="Search components…"
            kbd="⌘K"
            value={navQuery}
            onChange={e => setNavQuery(e.target.value)}
          />
        </div>
        <div className="sb-head-right">
          <Badge tone="primary" variant="soft" icon="sparkles">AI-ready</Badge>
          <ThemeToggle value={t.theme} onChange={v => setTweak('theme', v)} />
        </div>
      </header>

      <aside className="sb-side">
        {filteredGroups.map((g, gi) => (
          <div className="sb-side-group" key={gi}>
            <div className="sb-side-grouplabel">{g.label}</div>
            {g.items.map(it => (
              <button
                key={it.value}
                className={'sb-side-item' + (active === it.value ? ' is-active' : '')}
                onClick={() => setActive(it.value)}
              >
                <Icon name={it.icon} size={14} />
                <span style={{ flex: 1 }}>{it.label}</span>
              </button>
            ))}
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <div style={{ padding: 12, fontSize: 12, color: 'var(--fg-subtle)' }}>
            No matches for "{navQuery}"
          </div>
        )}
        <div style={{ marginTop: 'auto', padding: 12, fontSize: 10, color: 'var(--fg-subtle)', borderTop: '1px solid var(--border)' }}>
          Toggle Tweaks in the toolbar to customize tokens.
        </div>
      </aside>

      <main className="sb-main">
        <div className="sb-main-inner">
          {sections[active] || <Section title="Not found"><div /></Section>}
        </div>
      </main>

      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakRadio
          label="Mode"
          value={t.theme}
          options={['light', 'dark']}
          onChange={v => setTweak('theme', v)}
        />
        <TweakSlider
          label="Hue"
          value={t.hue}
          min={0} max={360} step={1}
          onChange={v => setTweak('hue', v)}
        />
        <TweakSelect
          label="Quick palettes"
          value={String(t.hue)}
          options={[
            { value: '150', label: 'Sage (default)' },
            { value: '165', label: 'Emerald' },
            { value: '180', label: 'Teal' },
            { value: '200', label: 'Sky' },
            { value: '240', label: 'Indigo' },
            { value: '280', label: 'Plum' },
            { value: '25', label: 'Terracotta' },
            { value: '45', label: 'Amber' },
          ]}
          onChange={v => setTweak('hue', Number(v))}
        />

        <TweakSection label="Density & shape" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={['compact', 'comfortable']}
          onChange={v => setTweak('density', v)}
        />
        <TweakSlider
          label="Radius"
          value={t.radius}
          min={0} max={20} step={1} unit="px"
          onChange={v => setTweak('radius', v)}
        />

        <TweakSection label="Typography" />
        <TweakSelect
          label="Font family"
          value={t.fontFamily}
          options={['Plus Jakarta Sans', 'Manrope', 'Geist', 'Outfit', 'IBM Plex Sans', 'Source Sans 3']}
          onChange={v => setTweak('fontFamily', v)}
        />
      </TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
