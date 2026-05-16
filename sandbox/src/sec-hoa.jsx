/* === HOA-specific section === */

function HOASection() {
  return (
    <Section
      id="hoa"
      title="HOA-specific patterns"
      description="Composite components built from the primitives, modeling the domain — announcements, dues, documents, AI features, governance."
    >
      <Variant title="Announcement — critical"
        code={`<AnnouncementCard
  priority="critical"
  title="Boil-water advisory in effect"
  body="..."
  author={{ name: 'Margaret Chen', role: 'Board Secretary' }}
  time="2 hours ago"
  audience="All residents"
/>`}>
        <AnnouncementCard
          priority="critical"
          title="Boil-water advisory in effect until Friday 6 PM"
          body="The city issued an emergency advisory this morning. Bottled water is available at the clubhouse. Critical announcements like this bypass email opt-outs by design."
          author={{ name: 'Margaret Chen', role: 'Board Secretary' }}
          time="2 hours ago"
          audience="All residents"
        />
      </Variant>

      <Variant title="Announcement — general + translation"
        code={`<AnnouncementCard
  priority="general"
  title="..."
  translations="Spanish · Vietnamese"
  optOut
/>`}>
        <AnnouncementCard
          priority="general"
          title="Spring landscaping starts Monday"
          body="Crews will be on-site 7 AM – 3 PM through Thursday. Please move vehicles from the curb on your block's scheduled day."
          author={{ name: 'David Park', role: 'Treasurer' }}
          time="Yesterday"
          audience="142 residents · email"
          translations="ES · VI"
          optOut
        />
      </Variant>

      <Variant title="Dues card"
        code={`<DuesCard unit="305" owner="Lila Okonkwo"
  amount={1275} due="May 31" period="month"
  status="overdue" paidPct={68} />`}>
        <div style={{ width: '100%', maxWidth: 320 }}>
          <DuesCard
            unit="305"
            owner="Lila Okonkwo"
            amount={1275}
            due="May 31"
            period="month"
            status="overdue"
            paidPct={68}
          />
        </div>
      </Variant>

      <Variant title="Dues card — autopay"
        code={`<DuesCard unit="101" owner="Margaret Chen"
  amount={425} due="Jun 01" period="month"
  status="paid" autopay paidPct={100} />`}>
        <div style={{ width: '100%', maxWidth: 320 }}>
          <DuesCard
            unit="101"
            owner="Margaret Chen"
            amount={425}
            due="Jun 01"
            period="month"
            status="paid"
            autopay
            paidPct={100}
          />
        </div>
      </Variant>

      <Variant title="Document library" span={2}
        code={`<DocumentItem
  name="CC&Rs — 2023 Amendment.pdf"
  type="pdf" size="1.4 MB" updated="2 days ago"
  piiStatus="cleared"
  tags={['Governance', 'Indexed by HOA Bot']}
/>`}>
        <VariantStack gap={8} align="stretch">
          <DocumentItem
            name="CC&Rs — 2023 Amendment.pdf"
            type="pdf"
            size="1.4 MB"
            updated="2 days ago"
            piiStatus="cleared"
            tags={['Governance', 'Indexed by HOA Bot']}
          />
          <DocumentItem
            name="Annual Budget — FY2026 Draft.xlsx"
            type="xlsx"
            size="240 KB"
            updated="5 hours ago"
            piiStatus="pending"
            tags={['Finance', 'Board-only']}
          />
          <DocumentItem
            name="Resident Roster — Full.docx"
            type="docx"
            size="86 KB"
            updated="1 week ago"
            piiStatus="blocked"
            tags={['Confidential', 'Quarantined']}
          />
        </VariantStack>
      </Variant>

      <Variant title="Maintenance requests" span={2}
        code={`<MaintenanceRequest id="241" title="..." unit="305"
  reporter="Lila Okonkwo" status="in-progress"
  priority="high" opened="2d ago" assignee="Tomas (Vendor)" />`}>
        <VariantStack gap={8} align="stretch">
          <MaintenanceRequest
            id="0241"
            title="Sprinkler head broken near building C entrance"
            unit="305"
            reporter="Lila Okonkwo"
            status="in-progress"
            priority="urgent"
            opened="2d ago"
            assignee="Tomas L."
            photos={3}
          />
          <MaintenanceRequest
            id="0240"
            title="Hallway light fixture flickering — 4th floor west"
            unit="412"
            reporter="Yuki Tanaka"
            status="open"
            priority="normal"
            opened="5h ago"
            photos={1}
          />
          <MaintenanceRequest
            id="0238"
            title="Garage door sensor not detecting cars"
            unit="—"
            reporter="Front desk"
            status="resolved"
            priority="high"
            opened="1w ago"
            assignee="Tomas L."
          />
        </VariantStack>
      </Variant>

      <Variant title="Board directory"
        code={`<BoardMemberCard name="..." title="President"
  term="2024–2026" email="..." phone="..."
  joined="Jan 2024" />`}>
        <BoardMemberCard
          name="Priya Kapoor"
          title="Board President"
          term="2024–2026"
          email="president@pineridge.org"
          phone="(415) 555-0148"
          joined="Jan 2024"
        />
      </Variant>

      <Variant title="Board directory — secretary"
        code={`<BoardMemberCard name="Margaret Chen"
  title="Board Secretary" ... />`}>
        <BoardMemberCard
          name="Margaret Chen"
          title="Board Secretary"
          term="2025–2027"
          email="secretary@pineridge.org"
          phone="(415) 555-0193"
          joined="Mar 2025"
        />
      </Variant>

      <Variant title="Vote / poll"
        code={`<PollCard
  title="Spring assessment — $250 per unit"
  options={[
    { label: 'Yes — fund pool resurfacing', votes: 64 },
    { label: 'No — defer to next year', votes: 28 },
    { label: 'Abstain', votes: 9 },
  ]}
  totalVotes={101}
  hasVoted selected={0}
  deadline="May 21"
/>`} span={2}>
        <PollCard
          title="Spring assessment — $250 per unit for pool resurfacing"
          description="One-time charge billed with the June statement. Simple majority required for approval."
          options={[
            { label: 'Yes — fund pool resurfacing now', votes: 64 },
            { label: 'No — defer to next fiscal year', votes: 28 },
            { label: 'Abstain', votes: 9 },
          ]}
          totalVotes={101}
          hasVoted
          selected={0}
          deadline="May 21, 6 PM"
        />
      </Variant>

      <Variant title="Violation notice"
        code={`<ViolationNotice code="CCR § 4.2.1" id="V-241"
  unit="412" owner="Yuki Tanaka"
  description="..." severity="warning"
  issued="May 8" due="May 22" status="open" />`} span={2}>
        <ViolationNotice
          id="V-241"
          code="CCR § 4.2.1 — Architectural"
          unit="412"
          owner="Yuki Tanaka"
          description="Unapproved satellite dish installation visible from common area"
          severity="warning"
          issued="May 08, 2026"
          due="May 22, 2026"
          status="open"
        />
      </Variant>

      <Variant title="Work orders" span={2}
        code={`<WorkOrderRow id="2041"
  summary="Pool resurfacing — quote approved"
  vendor="Aquatic Pro Services"
  scheduled="May 18 – 20"
  cost={8500}
  status="scheduled"
/>`}>
        <VariantStack gap={8} align="stretch">
          <WorkOrderRow
            id="2041"
            summary="Pool resurfacing — quote approved"
            vendor="Aquatic Pro Services"
            scheduled="May 18 – 20"
            cost={8500}
            status="scheduled"
          />
          <WorkOrderRow
            id="2038"
            summary="Hallway repaint — building C"
            vendor="Bay Area Painters Co."
            scheduled="In progress"
            cost={3200}
            status="in-progress"
          />
          <WorkOrderRow
            id="2034"
            summary="Roof inspection — annual"
            vendor="Sentry Roofing"
            scheduled="Completed Apr 28"
            cost={650}
            status="complete"
          />
        </VariantStack>
      </Variant>

      <Variant title="AI chat — HOA Bot" span={2}
        code={`<AIChatMessage from="user" text="..." time="2:14 PM" />
<AIChatMessage from="bot"
  text="..." 
  citations={['CC&Rs §4.2.1', 'Pool Rules 2024']}
  time="2:14 PM"
/>`}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 0' }}>
          <AIChatMessage from="user" text="Are short-term rentals allowed in my unit?" time="2:14 PM" />
          <AIChatMessage
            from="bot"
            text="Short-term rentals (under 30 days) are not permitted per the 2023 CC&R amendment. Longer rentals are allowed with 30 days' notice to the board and a signed addendum from the tenant. Always verify with the board before renting."
            citations={['CC&Rs §4.2.1', 'Rental Addendum v3', 'Board Minutes 2023-11']}
            time="2:14 PM"
          />
          <AIChatMessage
            from="bot"
            text="¿Se permiten los alquileres a corto plazo en mi unidad? No, los alquileres menores a 30 días no están permitidos."
            citations={['CC&Rs §4.2.1 (ES)']}
            time="2:15 PM"
            unverified
          />
        </div>
      </Variant>

      <Variant title="AI budget gauge"
        code={`<BudgetGauge spent={3840} cap={5000} />`}>
        <div style={{ width: '100%', maxWidth: 320 }}>
          <BudgetGauge spent={3840} cap={5000} />
        </div>
      </Variant>

      <Variant title="Bulk import drop"
        code={`<BulkImportDrop accept=".csv"
  label="Drop CSV of legacy dues here"
  hint="UTF-8 · header row required · up to 5,000 rows"
/>`}>
        <BulkImportDrop
          accept=".csv"
          label="Drop CSV of legacy dues here"
          hint="UTF-8 · header row required"
          max="5,000 rows"
        />
      </Variant>

      <Variant title="Notification preferences" span={2}
        code={`<NotificationPrefRow label="Critical announcements"
  channelDesc="Safety, utilities, emergencies."
  critical email sms push />`}>
        <Card padded={false}>
          <NotificationPrefRow
            label="Critical announcements"
            channelDesc="Safety advisories, utility outages, emergency notices."
            critical email={true} sms={true} push={true}
          />
          <NotificationPrefRow
            label="General announcements"
            channelDesc="Newsletters, event reminders, non-urgent updates."
            email={true} sms={false} push={true}
          />
          <NotificationPrefRow
            label="Dues reminders"
            channelDesc="Statements, late notices, autopay confirmations."
            email={true} sms={false} push={false}
          />
          <NotificationPrefRow
            label="Maintenance updates"
            channelDesc="Status changes on requests you opened."
            email={true} sms={false} push={true}
          />
          <NotificationPrefRow
            label="Polls & votes"
            channelDesc="New ballots, deadline reminders, results."
            email={false} sms={false} push={true}
          />
        </Card>
      </Variant>
    </Section>
  );
}

window.HOASection = HOASection;
