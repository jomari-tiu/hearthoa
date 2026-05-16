/* === UI primitives: Button, Badge, Avatar, Chip === */

function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  loading,
  disabled,
  full,
  children,
  ...rest
}) {
  const classes = [
    'ui-btn',
    'ui-btn--' + variant,
    'ui-btn--' + size,
    full && 'ui-btn--full',
    loading && 'is-loading',
  ].filter(Boolean).join(' ');
  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {loading ? (
        <span className="ui-btn-spin" />
      ) : (
        iconLeft && <Icon name={iconLeft} size={size === 'sm' ? 13 : 15} />
      )}
      {children && <span>{children}</span>}
      {iconRight && !loading && <Icon name={iconRight} size={size === 'sm' ? 13 : 15} />}
    </button>
  );
}

function IconButton({ icon, size = 'md', variant = 'ghost', label, ...rest }) {
  return (
    <button
      className={`ui-btn ui-btn--${variant} ui-btn--${size} ui-iconbtn`}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Icon name={icon} size={size === 'sm' ? 13 : 15} />
    </button>
  );
}

function ButtonGroup({ children }) {
  return <div className="ui-btn-group">{children}</div>;
}

function Badge({ tone = 'neutral', variant = 'soft', size = 'sm', icon, dot, children }) {
  return (
    <span className={`ui-badge ui-badge--${tone} ui-badge--${variant} ui-badge--${size}`}>
      {dot && <span className="ui-badge-dot" />}
      {icon && <Icon name={icon} size={11} />}
      {children}
    </span>
  );
}

function Avatar({ name, src, size = 28, tone }) {
  const initials = (name || '?').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const hue = tone ?? (hashHue(name || ''));
  return (
    <span
      className="ui-avatar"
      style={{
        width: size, height: size,
        fontSize: Math.max(10, size * 0.4),
        background: `oklch(92% 0.05 ${hue})`,
        color: `oklch(35% 0.10 ${hue})`,
      }}
    >
      {src ? <img src={src} alt={name} /> : initials}
    </span>
  );
}

function AvatarStack({ users, max = 4, size = 26 }) {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;
  return (
    <div className="ui-avatar-stack" style={{ '--avatar-size': size + 'px' }}>
      {shown.map((u, i) => (
        <Avatar key={i} name={u.name} src={u.src} size={size} tone={u.tone} />
      ))}
      {extra > 0 && (
        <span className="ui-avatar ui-avatar--more" style={{ width: size, height: size, fontSize: size * 0.36 }}>
          +{extra}
        </span>
      )}
    </div>
  );
}

function UserChip({ name, role, src, size = 24 }) {
  return (
    <span className="ui-userchip">
      <Avatar name={name} src={src} size={size} />
      <span className="ui-userchip-text">
        <span className="ui-userchip-name">{name}</span>
        {role && <span className="ui-userchip-role">{role}</span>}
      </span>
    </span>
  );
}

function hashHue(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

/* Loading spinner */
function Spinner({ size = 16 }) {
  return <span className="ui-spinner" style={{ width: size, height: size }} />;
}

Object.assign(window, {
  Button, IconButton, ButtonGroup, Badge, Avatar, AvatarStack, UserChip, Spinner,
});
