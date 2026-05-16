/* === HOA-specific composite components === */

function AnnouncementCard({ priority = 'general', title, body, author, time, audience, translations, optOut }) {
  return (
    <article className={`hoa-announce hoa-announce--${priority}`}>
      <header className="hoa-announce-head">
        <div className="hoa-announce-meta">
          <Badge tone={priority === 'critical' ? 'danger' : 'neutral'} variant="solid" size="sm" icon={priority === 'critical' ? 'alert' : 'megaphone'}>
            {priority === 'critical' ? 'Critical' : 'General'}
          </Badge>
          {audience && <span className="hoa-announce-aud">{audience}</span>}
        </div>
        <span className="hoa-announce-time">{time}</span>
      </header>
      <h4 className="hoa-announce-title">{title}</h4>
      <p className="hoa-announce-body">{body}</p>
      <footer className="hoa-announce-foot">
        <UserChip name={author.name} role={author.role} size={22} />
        <div className="hoa-announce-actions">
          {translations && (
            <span className="hoa-translation-tag">
              <Icon name="globe" size={11} />
              {translations} · machine-translated, unverified
            </span>
          )}
          {priority === 'critical' && (
            <span className="hoa-bypass">
              <Icon name="bell" size={11} />
              bypasses opt-out
            </span>
          )}
          {optOut && priority !== 'critical' && (
            <span className="hoa-opt-out">opt-out respected</span>
          )}
        </div>
      </footer>
    </article>
  );
}

function DuesCard({ unit, owner, amount, due, period, status = 'pending', autopay, paidPct }) {
  const statusTone = {
    paid: 'success', pending: 'warning', overdue: 'danger', upcoming: 'neutral',
  }[status];
  return (
    <div className="hoa-dues">
      <div className="hoa-dues-head">
        <div>
          <div className="hoa-dues-unit">Unit {unit}</div>
          <div className="hoa-dues-owner">{owner}</div>
        </div>
        <Badge tone={statusTone} variant="soft" size="sm">{status}</Badge>
      </div>
      <div className="hoa-dues-amount">
        <span className="hoa-dues-currency">$</span>
        <span className="hoa-dues-value">{amount.toLocaleString()}</span>
        <span className="hoa-dues-period">/ {period}</span>
      </div>
      <div className="hoa-dues-meta">
        <span><Icon name="calendar" size={11} /> Due {due}</span>
        {autopay && <span><Icon name="check" size={11} /> Autopay on</span>}
      </div>
      {paidPct != null && (
        <div className="hoa-dues-progress">
          <ProgressBar value={paidPct} max={100} tone={status === 'overdue' ? 'danger' : 'primary'} size="sm" />
          <span className="hoa-dues-progress-label">{paidPct}% of annual collected</span>
        </div>
      )}
    </div>
  );
}

function DocumentItem({ name, type, size, updated, piiStatus = 'cleared', tags, encrypted = true }) {
  const piiMap = {
    cleared: { tone: 'success', label: 'PII cleared' },
    pending: { tone: 'warning', label: 'PII review pending' },
    blocked: { tone: 'danger', label: 'PII review required' },
  };
  const pii = piiMap[piiStatus];
  return (
    <div className="hoa-doc">
      <div className={`hoa-doc-icon hoa-doc-icon--${type}`}>
        <Icon name="file" size={16} />
        <span className="hoa-doc-ext">{type}</span>
      </div>
      <div className="hoa-doc-meta">
        <div className="hoa-doc-name">
          {name}
          {encrypted && <Icon name="lock" size={11} className="hoa-doc-lock" />}
        </div>
        <div className="hoa-doc-sub">
          <span>{size}</span>
          <span>·</span>
          <span>Updated {updated}</span>
        </div>
        {tags && (
          <div className="hoa-doc-tags">
            {tags.map(t => <Badge key={t} tone="neutral" variant="outline" size="sm">{t}</Badge>)}
          </div>
        )}
      </div>
      <div className="hoa-doc-actions">
        <Badge tone={pii.tone} variant="soft" size="sm" icon={piiStatus === 'cleared' ? 'shield' : 'alert'}>
          {pii.label}
        </Badge>
        <IconButton icon="download" label="Download" size="sm" />
        <IconButton icon="more" label="More" size="sm" />
      </div>
    </div>
  );
}

function MaintenanceRequest({ id, title, unit, reporter, status, priority, opened, assignee, photos = 0 }) {
  const statusTone = {
    open: 'info', 'in-progress': 'warning', resolved: 'success', closed: 'neutral',
  }[status];
  const priorityTone = {
    low: 'neutral', normal: 'info', high: 'warning', urgent: 'danger',
  }[priority];
  return (
    <div className="hoa-maint">
      <div className="hoa-maint-id">#{id}</div>
      <div className="hoa-maint-body">
        <div className="hoa-maint-head">
          <h4 className="hoa-maint-title">{title}</h4>
          <Badge tone={priorityTone} variant="soft" size="sm">{priority}</Badge>
        </div>
        <div className="hoa-maint-meta">
          <span><Icon name="home" size={11} /> Unit {unit}</span>
          <span>·</span>
          <span>Reported by {reporter}</span>
          <span>·</span>
          <span><Icon name="clock" size={11} /> {opened}</span>
          {photos > 0 && (<><span>·</span><span>{photos} photos</span></>)}
        </div>
      </div>
      <div className="hoa-maint-side">
        <Badge tone={statusTone} variant="solid" size="sm" dot>{status.replace('-', ' ')}</Badge>
        {assignee ? (
          <UserChip name={assignee} size={20} />
        ) : (
          <span className="hoa-maint-unassigned">Unassigned</span>
        )}
      </div>
    </div>
  );
}

function BoardMemberCard({ name, title, term, email, phone, joined }) {
  return (
    <div className="hoa-board">
      <Avatar name={name} size={48} />
      <div className="hoa-board-body">
        <div className="hoa-board-name">{name}</div>
        <div className="hoa-board-title">{title}</div>
        <div className="hoa-board-meta">
          <span>Term: {term}</span>
          <span>·</span>
          <span>Since {joined}</span>
        </div>
        <div className="hoa-board-contact">
          <a href={`mailto:${email}`}>{email}</a>
          {phone && <span className="hoa-board-phone">{phone}</span>}
        </div>
      </div>
    </div>
  );
}

function PollCard({ title, description, deadline, options, totalVotes, hasVoted, selected }) {
  return (
    <div className="hoa-poll">
      <div className="hoa-poll-head">
        <div>
          <h4 className="hoa-poll-title">{title}</h4>
          {description && <p className="hoa-poll-desc">{description}</p>}
        </div>
        <Badge tone="info" variant="soft" size="sm" icon="vote">Open</Badge>
      </div>
      <div className="hoa-poll-options">
        {options.map((o, i) => {
          const pct = totalVotes ? (o.votes / totalVotes) * 100 : 0;
          const isSelected = selected === i;
          return (
            <div key={i} className={'hoa-poll-opt' + (isSelected ? ' is-selected' : '')}>
              <div className="hoa-poll-opt-row">
                <span className="hoa-poll-opt-label">
                  {hasVoted ? (
                    isSelected && <span className="hoa-poll-check"><Icon name="check" size={11} /></span>
                  ) : (
                    <span className="hoa-poll-radio" />
                  )}
                  {o.label}
                </span>
                <span className="hoa-poll-opt-count">
                  {hasVoted && <span className="hoa-poll-pct">{pct.toFixed(0)}%</span>}
                  <span className="hoa-poll-votes">{o.votes} votes</span>
                </span>
              </div>
              {hasVoted && (
                <div className="hoa-poll-bar">
                  <div className="hoa-poll-bar-fill" style={{ width: pct + '%' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="hoa-poll-foot">
        <span><Icon name="clock" size={11} /> Closes {deadline}</span>
        <span>·</span>
        <span>{totalVotes} of 142 voted</span>
      </div>
    </div>
  );
}

function ViolationNotice({ id, code, unit, owner, issued, due, severity = 'warning', description, status }) {
  return (
    <div className={`hoa-violation hoa-violation--${severity}`}>
      <div className="hoa-violation-strip" />
      <div className="hoa-violation-body">
        <div className="hoa-violation-head">
          <div>
            <div className="hoa-violation-code">{code} · #{id}</div>
            <h4 className="hoa-violation-title">{description}</h4>
          </div>
          <Badge tone={severity === 'critical' ? 'danger' : 'warning'} variant="solid" size="sm">
            {severity}
          </Badge>
        </div>
        <div className="hoa-violation-meta">
          <div>
            <span className="hoa-violation-k">Unit</span>
            <span className="hoa-violation-v">{unit}</span>
          </div>
          <div>
            <span className="hoa-violation-k">Owner</span>
            <span className="hoa-violation-v">{owner}</span>
          </div>
          <div>
            <span className="hoa-violation-k">Issued</span>
            <span className="hoa-violation-v">{issued}</span>
          </div>
          <div>
            <span className="hoa-violation-k">Cure by</span>
            <span className="hoa-violation-v">{due}</span>
          </div>
          <div>
            <span className="hoa-violation-k">Status</span>
            <Badge tone={status === 'open' ? 'danger' : 'success'} variant="soft" size="sm">{status}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkOrderRow({ id, summary, vendor, scheduled, cost, status }) {
  const tone = { scheduled: 'info', 'in-progress': 'warning', complete: 'success' }[status];
  return (
    <div className="hoa-wo">
      <div className="hoa-wo-id">WO-{id}</div>
      <div className="hoa-wo-summary">
        <div className="hoa-wo-title">{summary}</div>
        <div className="hoa-wo-meta">
          <span><Icon name="wrench" size={11} /> {vendor}</span>
          <span>·</span>
          <span><Icon name="calendar" size={11} /> {scheduled}</span>
        </div>
      </div>
      <div className="hoa-wo-cost">${cost.toLocaleString()}</div>
      <Badge tone={tone} variant="soft" size="sm" dot>{status.replace('-', ' ')}</Badge>
    </div>
  );
}

function AIChatMessage({ from = 'bot', text, citations, time, flagged, unverified }) {
  return (
    <div className={`hoa-chat hoa-chat--${from}`}>
      {from === 'bot' && (
        <span className="hoa-chat-avatar">
          <Icon name="sparkles" size={12} />
        </span>
      )}
      <div className="hoa-chat-bubble">
        <div className="hoa-chat-text">{text}</div>
        {citations && (
          <div className="hoa-chat-cites">
            {citations.map((c, i) => (
              <a key={i} className="hoa-chat-cite" href="#">
                <Icon name="file" size={10} /> {c}
              </a>
            ))}
          </div>
        )}
        <div className="hoa-chat-foot">
          <span>{time}</span>
          {unverified && (
            <span className="hoa-chat-flag">
              <Icon name="globe" size={10} /> machine-translated, unverified
            </span>
          )}
          {flagged && (
            <span className="hoa-chat-flag hoa-chat-flag--warn">
              <Icon name="alert" size={10} /> flagged for review
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function BudgetGauge({ spent, cap, label = 'AI monthly spend' }) {
  const pct = Math.min(100, (spent / cap) * 100);
  const tone = pct > 90 ? 'danger' : pct > 70 ? 'warning' : 'primary';
  return (
    <div className="hoa-budget">
      <div className="hoa-budget-head">
        <span className="hoa-budget-label">{label}</span>
        <span className="hoa-budget-amt">
          ${(spent / 100).toFixed(2)} <span className="hoa-budget-cap">/ ${(cap / 100).toFixed(0)} cap</span>
        </span>
      </div>
      <ProgressBar value={pct} max={100} tone={tone} size="md" />
      <div className="hoa-budget-meta">
        {pct > 90 ? 'Approaching monthly cap' : pct > 70 ? 'On track — watch closely' : 'Well within budget'}
      </div>
    </div>
  );
}

function BulkImportDrop({ accept = '.csv', label = 'Drop CSV here', hint, max }) {
  const [drag, setDrag] = useState(false);
  return (
    <label
      className={'hoa-drop' + (drag ? ' is-drag' : '')}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); }}
    >
      <Icon name="upload" size={20} />
      <div className="hoa-drop-label">{label}</div>
      <div className="hoa-drop-hint">{hint || 'or click to browse'}</div>
      {max && <div className="hoa-drop-max">Up to {max}</div>}
      <input type="file" accept={accept} style={{ display: 'none' }} />
    </label>
  );
}

function NotificationPrefRow({ label, channelDesc, email = true, sms = false, push = true, critical }) {
  return (
    <div className="hoa-pref-row">
      <div className="hoa-pref-meta">
        <div className="hoa-pref-label">
          {label}
          {critical && <Badge tone="danger" variant="soft" size="sm">Critical — always sent</Badge>}
        </div>
        {channelDesc && <div className="hoa-pref-desc">{channelDesc}</div>}
      </div>
      <div className="hoa-pref-channels">
        <Toggle checked={email} disabled={critical} size="sm" label="Email" />
        <Toggle checked={sms} disabled={critical} size="sm" label="SMS" />
        <Toggle checked={push} disabled={critical} size="sm" label="Push" />
      </div>
    </div>
  );
}

Object.assign(window, {
  AnnouncementCard, DuesCard, DocumentItem, MaintenanceRequest, BoardMemberCard,
  PollCard, ViolationNotice, WorkOrderRow, AIChatMessage, BudgetGauge, BulkImportDrop,
  NotificationPrefRow,
});
