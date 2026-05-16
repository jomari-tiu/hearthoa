/* === UI: Form inputs === */

function Field({ label, hint, error, required, children, htmlFor }) {
  return (
    <div className="ui-field">
      {label && (
        <label className="ui-field-label" htmlFor={htmlFor}>
          {label}
          {required && <span className="ui-field-req">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <span className="ui-field-error">
          <Icon name="alert" size={11} /> {error}
        </span>
      ) : hint && (
        <span className="ui-field-hint">{hint}</span>
      )}
    </div>
  );
}

function Input({ leftIcon, rightIcon, size = 'md', invalid, ...rest }) {
  return (
    <div className={`ui-input ui-input--${size}` + (invalid ? ' is-invalid' : '') + (rest.disabled ? ' is-disabled' : '')}>
      {leftIcon && <Icon name={leftIcon} size={14} className="ui-input-icon" />}
      <input {...rest} />
      {rightIcon && <Icon name={rightIcon} size={14} className="ui-input-icon" />}
    </div>
  );
}

function Textarea({ rows = 3, invalid, ...rest }) {
  return (
    <textarea
      className={'ui-textarea' + (invalid ? ' is-invalid' : '')}
      rows={rows}
      {...rest}
    />
  );
}

function Select({ size = 'md', invalid, children, ...rest }) {
  return (
    <div className={`ui-select ui-input ui-input--${size}` + (invalid ? ' is-invalid' : '')}>
      <select {...rest}>{children}</select>
      <Icon name="chevronDown" size={13} className="ui-select-caret" />
    </div>
  );
}

function Checkbox({ checked, indeterminate, label, hint, disabled, onChange }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate; }, [indeterminate]);
  return (
    <label className={'ui-checkbox' + (disabled ? ' is-disabled' : '')}>
      <input
        ref={ref}
        type="checkbox"
        checked={!!checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="ui-checkbox-box">
        <Icon name={indeterminate ? 'minus' : 'check'} size={11} />
      </span>
      {(label || hint) && (
        <span className="ui-checkbox-text">
          {label && <span className="ui-checkbox-label">{label}</span>}
          {hint && <span className="ui-checkbox-hint">{hint}</span>}
        </span>
      )}
    </label>
  );
}

function Radio({ checked, label, hint, disabled, onChange, name, value }) {
  return (
    <label className={'ui-radio' + (disabled ? ' is-disabled' : '')}>
      <input
        type="radio"
        checked={!!checked}
        onChange={onChange}
        disabled={disabled}
        name={name}
        value={value}
      />
      <span className="ui-radio-box" />
      {(label || hint) && (
        <span className="ui-radio-text">
          {label && <span className="ui-radio-label">{label}</span>}
          {hint && <span className="ui-radio-hint">{hint}</span>}
        </span>
      )}
    </label>
  );
}

function Toggle({ checked, onChange, label, hint, disabled, size = 'md' }) {
  return (
    <label className={`ui-toggle ui-toggle--${size}` + (disabled ? ' is-disabled' : '')}>
      <input type="checkbox" checked={!!checked} onChange={onChange} disabled={disabled} />
      <span className="ui-toggle-track">
        <span className="ui-toggle-thumb" />
      </span>
      {(label || hint) && (
        <span className="ui-toggle-text">
          {label && <span className="ui-toggle-label">{label}</span>}
          {hint && <span className="ui-toggle-hint">{hint}</span>}
        </span>
      )}
    </label>
  );
}

function SegmentedControl({ options, value, onChange, size = 'md' }) {
  return (
    <div className={`ui-segmented ui-segmented--${size}`}>
      {options.map(opt => (
        <button
          key={opt.value}
          className={'ui-seg' + (value === opt.value ? ' is-active' : '')}
          onClick={() => onChange(opt.value)}
        >
          {opt.icon && <Icon name={opt.icon} size={13} />}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SearchInput({ placeholder = 'Search…', value, onChange, kbd, size = 'md' }) {
  return (
    <div className={`ui-input ui-input--${size} ui-input--search`}>
      <Icon name="search" size={13} className="ui-input-icon" />
      <input value={value} onChange={onChange} placeholder={placeholder} />
      {kbd && <span className="ui-kbd">{kbd}</span>}
    </div>
  );
}

Object.assign(window, {
  Field, Input, Textarea, Select, Checkbox, Radio, Toggle, SegmentedControl, SearchInput,
});
