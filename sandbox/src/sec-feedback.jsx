/* === Feedback section === */

function FeedbackSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const fireToast = (tone) => {
    const id = Math.random();
    const map = {
      success: { title: 'Announcement sent', desc: '142 residents notified · 3 SMS deferred.' },
      info: { title: 'CSV import queued', desc: '241 rows · estimated 2 minutes.' },
      warning: { title: 'Approaching budget cap', desc: '92% of monthly AI spend used.' },
      danger: { title: 'Payment failed', desc: 'Unit 305 — card declined. Resident notified.' },
    };
    setToasts(t => [...t, { id, tone, ...map[tone] }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4500);
  };

  return (
    <Section
      id="feedback"
      title="Feedback"
      description="Alerts, banners, toasts, modals — for confirmations, errors, and inline status."
    >
      <Variant title="Alerts"
        code={`<Alert tone="info" title="Heads up">
  PII review must complete before this document is indexed by HOA Bot.
</Alert>
<Alert tone="success" title="Saved" />
<Alert tone="warning" title="Translation unverified" />
<Alert tone="danger" title="2 imports failed" onDismiss={() => {}} />`}>
        <VariantStack gap={10} align="stretch">
          <Alert tone="info" title="PII review required">
            Documents must complete PII review before they're indexed by HOA Bot. <a href="#" style={{ color: 'inherit', fontWeight: 700 }}>Review queue →</a>
          </Alert>
          <Alert tone="success" title="Bulk import complete">
            241 residents imported. 3 rows skipped due to duplicate emails.
          </Alert>
          <Alert tone="warning" title="Translation unverified">
            Spanish + Vietnamese drafts are machine-translated and awaiting bilingual review.
          </Alert>
          <Alert tone="danger" title="Payment processor offline" onDismiss={() => {}}>
            Stripe webhook hasn't been received in 12 minutes. Dues may be stale.
          </Alert>
        </VariantStack>
      </Variant>

      <Variant title="Banner — critical announcement"
        code={`<Banner tone="danger" icon="alert" title="Boil-water advisory">
  In effect until Friday 6 PM. Bottled water available at the clubhouse.
</Banner>`}>
        <VariantStack gap={10} align="stretch">
          <Banner tone="danger" icon="alert" title="Boil-water advisory:">
            In effect until Friday 6 PM. Bottled water at the clubhouse.
          </Banner>
          <Banner tone="warning" icon="bell" title="Pool closed Thursday">
            Resurfacing 9 AM – 4 PM. Re-opens Friday.
          </Banner>
          <Banner tone="primary" icon="vote" title="Vote open">
            Spring assessment — closes May 21.
            <Button variant="soft" size="sm" style={{ marginLeft: 'auto' }}>Cast vote</Button>
          </Banner>
        </VariantStack>
      </Variant>

      <Variant title="Toast notifications"
        code={`fireToast('success');
fireToast('warning');`}>
        <VariantStack gap={12} align="stretch">
          <VariantRow>
            <Button size="sm" variant="secondary" onClick={() => fireToast('success')}>Success</Button>
            <Button size="sm" variant="secondary" onClick={() => fireToast('info')}>Info</Button>
            <Button size="sm" variant="secondary" onClick={() => fireToast('warning')}>Warning</Button>
            <Button size="sm" variant="secondary" onClick={() => fireToast('danger')}>Danger</Button>
          </VariantRow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            <Toast tone="success" title="Announcement sent" description="142 residents notified." onDismiss={() => {}} />
            <Toast tone="warning" title="Approaching budget cap" description="92% of monthly AI spend used." onDismiss={() => {}} />
          </div>
        </VariantStack>
      </Variant>

      <Variant title="Modal & confirm"
        code={`{modalOpen && (
  <Modal title="Send announcement" description="142 active residents."
    onClose={() => setModalOpen(false)}
    footer={<><Button variant="ghost">Save draft</Button><Button>Send now</Button></>}>
    ...
  </Modal>
)}`}>
        <VariantRow>
          <Button variant="primary" onClick={() => setModalOpen(true)}>Open modal</Button>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>Open confirm</Button>
        </VariantRow>
        {modalOpen && (
          <Modal
            title="Send announcement"
            description="142 active residents will receive this email."
            onClose={() => setModalOpen(false)}
            footer={
              <>
                <Button variant="ghost" onClick={() => setModalOpen(false)}>Save draft</Button>
                <Button variant="primary" onClick={() => setModalOpen(false)} iconLeft="send">Send now</Button>
              </>
            }
          >
            <VariantStack gap={10} align="stretch">
              <Field label="Subject">
                <Input defaultValue="Pool closed Thursday for resurfacing" />
              </Field>
              <Field label="Priority">
                <SegmentedControl
                  options={[
                    { value: 'general', label: 'General' },
                    { value: 'critical', label: 'Critical' },
                  ]}
                  value="general"
                  onChange={() => {}}
                />
              </Field>
              <Alert tone="info" title="Critical announcements bypass opt-outs">
                Reserve for safety, utilities, or emergency-only notices.
              </Alert>
            </VariantStack>
          </Modal>
        )}
        {confirmOpen && (
          <ConfirmDialog
            title="Delete announcement?"
            description="This will permanently remove the draft and any scheduled sends. This cannot be undone."
            tone="danger"
            confirmLabel="Delete announcement"
            onCancel={() => setConfirmOpen(false)}
            onConfirm={() => setConfirmOpen(false)}
          />
        )}
      </Variant>

      <div className="sb-toast-host" style={{ position: 'fixed', bottom: 18, right: 18, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 200 }}>
        {toasts.map(t => (
          <Toast key={t.id} tone={t.tone} title={t.title} description={t.desc} onDismiss={() => setToasts(x => x.filter(y => y.id !== t.id))} />
        ))}
      </div>
    </Section>
  );
}

window.FeedbackSection = FeedbackSection;
