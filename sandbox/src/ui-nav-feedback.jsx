/* === UI: Nav (Tabs, Breadcrumbs, Sidebar nav, TopBar mock) & Feedback === */

function Tabs({ tabs, value, onChange, variant = 'underline' }) {
  return (
    <div className={`ui-tabs ui-tabs--${variant}`} role="tablist">
      {tabs.map(t => (
        <button
          key={t.value}
          role="tab"
          className={'ui-tabs-item' + (value === t.value ? ' is-active' : '')}
          onClick={() => onChange(t.value)}
        >
          {t.icon && <Icon name={t.icon} size={13} />}
          {t.label}
          {t.count != null && <span className="ui-tabs-count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

function Breadcrumbs({ items }) {
  return (
    <nav className="ui-breadcrumb">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Icon name="chevronRight" size={12} className="ui-breadcrumb-sep" />}
          {it.href ? (
            <a href={it.href} className="ui-breadcrumb-link">{it.label}</a>
          ) : (
            <span className="ui-breadcrumb-current">{it.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

function NavSidebar({ groups, active, onSelect, brand }) {
  return (
    <aside className="ui-navside">
      {brand && <div className="ui-navside-brand">{brand}</div>}
      <nav>
        {groups.map((g, gi) => (
          <div className="ui-navside-group" key={gi}>
            {g.label && <div className="ui-navside-grouplabel">{g.label}</div>}
            <ul>
              {g.items.map(it => (
                <li key={it.value}>
                  <button
                    className={'ui-navside-item' + (active === it.value ? ' is-active' : '')}
                    onClick={() => onSelect && onSelect(it.value)}
                  >
                    {it.icon && <Icon name={it.icon} size={14} />}
                    <span className="ui-navside-label">{it.label}</span>
                    {it.badge != null && <span className="ui-navside-badge">{it.badge}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function TopBarMock({ title, breadcrumb, actions, user }) {
  return (
    <div className="ui-topbar">
      <div className="ui-topbar-left">
        {breadcrumb && <Breadcrumbs items={breadcrumb} />}
        {title && <div className="ui-topbar-title">{title}</div>}
      </div>
      <div className="ui-topbar-right">
        {actions}
        {user && (
          <div className="ui-topbar-user">
            <Avatar name={user.name} size={26} />
            <div className="ui-topbar-user-text">
              <span className="ui-topbar-user-name">{user.name}</span>
              <span className="ui-topbar-user-role">{user.role}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* --- Feedback --- */
function Alert({ tone = 'info', title, children, onDismiss, icon }) {
  const iconMap = { info: 'info', success: 'check', warning: 'alert', danger: 'alert' };
  return (
    <div className={`ui-alert ui-alert--${tone}`}>
      <Icon name={icon || iconMap[tone]} size={15} className="ui-alert-icon" />
      <div className="ui-alert-body">
        {title && <div className="ui-alert-title">{title}</div>}
        {children && <div className="ui-alert-content">{children}</div>}
      </div>
      {onDismiss && (
        <button className="ui-alert-close" onClick={onDismiss} aria-label="Dismiss">
          <Icon name="close" size={14} />
        </button>
      )}
    </div>
  );
}

function Banner({ tone = 'primary', icon, title, children, action }) {
  return (
    <div className={`ui-banner ui-banner--${tone}`}>
      {icon && <Icon name={icon} size={16} />}
      <div className="ui-banner-text">
        {title && <strong>{title}</strong>}
        {children && <span>{children}</span>}
      </div>
      {action}
    </div>
  );
}

function Toast({ tone = 'success', title, description, onDismiss }) {
  const iconMap = { success: 'check', info: 'info', warning: 'alert', danger: 'alert' };
  return (
    <div className={`ui-toast ui-toast--${tone}`} role="status">
      <span className={`ui-toast-icon ui-toast-icon--${tone}`}>
        <Icon name={iconMap[tone]} size={13} />
      </span>
      <div className="ui-toast-body">
        <div className="ui-toast-title">{title}</div>
        {description && <div className="ui-toast-desc">{description}</div>}
      </div>
      {onDismiss && (
        <button className="ui-toast-close" onClick={onDismiss} aria-label="Dismiss">
          <Icon name="close" size={12} />
        </button>
      )}
    </div>
  );
}

function Modal({ title, description, children, footer, onClose, width = 480 }) {
  return (
    <div className="ui-modal-shell">
      <div className="ui-modal-overlay" onClick={onClose} />
      <div className="ui-modal" style={{ maxWidth: width }} role="dialog" aria-modal="true">
        <header className="ui-modal-head">
          <div>
            <h3 className="ui-modal-title">{title}</h3>
            {description && <p className="ui-modal-desc">{description}</p>}
          </div>
          <button className="ui-modal-close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={15} />
          </button>
        </header>
        <div className="ui-modal-body">{children}</div>
        {footer && <footer className="ui-modal-foot">{footer}</footer>}
      </div>
    </div>
  );
}

function ConfirmDialog({ title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', tone = 'primary', onCancel, onConfirm }) {
  return (
    <Modal title={title} description={description} onClose={onCancel} width={420}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <div className="ui-confirm-body">
        {tone === 'danger' && (
          <span className="ui-confirm-icon"><Icon name="alert" size={18} /></span>
        )}
        {description}
      </div>
    </Modal>
  );
}

Object.assign(window, {
  Tabs, Breadcrumbs, NavSidebar, TopBarMock,
  Alert, Banner, Toast, Modal, ConfirmDialog,
});
