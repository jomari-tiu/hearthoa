/* === Nav section: tabs, breadcrumbs, sidebar, topbar === */

function NavSection() {
  const [tab, setTab] = useState('all');
  const [pill, setPill] = useState('overview');
  const [navItem, setNavItem] = useState('announcements');

  return (
    <Section
      id="nav"
      title="Navigation"
      description="Sidebar nav, tabs, breadcrumbs, and top bar. All driven by data — no hard-coded items."
    >
      <Variant title="Tabs — underline"
        code={`<Tabs
  value={tab}
  onChange={setTab}
  tabs={[
    { value: 'all', label: 'All', count: 142 },
    { value: 'open', label: 'Open', count: 14, icon: 'inbox' },
    { value: 'mine', label: 'Mine', count: 3 },
    { value: 'archived', label: 'Archived' },
  ]}
/>`}>
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'all', label: 'All', count: 142 },
            { value: 'open', label: 'Open', count: 14, icon: 'inbox' },
            { value: 'mine', label: 'Mine', count: 3 },
            { value: 'archived', label: 'Archived' },
          ]}
        />
      </Variant>

      <Variant title="Tabs — pills"
        code={`<Tabs variant="pills" value={pill} onChange={setPill} tabs={[...]} />`}>
        <Tabs
          variant="pills"
          value={pill}
          onChange={setPill}
          tabs={[
            { value: 'overview', label: 'Overview' },
            { value: 'finance', label: 'Finance' },
            { value: 'people', label: 'People' },
            { value: 'rules', label: 'Rules' },
          ]}
        />
      </Variant>

      <Variant title="Breadcrumbs"
        code={`<Breadcrumbs items={[
  { label: 'Pine Ridge', href: '#' },
  { label: 'Residents', href: '#' },
  { label: 'Margaret Chen' },
]} />`}>
        <Breadcrumbs
          items={[
            { label: 'Pine Ridge', href: '#' },
            { label: 'Residents', href: '#' },
            { label: 'Unit 305', href: '#' },
            { label: 'Margaret Chen' },
          ]}
        />
      </Variant>

      <Variant title="Sidebar nav"
        code={`<NavSidebar
  active={navItem}
  onSelect={setNavItem}
  groups={[
    { label: 'Workspace', items: [
      { value: 'home', label: 'Dashboard', icon: 'home' },
      { value: 'announcements', label: 'Announcements', icon: 'megaphone', badge: 3 },
    ]},
    { label: 'Operations', items: [...] },
  ]}
/>`}>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <NavSidebar
            active={navItem}
            onSelect={setNavItem}
            groups={[
              {
                label: 'Workspace', items: [
                  { value: 'home', label: 'Dashboard', icon: 'home' },
                  { value: 'announcements', label: 'Announcements', icon: 'megaphone', badge: 3 },
                  { value: 'documents', label: 'Documents', icon: 'file' },
                  { value: 'chat', label: 'Ask HOA Bot', icon: 'sparkles' },
                ],
              },
              {
                label: 'Operations', items: [
                  { value: 'dues', label: 'Dues & Payments', icon: 'dollar' },
                  { value: 'maintenance', label: 'Maintenance', icon: 'wrench', badge: 14 },
                  { value: 'polls', label: 'Polls & Votes', icon: 'vote' },
                  { value: 'directory', label: 'Directory', icon: 'users' },
                ],
              },
            ]}
          />
        </div>
      </Variant>

      <Variant title="Top bar" span={2}
        code={`<TopBarMock
  breadcrumb={[{ label: 'Pine Ridge', href: '#' }, { label: 'Announcements' }]}
  actions={<>
    <SearchInput kbd="⌘K" />
    <IconButton icon="bell" />
    <Button variant="primary" iconLeft="plus">New announcement</Button>
  </>}
  user={{ name: 'Margaret Chen', role: 'Board Secretary' }}
/>`}>
        <div style={{ width: '100%' }}>
          <TopBarMock
            breadcrumb={[{ label: 'Pine Ridge', href: '#' }, { label: 'Announcements' }]}
            actions={
              <>
                <div style={{ width: 220 }}><SearchInput size="sm" kbd="⌘K" placeholder="Search" /></div>
                <IconButton icon="bell" variant="ghost" label="Notifications" />
                <Button size="sm" variant="primary" iconLeft="plus">New announcement</Button>
              </>
            }
            user={{ name: 'Margaret Chen', role: 'Board Secretary' }}
          />
        </div>
      </Variant>
    </Section>
  );
}

window.NavSection = NavSection;
