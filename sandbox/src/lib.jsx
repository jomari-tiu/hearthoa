/* === Sandbox helpers + Icon set === */

const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } = React;

/* --- Icons (inline SVG, stroke-based) --- */
const ICON_PATHS = {
  search: 'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-4.35-4.35',
  sun: 'M12 4V2 M12 22v-2 M4.93 4.93 3.5 3.5 M20.5 20.5l-1.43-1.43 M4 12H2 M22 12h-2 M4.93 19.07 3.5 20.5 M20.5 3.5l-1.43 1.43',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z',
  sliders: 'M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M1 14h6 M9 8h6 M17 16h6',
  close: 'M18 6 6 18 M6 6l12 12',
  check: 'M20 6 9 17l-5-5',
  chevronDown: 'M6 9l6 6 6-6',
  chevronRight: 'M9 6l6 6-6 6',
  chevronLeft: 'M15 18l-6-6 6-6',
  alert: 'M12 9v4 M12 17h.01 M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z',
  info: 'M12 16v-4 M12 8h.01 M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z',
  bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  home: 'M3 12 12 3l9 9 M5 10v10h14V10',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6',
  wrench: 'M14.7 6.3a4 4 0 1 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-2.4 2.6-2.6Z',
  dollar: 'M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  megaphone: 'M3 11v2a2 2 0 0 0 2 2h2l4 4V5L7 9H5a2 2 0 0 0-2 2Z M15 8a4 4 0 0 1 0 8 M19 5a8 8 0 0 1 0 14',
  vote: 'm9 12 2 2 4-4 M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 3h6v4H9z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z',
  sparkles: 'M12 3v3 M12 18v3 M5 12H2 M22 12h-3 M5.6 5.6l2.1 2.1 M16.3 16.3l2.1 2.1 M5.6 18.4l2.1-2.1 M16.3 7.7l2.1-2.1',
  copy: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6v4H9z',
  plus: 'M12 5v14 M5 12h14',
  minus: 'M5 12h14',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  send: 'M22 2 11 13 M22 2l-7 20-4-9-9-4 20-7Z',
  inbox: 'M22 12h-6l-2 3h-4l-2-3H2 M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3Z',
  more: 'M12 12h.01 M19 12h.01 M5 12h.01',
  edit: 'M12 20h9 M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z',
  trash: 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M10 11v6 M14 11v6',
  globe: 'M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z',
  calendar: 'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2 M16 2v4 M8 2v4 M3 10h18',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 6v6l4 2',
  archive: 'M21 8v13H3V8 M1 3h22v5H1z M10 12h4',
  lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z M7 11V7a5 5 0 0 1 10 0v4',
  flag: 'M4 22V4 M4 4l16 0-3 5 3 5H4',
  cmdK: '',
};

function Icon({ name, size = 16, stroke = 1.7, style, ...rest }) {
  const d = ICON_PATHS[name];
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, ...style }}
      {...rest}
    >
      {d && d.split(' M').map((p, i) => (
        <path key={i} d={(i === 0 ? p : 'M' + p)} />
      ))}
    </svg>
  );
}

/* --- Section + Variant for sandbox content --- */
function Section({ id, title, description, children }) {
  return (
    <section id={id} className="sb-section">
      <header className="sb-section-head">
        <h1 className="sb-section-title">{title}</h1>
        {description && <p className="sb-section-desc">{description}</p>}
      </header>
      <div className="sb-section-body">{children}</div>
    </section>
  );
}

function Variant({ title, description, code, span = 1, padded = true, surface = 'tinted', children }) {
  const [tab, setTab] = useState('preview');
  return (
    <article className="sb-variant" style={{ gridColumn: `span ${span}` }}>
      <header className="sb-variant-head">
        <div className="sb-variant-meta">
          <h3 className="sb-variant-title">{title}</h3>
          {description && <p className="sb-variant-desc">{description}</p>}
        </div>
        {code && (
          <div className="sb-tabs" role="tablist">
            <button
              className={'sb-tab' + (tab === 'preview' ? ' is-active' : '')}
              onClick={() => setTab('preview')}
              role="tab"
            >Preview</button>
            <button
              className={'sb-tab' + (tab === 'code' ? ' is-active' : '')}
              onClick={() => setTab('code')}
              role="tab"
            >Code</button>
          </div>
        )}
      </header>
      <div className={'sb-variant-body sb-surface-' + surface + (padded ? ' sb-padded' : '')}
           data-show={tab}>
        <div className="sb-preview" hidden={tab !== 'preview'}>{children}</div>
        {tab === 'code' && <CodeBlock code={code} />}
      </div>
    </article>
  );
}

function VariantRow({ children, gap = 12, wrap = true, align = 'center' }) {
  return (
    <div style={{ display: 'flex', gap, flexWrap: wrap ? 'wrap' : 'nowrap', alignItems: align }}>
      {children}
    </div>
  );
}

function VariantStack({ children, gap = 12, align = 'stretch' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, alignItems: align }}>
      {children}
    </div>
  );
}

/* --- Simple JSX syntax highlighter --- */
function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const highlighted = useMemo(() => highlightJSX(code || ''), [code]);
  const copy = () => {
    try { navigator.clipboard.writeText(code); } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="sb-code">
      <button className="sb-code-copy" onClick={copy} title="Copy">
        <Icon name={copied ? 'check' : 'copy'} size={13} />
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
      <pre><code dangerouslySetInnerHTML={{ __html: highlighted }} /></pre>
    </div>
  );
}

function escapeHTML(s) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

function highlightJSX(src) {
  let s = escapeHTML(src);
  // strings
  s = s.replace(/(&quot;|&#39;|`)((?:(?!\1).)*?)\1/g, (_, q, body) => `<span class="tok-str">${q}${body}${q}</span>`);
  // comments
  s = s.replace(/(\/\/[^\n]*)/g, '<span class="tok-com">$1</span>');
  s = s.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-com">$1</span>');
  // tags
  s = s.replace(/(&lt;\/?)([A-Za-z][A-Za-z0-9.]*)/g, '$1<span class="tok-tag">$2</span>');
  // attrs
  s = s.replace(/(\s)([a-zA-Z][a-zA-Z0-9-]*)(=)/g, '$1<span class="tok-attr">$2</span>$3');
  // keywords
  s = s.replace(/\b(const|let|var|function|return|import|from|export|default|if|else|true|false|null|undefined|new|class|async|await|for|while)\b/g,
    '<span class="tok-kw">$1</span>');
  return s;
}

/* expose */
Object.assign(window, {
  Icon, Section, Variant, VariantRow, VariantStack, CodeBlock,
});
