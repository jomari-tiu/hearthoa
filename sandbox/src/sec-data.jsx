/* === Data display section: badges, avatars, cards, tables, charts, stats === */

function DataSection() {
  const tableRows = [
    { unit: '101', resident: 'Margaret Chen', balance: 0, status: 'Paid', last: 'May 01' },
    { unit: '203', resident: 'David Park', balance: 425, status: 'Pending', last: 'Apr 28' },
    { unit: '305', resident: 'Lila Okonkwo', balance: 1275, status: 'Overdue', last: 'Mar 12' },
    { unit: '412', resident: 'Yuki Tanaka', balance: 0, status: 'Paid', last: 'May 02' },
    { unit: '518', resident: 'Ahmad Rashid', balance: 425, status: 'Pending', last: 'Apr 30' },
  ];

  return (
    <Section
      id="data"
      title="Data display"
      description="Badges, avatars, cards, tables, charts, stats, and empty states for dense admin views."
    >
      <Variant title="Status badges"
        code={`<Badge tone="success" variant="soft">Paid</Badge>
<Badge tone="warning" variant="soft">Pending</Badge>
<Badge tone="danger" variant="soft">Overdue</Badge>
<Badge tone="info" variant="soft" icon="vote">Vote open</Badge>
<Badge tone="danger" variant="solid">Critical</Badge>`}>
        <VariantStack gap={10} align="flex-start">
          <VariantRow>
            <Badge tone="success" variant="soft">Paid</Badge>
            <Badge tone="warning" variant="soft">Pending</Badge>
            <Badge tone="danger" variant="soft">Overdue</Badge>
            <Badge tone="info" variant="soft" icon="vote">Vote open</Badge>
            <Badge tone="primary" variant="soft" icon="sparkles">AI draft</Badge>
            <Badge tone="neutral" variant="soft">Archived</Badge>
          </VariantRow>
          <VariantRow>
            <Badge tone="success" variant="solid">Paid</Badge>
            <Badge tone="warning" variant="solid">Pending</Badge>
            <Badge tone="danger" variant="solid">Critical</Badge>
            <Badge tone="info" variant="solid">In review</Badge>
            <Badge tone="primary" variant="solid">New</Badge>
          </VariantRow>
          <VariantRow>
            <Badge tone="success" variant="soft" dot>Online</Badge>
            <Badge tone="warning" variant="soft" dot>Away</Badge>
            <Badge tone="neutral" variant="soft" dot>Offline</Badge>
            <Badge tone="info" variant="outline">Beta</Badge>
            <Badge tone="primary" variant="outline">Board</Badge>
          </VariantRow>
        </VariantStack>
      </Variant>

      <Variant title="Avatars & user chips"
        code={`<Avatar name="Margaret Chen" size={32} />
<AvatarStack users={[...]} max={3} />
<UserChip name="Margaret Chen" role="Board Secretary" />`}>
        <VariantStack gap={14} align="flex-start">
          <VariantRow>
            <Avatar name="Margaret Chen" size={24} />
            <Avatar name="David Park" size={32} />
            <Avatar name="Lila Okonkwo" size={40} />
            <Avatar name="Yuki Tanaka" size={48} />
          </VariantRow>
          <AvatarStack
            users={[
              { name: 'Margaret Chen' },
              { name: 'David Park' },
              { name: 'Lila Okonkwo' },
              { name: 'Yuki Tanaka' },
              { name: 'Ahmad Rashid' },
              { name: 'Priya Kapoor' },
            ]}
            max={4}
            size={28}
          />
          <VariantStack gap={8} align="flex-start">
            <UserChip name="Margaret Chen" role="Board Secretary" />
            <UserChip name="David Park" role="Treasurer · Unit 203" />
            <UserChip name="Lila Okonkwo" role="Resident · Unit 305" />
          </VariantStack>
        </VariantStack>
      </Variant>

      <Variant title="Stat tiles"
        code={`<StatTile
  label="Collected this month"
  value="$48,250"
  delta="12.4%"
  trend={1}
  sparkline={[3,7,5,8,6,9,11,10,12,14]}
/>`} span={2}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, width: '100%' }}>
          <StatTile label="Collected" value="$48,250" delta="12.4%" trend={1}
            sparkline={[3, 7, 5, 8, 6, 9, 11, 10, 12, 14]} />
          <StatTile label="Outstanding" value="$8,450" delta="3.1%" trend={-1}
            sparkline={[14, 12, 13, 10, 11, 9, 10, 8, 9, 8]} />
          <StatTile label="Open requests" value="14" delta="2" trend={1}
            sparkline={[6, 8, 7, 9, 10, 11, 13, 12, 14, 14]} />
          <StatTile label="AI queries" value="312" delta="48" trend={1}
            sparkline={[20, 25, 28, 32, 30, 35, 38, 42, 45, 48]} />
        </div>
      </Variant>

      <Variant title="Bar chart"
        code={`<BarChart
  data={[
    { label: 'Jan', value: 38 },
    { label: 'Feb', value: 42 },
    { label: 'Mar', value: 48 },
    { label: 'Apr', value: 41 },
    { label: 'May', value: 52 },
  ]}
/>`}>
        <div style={{ width: '100%' }}>
          <BarChart
            data={[
              { label: 'Jan', value: 38 },
              { label: 'Feb', value: 42 },
              { label: 'Mar', value: 48 },
              { label: 'Apr', value: 41 },
              { label: 'May', value: 52 },
              { label: 'Jun', value: 49 },
              { label: 'Jul', value: 56 },
              { label: 'Aug', value: 61 },
            ]}
          />
        </div>
      </Variant>

      <Variant title="Donut chart"
        code={`<DonutChart value={142} total={168} label="142 / 168" sublabel="active" />`}>
        <VariantRow gap={20}>
          <DonutChart value={142} total={168} label="84%" sublabel="active" />
          <DonutChart value={9} total={12} label="9/12" sublabel="paid" />
          <DonutChart value={3} total={10} label="30%" sublabel="overdue" />
        </VariantRow>
      </Variant>

      <Variant title="Progress"
        code={`<ProgressBar value={68} max={100} tone="primary" showLabel />`}>
        <VariantStack gap={10} align="stretch">
          <div style={{ width: 280 }}>
            <ProgressBar value={68} tone="primary" showLabel />
          </div>
          <div style={{ width: 280 }}>
            <ProgressBar value={94} tone="warning" showLabel />
          </div>
          <div style={{ width: 280 }}>
            <ProgressBar value={32} tone="danger" showLabel size="lg" />
          </div>
        </VariantStack>
      </Variant>

      <Variant title="Card"
        code={`<Card
  header={<strong>Pine Ridge HOA</strong>}
  footer={<><Button variant="ghost" size="sm">Cancel</Button><Button size="sm">Save</Button></>}
>
  <p>Card body content goes here.</p>
</Card>`}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <Card
            header={<><strong style={{ fontSize: 14 }}>Pine Ridge HOA</strong><Badge tone="success" variant="soft">Active</Badge></>}
            footer={
              <>
                <span style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>168 residents</span>
                <Button variant="primary" size="sm">Manage</Button>
              </>
            }
          >
            <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
              All operational settings — dues, documents, and notifications — for this association.
            </div>
          </Card>
        </div>
      </Variant>

      <Variant title="Table — sortable, selectable" span={2}
        code={`<Table
  selectable sortable
  columns={[
    { key: 'unit', label: 'Unit', width: 80 },
    { key: 'resident', label: 'Resident' },
    { key: 'balance', label: 'Balance', align: 'right', render: r => '$' + r.balance },
    { key: 'status', label: 'Status', render: r => <Badge .../> },
    { key: 'last', label: 'Last payment', align: 'right' },
  ]}
  rows={rows}
/>`}>
        <Table
          selectable
          sortable
          columns={[
            { key: 'unit', label: 'Unit', width: 70 },
            { key: 'resident', label: 'Resident', render: r => <UserChip name={r.resident} size={22} /> },
            { key: 'balance', label: 'Balance', align: 'right', render: r => (
              <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: r.balance > 0 ? 600 : 400, color: r.balance > 0 ? 'var(--fg)' : 'var(--fg-subtle)' }}>
                ${r.balance.toLocaleString()}
              </span>
            ) },
            { key: 'status', label: 'Status', render: r => {
              const tone = r.status === 'Paid' ? 'success' : r.status === 'Pending' ? 'warning' : 'danger';
              return <Badge tone={tone} variant="soft">{r.status}</Badge>;
            } },
            { key: 'last', label: 'Last payment', align: 'right' },
          ]}
          rows={tableRows}
        />
      </Variant>

      <Variant title="Empty state"
        code={`<EmptyState
  icon="inbox"
  title="No maintenance requests yet"
  description="Residents can open requests from their dashboard."
  action={<Button variant="primary" iconLeft="plus">New request</Button>}
/>`}>
        <div style={{ width: '100%' }}>
          <EmptyState
            icon="inbox"
            title="No maintenance requests yet"
            description="Residents can open requests directly from their dashboard, or you can create one on their behalf."
            action={<Button variant="primary" iconLeft="plus">New request</Button>}
          />
        </div>
      </Variant>

      <Variant title="Skeleton & tooltip"
        code={`<Skeleton width={120} height={14} />
<Tooltip content="Encrypted at rest">
  <Icon name="shield" />
</Tooltip>`}>
        <VariantStack gap={14} align="flex-start">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Skeleton width={28} height={28} radius={999} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Skeleton width={140} height={11} />
              <Skeleton width={90} height={9} />
            </div>
          </div>
          <Skeleton width={240} height={12} />
          <Skeleton width={180} height={12} />
          <VariantRow>
            <Tooltip content="Encrypted at rest & in transit">
              <Button variant="secondary" size="sm" iconLeft="shield">Encrypted</Button>
            </Tooltip>
            <Tooltip content="Bypasses email opt-out">
              <Badge tone="danger" variant="soft" icon="bell">Critical</Badge>
            </Tooltip>
          </VariantRow>
        </VariantStack>
      </Variant>
    </Section>
  );
}

window.DataSection = DataSection;
