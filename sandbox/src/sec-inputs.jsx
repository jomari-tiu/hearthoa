/* === Inputs section: Buttons + Form controls === */

function InputsSection() {
  const [text, setText] = useState('123 Maple Court');
  const [search, setSearch] = useState('');
  const [cb1, setCb1] = useState(true);
  const [cb2, setCb2] = useState(false);
  const [radio, setRadio] = useState('email');
  const [toggle, setToggle] = useState(true);
  const [seg, setSeg] = useState('week');

  return (
    <Section
      id="inputs"
      title="Buttons & form controls"
      description="All controls work at three sizes and respect the global density and radius tokens."
    >
      <Variant title="Button variants"
        code={`<Button variant="primary">Approve</Button>
<Button variant="secondary">Save draft</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="soft" iconLeft="sparkles">Draft with AI</Button>
<Button variant="outline">Export CSV</Button>
<Button variant="danger" iconLeft="trash">Delete</Button>`}>
        <VariantRow>
          <Button variant="primary">Approve</Button>
          <Button variant="secondary">Save draft</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="soft" iconLeft="sparkles">Draft with AI</Button>
          <Button variant="outline">Export CSV</Button>
          <Button variant="danger" iconLeft="trash">Delete</Button>
        </VariantRow>
      </Variant>

      <Variant title="Sizes & icons"
        code={`<Button size="sm">Send</Button>
<Button size="md" iconLeft="send">Send announcement</Button>
<Button size="lg" iconRight="chevronRight">Continue</Button>
<IconButton icon="more" label="More" />`}>
        <VariantStack gap={10} align="flex-start">
          <VariantRow>
            <Button size="sm" variant="primary">Send</Button>
            <Button size="sm" variant="secondary" iconLeft="download">Export</Button>
            <Button size="sm" variant="ghost">Cancel</Button>
            <IconButton icon="more" size="sm" label="More" variant="secondary" />
          </VariantRow>
          <VariantRow>
            <Button size="md" variant="primary" iconLeft="send">Send announcement</Button>
            <Button size="md" variant="secondary" iconLeft="upload">Import CSV</Button>
            <Button size="md" loading variant="primary">Saving</Button>
          </VariantRow>
          <VariantRow>
            <Button size="lg" variant="primary" iconRight="chevronRight">Continue</Button>
            <Button size="lg" variant="outline">Skip for now</Button>
          </VariantRow>
        </VariantStack>
      </Variant>

      <Variant title="Button group"
        code={`<ButtonGroup>
  <Button variant="secondary" iconLeft="calendar">Day</Button>
  <Button variant="secondary">Week</Button>
  <Button variant="secondary">Month</Button>
</ButtonGroup>`}>
        <ButtonGroup>
          <Button variant="secondary" iconLeft="calendar">Day</Button>
          <Button variant="secondary">Week</Button>
          <Button variant="secondary">Month</Button>
          <Button variant="secondary">Quarter</Button>
        </ButtonGroup>
      </Variant>

      <Variant title="Segmented control"
        code={`<SegmentedControl
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]}
  value={seg}
  onChange={setSeg}
/>`}>
        <SegmentedControl
          options={[
            { value: 'day', label: 'Day', icon: 'clock' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
          value={seg}
          onChange={setSeg}
        />
      </Variant>

      <Variant title="Text input"
        code={`<Field label="Property address" required hint="As it appears on the deed.">
  <Input
    value={text}
    onChange={(e) => setText(e.target.value)}
    placeholder="123 Maple Court"
    leftIcon="home"
  />
</Field>`}>
        <div style={{ width: '100%', maxWidth: 320 }}>
          <Field label="Property address" required hint="As it appears on the deed.">
            <Input value={text} onChange={e => setText(e.target.value)} leftIcon="home" />
          </Field>
        </div>
      </Variant>

      <Variant title="Search with kbd"
        code={`<SearchInput
  placeholder="Search residents, units, documents…"
  kbd="⌘K"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>`}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <SearchInput
            placeholder="Search residents, units, documents…"
            kbd="⌘K"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </Variant>

      <Variant title="Select & Date"
        code={`<Field label="Unit type">
  <Select defaultValue="condo">
    <option value="condo">Condominium</option>
    <option value="townhome">Townhome</option>
    <option value="single">Single-family</option>
  </Select>
</Field>`}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', maxWidth: 360 }}>
          <Field label="Unit type">
            <Select defaultValue="condo">
              <option value="condo">Condominium</option>
              <option value="townhome">Townhome</option>
              <option value="single">Single-family</option>
            </Select>
          </Field>
          <Field label="Move-in date">
            <Input type="date" defaultValue="2024-09-15" leftIcon="calendar" />
          </Field>
        </div>
      </Variant>

      <Variant title="Error & disabled"
        code={`<Field label="Email" error="Already used by another resident.">
  <Input value="margaret@" invalid />
</Field>`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
          <Field label="Email" error="Already used by another resident.">
            <Input defaultValue="margaret@" invalid />
          </Field>
          <Field label="Resident ID" hint="System-assigned. Read-only.">
            <Input defaultValue="PR-RES-00241" disabled />
          </Field>
        </div>
      </Variant>

      <Variant title="Textarea"
        code={`<Field label="Announcement body" hint="Markdown supported.">
  <Textarea rows={4} defaultValue="..." />
</Field>`}>
        <div style={{ width: '100%' }}>
          <Field label="Announcement body" hint="Markdown supported.">
            <Textarea rows={3} defaultValue="The pool will be closed Thursday for resurfacing. Please direct any questions to maintenance@pineridge.org." />
          </Field>
        </div>
      </Variant>

      <Variant title="Checkbox & indeterminate"
        code={`<Checkbox
  label="Send to all residents"
  hint="142 active accounts will receive this email."
  checked={cb1}
  onChange={() => setCb1(!cb1)}
/>`}>
        <VariantStack gap={10} align="flex-start">
          <Checkbox
            checked={cb1}
            onChange={() => setCb1(!cb1)}
            label="Send to all residents"
            hint="142 active accounts will receive this email."
          />
          <Checkbox
            indeterminate
            label="Select board members (3 of 7)"
            hint="Mixed selection across committees."
          />
          <Checkbox checked={cb2} onChange={() => setCb2(!cb2)} label="Also send by SMS" hint="Surcharge applies." />
          <Checkbox disabled label="Send by postal mail" hint="Disabled — feature in beta." />
        </VariantStack>
      </Variant>

      <Variant title="Radio group"
        code={`<Radio name="ch" value="email" checked={radio==='email'}
       onChange={() => setRadio('email')} label="Email" />`}>
        <VariantStack gap={10} align="flex-start">
          <Radio name="contact" value="email" checked={radio === 'email'} onChange={() => setRadio('email')}
            label="Email" hint="Default for general announcements." />
          <Radio name="contact" value="sms" checked={radio === 'sms'} onChange={() => setRadio('sms')}
            label="SMS" hint="Best for time-sensitive updates." />
          <Radio name="contact" value="both" checked={radio === 'both'} onChange={() => setRadio('both')}
            label="Both" hint="Critical-only category." />
        </VariantStack>
      </Variant>

      <Variant title="Toggle"
        code={`<Toggle
  checked={toggle}
  onChange={() => setToggle(!toggle)}
  label="Autopay dues monthly"
  hint="Charged on the 1st via ACH."
/>`}>
        <VariantStack gap={12} align="flex-start">
          <Toggle checked={toggle} onChange={() => setToggle(!toggle)}
            label="Autopay dues monthly" hint="Charged on the 1st via ACH." />
          <Toggle checked={false} onChange={() => {}}
            label="Show me in resident directory" hint="Per-HOA visibility rules apply." />
          <Toggle size="sm" checked={true} onChange={() => {}} label="Compact rows" />
        </VariantStack>
      </Variant>
    </Section>
  );
}

window.InputsSection = InputsSection;
