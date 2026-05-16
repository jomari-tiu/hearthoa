"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  Check,
  ChevronDown,
  Download,
  Mail,
  Megaphone,
  Pin,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
  Wrench,
} from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Skeleton,
  Dialog,
  Table,
  type TableColumn,
  PageWrapper,
  Spinner,
  AnnouncementCard,
  DuesCard,
  DocumentItem,
  MaintenanceCard,
  AiChatMessage,
  BudgetGauge,
  BulkImportDrop,
  NotificationPrefRow,
} from "@/components/ds";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Logo } from "@/app/_components/Logo";
import { initials } from "@/lib/format";

const TONES = ["neutral", "primary", "success", "warning", "danger", "info"] as const;
const VARIANTS = ["soft", "solid", "outline"] as const;
const BUTTON_VARIANTS = ["primary", "secondary", "outline", "ghost", "soft", "danger", "link"] as const;
const BUTTON_SIZES = ["sm", "md", "lg"] as const;

type Row = { id: string; period: string; unit: string; amount: string; status: "paid" | "unpaid" | "late" };

const TABLE_ROWS: Row[] = [
  { id: "1", period: "2026-05", unit: "1024 Sunset Ridge Dr", amount: "$425.00", status: "unpaid" },
  { id: "2", period: "2026-04", unit: "1024 Sunset Ridge Dr", amount: "$425.00", status: "paid" },
  { id: "3", period: "2026-03", unit: "1024 Sunset Ridge Dr", amount: "$425.00", status: "late" },
];

const TABLE_COLS: TableColumn<Row>[] = [
  { key: "period", header: "Period", width: "100px", render: (r) => <span className="font-mono text-foreground-muted">{r.period}</span> },
  { key: "unit", header: "Unit", render: (r) => <span className="font-medium text-foreground">{r.unit}</span> },
  { key: "amount", header: "Amount", width: "120px", render: (r) => <span className="tabular-nums">{r.amount}</span> },
  {
    key: "status",
    header: "Status",
    width: "120px",
    render: (r) => (
      <Badge tone={r.status === "paid" ? "success" : r.status === "late" ? "danger" : "warning"} variant="soft">
        {r.status}
      </Badge>
    ),
  },
];

export default function SandboxPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pref, setPref] = useState({ email: true, sms: false, push: true });

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-6 h-14 border-b border-border bg-surface">
        <Logo />
        <span className="text-xs text-foreground-subtle">HearthHOA design sandbox</span>
      </header>

      <PageWrapper
        title="Sandbox"
        subtitle="Every primitive and composite in the design system. shadcn/ui underneath, HearthHOA OKLCH tokens on top."
        breadcrumbs={[{ label: "Sandbox" }]}
      >
        <Tabs defaultValue="foundations" className="flex flex-col gap-6">
          <TabsList className="self-start">
            <TabsTrigger value="foundations">Foundations</TabsTrigger>
            <TabsTrigger value="primitives">Primitives</TabsTrigger>
            <TabsTrigger value="composites">HOA composites</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>

          {/* ====================== FOUNDATIONS ====================== */}
          <TabsContent value="foundations" className="flex flex-col gap-8">
            <Section title="Color tokens" description="Semantic roles, OKLCH-based. Light theme shown.">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  { name: "primary", className: "bg-primary text-primary-fg" },
                  { name: "primary-soft", className: "bg-primary-soft text-primary-soft-fg" },
                  { name: "foreground", className: "bg-foreground text-[var(--bg)]" },
                  { name: "muted", className: "bg-surface-2 text-foreground-muted border border-border" },
                  { name: "success", className: "bg-success text-white" },
                  { name: "warning", className: "bg-warning text-[oklch(18%_0.04_75)]" },
                  { name: "danger", className: "bg-danger text-white" },
                  { name: "info", className: "bg-info text-white" },
                  { name: "surface", className: "bg-surface text-foreground border border-border" },
                  { name: "border", className: "bg-border text-foreground border border-border-strong" },
                  { name: "border-strong", className: "bg-border-strong text-foreground" },
                  { name: "subtle", className: "bg-surface-2 text-foreground-subtle border border-border" },
                ].map((t) => (
                  <div key={t.name} className={`rounded-md px-3 py-4 text-xs font-mono ${t.className}`}>
                    {t.name}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Typography" description="Plus Jakarta Sans + JetBrains Mono.">
              <Card>
                <CardContent className="flex flex-col gap-3">
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground">The pool is closed Saturday.</h1>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">Dues for May are due Friday.</h2>
                  <h3 className="text-xl font-semibold text-foreground">Maintenance request #42</h3>
                  <h4 className="text-base font-semibold text-foreground">Section 4.2 — Architectural review</h4>
                  <p className="text-sm text-foreground">
                    The board meets the second Tuesday of every month at 6:30 PM. Residents may attend the open portion.
                  </p>
                  <p className="text-sm text-foreground-muted">
                    Subtle copy uses <code className="font-mono text-xs bg-surface-2 px-1 rounded">text-foreground-muted</code>.
                  </p>
                  <p className="text-xs text-foreground-subtle">The tertiary line uses text-foreground-subtle.</p>
                </CardContent>
              </Card>
            </Section>

            <Section title="Spacing &amp; radius">
              <div className="flex items-end gap-3">
                {["sm", "md", "lg", "xl"].map((r) => (
                  <div key={r} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-16 h-16 bg-primary-soft border border-border ${
                        r === "sm" ? "rounded-sm" : r === "md" ? "rounded-md" : r === "lg" ? "rounded-lg" : "rounded-xl"
                      }`}
                    />
                    <span className="text-xs text-foreground-subtle font-mono">rounded-{r}</span>
                  </div>
                ))}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-16 h-16 bg-primary-soft border border-border rounded-pill" />
                  <span className="text-xs text-foreground-subtle font-mono">rounded-pill</span>
                </div>
              </div>
            </Section>
          </TabsContent>

          {/* ====================== PRIMITIVES ====================== */}
          <TabsContent value="primitives" className="flex flex-col gap-8">
            <Section title="Buttons" description="Seven variants × three sizes. Icon-only via size='icon'.">
              <div className="flex flex-col gap-3">
                {BUTTON_SIZES.map((size) => (
                  <div key={size} className="flex flex-wrap items-center gap-2">
                    <span className="text-xs uppercase font-mono text-foreground-subtle w-10">{size}</span>
                    {BUTTON_VARIANTS.map((variant) => (
                      <Button key={variant} variant={variant} size={size}>
                        {variant}
                      </Button>
                    ))}
                  </div>
                ))}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                  <Button leftIcon={<Plus size={14} />}>With left icon</Button>
                  <Button rightIcon={<ChevronDown size={14} />} variant="outline">
                    With right icon
                  </Button>
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                  <Button variant="danger" size="icon" aria-label="Delete">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Section>

            <Section title="Badges" description={`${TONES.length} tones × ${VARIANTS.length} variants.`}>
              <div className="flex flex-col gap-2">
                {VARIANTS.map((variant) => (
                  <div key={variant} className="flex flex-wrap items-center gap-2">
                    <span className="text-xs uppercase font-mono text-foreground-subtle w-16">{variant}</span>
                    {TONES.map((tone) => (
                      <Badge key={tone} tone={tone} variant={variant}>
                        {tone}
                      </Badge>
                    ))}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Form fields">
              <Card>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="sb-email">Email</Label>
                    <Input id="sb-email" type="email" placeholder="you@example.com" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="sb-search">With icon</Label>
                    <Input id="sb-search" leftIcon={<Search size={14} />} placeholder="Search…" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="sb-invalid">Invalid state</Label>
                    <Input id="sb-invalid" defaultValue="not-an-email" invalid />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="sb-disabled">Disabled</Label>
                    <Input id="sb-disabled" disabled defaultValue="readonly value" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <Label htmlFor="sb-body">Textarea</Label>
                    <Textarea id="sb-body" placeholder="Hi neighbors…" rows={3} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="sb-check" defaultChecked />
                    <Label htmlFor="sb-check" className="cursor-pointer">Pin to top of feed</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="sb-switch" defaultChecked />
                    <Label htmlFor="sb-switch" className="cursor-pointer">Email notifications</Label>
                  </div>
                </CardContent>
              </Card>
            </Section>

            <Section title="Cards">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Pool maintenance</CardTitle>
                    <CardDescription>Scheduled for Saturday 8am–2pm.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground-muted">
                      The pump replacement requires the pool to be drained. We&apos;ll send a confirmation when it&apos;s reopened.
                    </p>
                  </CardContent>
                  <CardFooter className="justify-end gap-2">
                    <Button variant="outline" size="sm">Dismiss</Button>
                    <Button size="sm">Acknowledge</Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{initials("Maya Chen")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-foreground">Maya Chen</div>
                        <div className="text-xs text-foreground-subtle">Unit 1028</div>
                      </div>
                    </div>
                    <Separator />
                    <Progress value={64} tone="primary" />
                    <p className="text-xs text-foreground-muted">64% of annual dues collected</p>
                  </CardContent>
                </Card>
              </div>
            </Section>

            <Section title="Skeleton + Spinner">
              <Card>
                <CardContent className="flex flex-col gap-3">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-3/5" />
                  <div className="flex items-center gap-2 pt-2">
                    <Spinner /> <span className="text-xs text-foreground-muted">Loading…</span>
                  </div>
                </CardContent>
              </Card>
            </Section>

            <Section title="Dialog">
              <div className="flex gap-2">
                <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
                <Dialog
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                  title="Delete announcement?"
                  description="This is permanent. Translations are removed too. Residents who already received the email keep their copy."
                  footer={
                    <>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="danger" onClick={() => setDialogOpen(false)}>
                        Delete
                      </Button>
                    </>
                  }
                />
              </div>
            </Section>

            <Section title="Table">
              <Table<Row>
                columns={TABLE_COLS}
                data={TABLE_ROWS}
                rowKey="id"
                pagination
                pageSize={10}
                totalCount={TABLE_ROWS.length}
                currentPage={1}
                onPageChange={() => {}}
              />
            </Section>

            <Section title="Tooltip">
              <TooltipProvider>
                <div className="flex items-center gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" leftIcon={<Sparkles size={14} />}>Hover me</Button>
                    </TooltipTrigger>
                    <TooltipContent>AI-generated, review before publishing.</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" aria-label="Email">
                        <Mail size={14} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Email this resident</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </Section>
          </TabsContent>

          {/* ====================== HOA COMPOSITES ====================== */}
          <TabsContent value="composites" className="flex flex-col gap-8">
            <Section title="Announcement card" description="General and Critical variants.">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AnnouncementCard
                  priority="general"
                  title="Welcome to HearthHOA"
                  body="We're moving HOA business to this portal. Announcements, dues, and document downloads all live here."
                  author={{ name: "Sam Adler", role: "President" }}
                  time="2 hours ago"
                  audience="All residents"
                  optOut
                />
                <AnnouncementCard
                  priority="critical"
                  title="Water shutoff Saturday 8a–2p"
                  body="The main line will be replaced. Please store enough drinking water for the morning."
                  author={{ name: "Lina Romero", role: "Maintenance" }}
                  time="10 min ago"
                  translations="ES, TL"
                />
              </div>
            </Section>

            <Section title="Dues card" description="Resident-facing balance card with status and progress.">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DuesCard unit="1024" owner="Maya Chen" amountCents={42500} due="May 31" period="month" status="pending" paidPct={64} />
                <DuesCard unit="1028" owner="Jordan Park" amountCents={42500} due="May 31" period="month" status="paid" autopay paidPct={100} />
                <DuesCard unit="1032" owner="Sam Adler" amountCents={42500} due="Apr 30" period="month" status="overdue" paidPct={48} />
                <DuesCard unit="200A" owner="Quinn Yu" amountCents={42500} due="Jun 30" period="month" status="upcoming" paidPct={20} />
              </div>
            </Section>

            <Section title="Document item" description="PII status, encryption indicator, action overflow.">
              <div className="flex flex-col gap-3">
                <DocumentItem name="CC&R Bylaws 2026 (Amended)" type="PDF" size="2.4 MB" updated="Apr 12" piiStatus="cleared" tags={["bylaws", "current"]} />
                <DocumentItem name="Board minutes — March 2026" type="DOCX" size="184 KB" updated="Mar 14" piiStatus="pending" tags={["minutes"]} />
                <DocumentItem name="Resident roster (legacy)" type="CSV" size="32 KB" updated="2 days ago" piiStatus="blocked" tags={["financials"]} />
              </div>
            </Section>

            <Section title="Maintenance card">
              <div className="flex flex-col gap-3">
                <MaintenanceCard id="42" title="Broken sprinkler in section C" unit="—" reporter="Maya Chen" status="in-progress" priority="normal" opened="2 days ago" assignee="GreenLeaf Co." photos={2} />
                <MaintenanceCard id="41" title="Pool gate lock sticking" unit="—" reporter="Anonymous" status="open" priority="high" opened="1 week ago" photos={1} />
                <MaintenanceCard id="38" title="Streetlight out near mailboxes" unit="—" reporter="Jordan Park" status="resolved" priority="low" opened="3 weeks ago" assignee="City Works" />
              </div>
            </Section>

            <Section title="AI chat message">
              <Card>
                <CardContent className="flex flex-col gap-3">
                  <AiChatMessage from="user" text="Can I paint my front door red?" time="10:14 AM" />
                  <AiChatMessage
                    from="bot"
                    text="Front-door colors must match one of the seven shades listed in the Architectural Guidelines. Red is not currently on that list, but you can request a variance from the ARC committee."
                    time="10:14 AM"
                    citations={["Architectural Guidelines · §3.4", "CC&R · §7.1"]}
                  />
                  <AiChatMessage from="user" text="What are the pool hours?" time="10:15 AM" />
                  <AiChatMessage
                    from="bot"
                    text="The pool is open daily from 8 AM to 9 PM, weather permitting. Children under 14 must be accompanied by an adult."
                    time="10:15 AM"
                    citations={["Pool Rules · §1"]}
                  />
                </CardContent>
              </Card>
            </Section>

            <Section title="Budget gauge">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <BudgetGauge spentCents={4200} capCents={20000} />
                <BudgetGauge spentCents={14800} capCents={20000} />
                <BudgetGauge spentCents={19200} capCents={20000} />
              </div>
            </Section>

            <Section title="Bulk import dropzone">
              <BulkImportDrop label="Drop residents.csv" hint="or click to browse" max="25 MB" />
            </Section>

            <Section title="Notification preferences row">
              <Card>
                <CardContent className="flex flex-col">
                  <NotificationPrefRow
                    label="New announcements"
                    description="General announcements from the board."
                    email={pref.email}
                    sms={pref.sms}
                    push={pref.push}
                    onChange={(ch, v) => setPref((p) => ({ ...p, [ch]: v }))}
                  />
                  <NotificationPrefRow
                    label="Maintenance updates"
                    description="Status changes on your own requests."
                    email
                    sms={false}
                    push
                    critical
                  />
                  <NotificationPrefRow
                    label="Dues reminders"
                    description="Before a due date."
                    email
                    sms={false}
                    push={false}
                  />
                </CardContent>
              </Card>
            </Section>
          </TabsContent>

          {/* ====================== PATTERNS ====================== */}
          <TabsContent value="patterns" className="flex flex-col gap-8">
            <Section title="Empty state">
              <Card>
                <CardContent className="flex flex-col items-center gap-2 py-12">
                  <Megaphone size={28} className="text-foreground-subtle" />
                  <h3 className="text-base font-semibold text-foreground">No announcements yet</h3>
                  <p className="text-sm text-foreground-muted max-w-sm text-center">
                    Post the first one so residents see it on their dashboard.
                  </p>
                  <Button className="mt-2" size="sm" leftIcon={<Plus size={14} />}>
                    Post first announcement
                  </Button>
                </CardContent>
              </Card>
            </Section>

            <Section title="Inline warning">
              <Card className="border-warning/40">
                <CardContent className="flex items-start gap-3">
                  <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-foreground">PII review required before indexing</span>
                    <span className="text-sm text-foreground-muted">
                      The automatic scan flagged possible personal info. Confirm the document is safe to share with the chatbot.
                    </span>
                  </div>
                  <Button className="ml-auto shrink-0" size="sm">
                    Clear and index
                  </Button>
                </CardContent>
              </Card>
            </Section>

            <Section title="Inline action row">
              <Card>
                <CardContent className="flex flex-wrap items-center gap-2">
                  <Input leftIcon={<Search size={14} />} placeholder="Search announcements…" className="max-w-sm" />
                  <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" leftIcon={<Upload size={14} />}>
                      Import
                    </Button>
                    <Button variant="outline" leftIcon={<Download size={14} />}>
                      Export
                    </Button>
                    <Button leftIcon={<Plus size={16} />}>New</Button>
                  </div>
                </CardContent>
              </Card>
            </Section>

            <Section title="Pinned banner">
              <div className="flex items-center gap-2 rounded-md border border-primary-soft bg-primary-soft px-3 py-2 text-sm">
                <Pin size={14} className="text-primary-soft-fg" />
                <span className="text-primary-soft-fg font-medium">Welcome to HearthHOA — read the orientation post.</span>
                <Button variant="link" size="sm" className="ml-auto">
                  Open
                </Button>
              </div>
            </Section>

            <Section title="Status chips">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="info" variant="solid"><Bell size={11} /> New</Badge>
                <Badge tone="warning" variant="solid"><Wrench size={11} /> In progress</Badge>
                <Badge tone="success" variant="solid"><Check size={11} /> Resolved</Badge>
                <Badge tone="neutral" variant="solid">Closed</Badge>
              </div>
            </Section>
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </main>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">{title}</h2>
        {description ? <p className="text-sm text-foreground-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
