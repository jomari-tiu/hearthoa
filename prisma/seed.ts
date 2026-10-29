import { PrismaClient, type PaymentMethod } from "@prisma/client";
import bcrypt from "bcryptjs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { chunkText } from "../lib/chunking";
import { embed } from "../lib/embeddings";
import { seedDocuments } from "./seed-data/documents";

const prisma = new PrismaClient();

const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (n: number) => new Date(Date.now() - n * DAY);
const MONTHLY_DUES_CENTS = 28500;

// Each entry is a Lot. `resident` is the current primary occupant (null = admin-only lot).
const lots: {
  address: string;
  unitNumber: string | null;
  resident: { name: string; email: string; phone: string; lang: string; status?: "pending" } | null;
}[] = [
  { address: "1024 Sunset Ridge Dr", unitNumber: null, resident: null }, // Maya Chen (seeded resident)
  { address: "1028 Sunset Ridge Dr", unitNumber: null, resident: { name: "Robert Okafor", email: "robert.okafor@sunset-ridge.test", phone: "(805) 555-0112", lang: "en" } },
  { address: "1032 Sunset Ridge Dr", unitNumber: null, resident: { name: "Carmen Delgado", email: "carmen.delgado@sunset-ridge.test", phone: "(805) 555-0127", lang: "es" } },
  { address: "200 Garden Court", unitNumber: "A", resident: { name: "Tom Whitaker", email: "tom.whitaker@sunset-ridge.test", phone: "(805) 555-0133", lang: "en" } },
  { address: "200 Garden Court", unitNumber: "B", resident: { name: "Ana Lucía Ramírez", email: "ana.ramirez@sunset-ridge.test", phone: "(805) 555-0141", lang: "es" } },
  { address: "1036 Sunset Ridge Dr", unitNumber: null, resident: { name: "Priya Natarajan", email: "priya.natarajan@sunset-ridge.test", phone: "(805) 555-0158", lang: "en" } },
  { address: "1040 Sunset Ridge Dr", unitNumber: null, resident: { name: "Marcus Bell", email: "marcus.bell@sunset-ridge.test", phone: "(805) 555-0164", lang: "en" } },
  { address: "1044 Sunset Ridge Dr", unitNumber: null, resident: { name: "Helen Kowalski", email: "helen.kowalski@sunset-ridge.test", phone: "(805) 555-0179", lang: "en" } },
  { address: "1048 Sunset Ridge Dr", unitNumber: null, resident: { name: "Luis Herrera", email: "luis.herrera@sunset-ridge.test", phone: "(805) 555-0183", lang: "es" } },
  { address: "1052 Sunset Ridge Dr", unitNumber: null, resident: { name: "Grace Liu", email: "grace.liu@sunset-ridge.test", phone: "(805) 555-0196", lang: "en" } },
  { address: "202 Garden Court", unitNumber: "A", resident: { name: "Ethan Brooks", email: "ethan.brooks@sunset-ridge.test", phone: "(805) 555-0108", lang: "en", status: "pending" } },
  { address: "202 Garden Court", unitNumber: "B", resident: { name: "Fatima Haddad", email: "fatima.haddad@sunset-ridge.test", phone: "(805) 555-0115", lang: "en" } },
  { address: "204 Garden Court", unitNumber: "A", resident: { name: "Jordan Park", email: "jordan.park@sunset-ridge.test", phone: "(805) 555-0122", lang: "en" } },
  { address: "204 Garden Court", unitNumber: "B", resident: { name: "Lina Romero", email: "lina.romero@sunset-ridge.test", phone: "(805) 555-0136", lang: "es" } },
  { address: "15 Vista Loop", unitNumber: null, resident: { name: "Kevin O'Neil", email: "kevin.oneil@sunset-ridge.test", phone: "(805) 555-0147", lang: "en" } },
  { address: "19 Vista Loop", unitNumber: null, resident: null }, // Sam Adler (admin)
];

async function main() {
  const hoa = await prisma.hoa.upsert({
    where: { slug: "sunset-ridge" },
    update: {},
    create: {
      name: "Sunset Ridge Community",
      slug: "sunset-ridge",
      supportedLanguages: ["en", "es"],
      defaultLanguage: "en",
      duesCadence: "monthly",
      timezone: "America/Los_Angeles",
      residentDirectoryVisibility: "all_residents",
      aiMonthlyBudgetCents: 30000,
      aiPerUserDailyMessages: 20,
    },
  });

  const passwordHash = await bcrypt.hash("changeme1234", 12);

  const admin = await prisma.user.upsert({
    where: { hoaId_email: { hoaId: hoa.id, email: "admin@sunset-ridge.test" } } as never,
    update: {},
    create: {
      hoaId: hoa.id,
      email: "admin@sunset-ridge.test",
      passwordHash,
      name: "Sam Adler",
      phone: "(805) 555-0101",
      role: "admin",
      status: "active",
      preferredLanguage: "en",
      emailVerifiedAt: new Date(),
    },
  });

  const resident = await prisma.user.upsert({
    where: { hoaId_email: { hoaId: hoa.id, email: "resident@sunset-ridge.test" } } as never,
    update: {},
    create: {
      hoaId: hoa.id,
      email: "resident@sunset-ridge.test",
      passwordHash,
      name: "Maya Chen",
      phone: "(805) 555-0104",
      role: "resident",
      status: "active",
      preferredLanguage: "en",
      emailVerifiedAt: new Date(),
    },
  });

  // ---------- Units & residents ----------
  const unitIds: string[] = [];
  const occupantByUnit = new Map<string, string>(); // unitId -> userId

  for (const [i, lot] of lots.entries()) {
    let unit = await prisma.unit.findFirst({
      where: { hoaId: hoa.id, address: lot.address, unitNumber: lot.unitNumber },
    });
    if (!unit) {
      unit = await prisma.unit.create({
        data: { hoaId: hoa.id, address: lot.address, unitNumber: lot.unitNumber },
      });
    }
    unitIds.push(unit.id);

    let user = lot.resident
      ? await prisma.user.upsert({
          where: { hoaId_email: { hoaId: hoa.id, email: lot.resident.email } } as never,
          update: {},
          create: {
            hoaId: hoa.id,
            email: lot.resident.email,
            passwordHash,
            name: lot.resident.name,
            phone: lot.resident.phone,
            role: "resident",
            status: lot.resident.status ?? "active",
            preferredLanguage: lot.resident.lang,
            emailVerifiedAt: lot.resident.status === "pending" ? null : daysAgo(200 - i * 7),
          },
        })
      : null;
    if (i === 0) user = resident;
    if (i === lots.length - 1) user = admin;
    if (!user) continue;
    occupantByUnit.set(unit.id, user.id);

    const existing = await prisma.unitResident.findFirst({
      where: { unitId: unit.id, userId: user.id, endDate: null },
    });
    if (!existing) {
      await prisma.unitResident.create({
        data: {
          hoaId: hoa.id,
          unitId: unit.id,
          userId: user.id,
          startDate: daysAgo(lot.resident?.status === "pending" ? 20 : 400 + i * 90),
          isPrimary: true,
        },
      });
    }
  }

  // A former owner at 15 Vista Loop who sold and moved out (now a rental).
  const vistaUnitId = unitIds[14]!;
  const formerOwner = await prisma.user.upsert({
    where: { hoaId_email: { hoaId: hoa.id, email: "rachel.stein@sunset-ridge.test" } } as never,
    update: {},
    create: {
      hoaId: hoa.id,
      email: "rachel.stein@sunset-ridge.test",
      passwordHash,
      name: "Rachel Stein",
      phone: "(805) 555-0150",
      role: "resident",
      status: "disabled",
      preferredLanguage: "en",
      emailVerifiedAt: daysAgo(900),
    },
  });
  const formerResidency = await prisma.unitResident.findFirst({
    where: { unitId: vistaUnitId, userId: formerOwner.id },
  });
  if (!formerResidency) {
    await prisma.unitResident.create({
      data: {
        hoaId: hoa.id,
        unitId: vistaUnitId,
        userId: formerOwner.id,
        startDate: daysAgo(1600),
        endDate: daysAgo(380),
        isPrimary: true,
      },
    });
  }

  // ---------- Announcements ----------
  const announcements: {
    title: string;
    body: string;
    priority?: "general" | "critical";
    isPinned?: boolean;
    daysAgo: number | null; // null = scheduled for the future
    es?: { title: string; body: string };
  }[] = [
    {
      title: "Welcome to HearthHOA",
      body: "Hi neighbors — we're moving HOA business to this portal. Announcements, dues, and document downloads all live here. Reply with questions any time.",
      isPinned: true,
      daysAgo: 75,
      es: {
        title: "Bienvenidos a HearthHOA",
        body: "Hola vecinos: estamos trasladando los asuntos de la asociación a este portal. Aquí encontrarán los anuncios, las cuotas y los documentos. Escríbannos con cualquier pregunta.",
      },
    },
    {
      title: "Pool closed Saturday for repairs",
      body: "The pool will be closed Saturday from 8 AM to 2 PM for pump maintenance. Thanks for your patience!",
      priority: "critical",
      daysAgo: 60,
    },
    {
      title: "Pool resurfacing begins November 3",
      body: "At the September meeting the Board approved resurfacing the pool (BlueWave Pool Co., funded from reserves). The pool and spa will be closed November 3 through about November 21. The clubhouse stays open. We'll post an update if the weather pushes the schedule.",
      priority: "critical",
      isPinned: true,
      daysAgo: 12,
      es: {
        title: "El repavimentado de la piscina comienza el 3 de noviembre",
        body: "En la reunión de septiembre, la Junta aprobó el repavimentado de la piscina (BlueWave Pool Co., con fondos de reserva). La piscina y el spa estarán cerrados del 3 al 21 de noviembre aproximadamente. La casa club seguirá abierta. Publicaremos una actualización si el clima cambia el calendario.",
      },
    },
    {
      title: "Draft 2027 budget available for review",
      body: "The draft 2027 operating budget is in the Document Library under Financials. It proposes a 3.5% increase, bringing monthly dues from $285 to $295, mostly to grow the reserve fund. Comments are welcome at the November 10 Board meeting.",
      daysAgo: 5,
      es: {
        title: "Borrador del presupuesto 2027 disponible",
        body: "El borrador del presupuesto operativo 2027 está en la Biblioteca de Documentos, en Finanzas. Propone un aumento del 3.5 %, de $285 a $295 al mes, principalmente para aumentar el fondo de reserva. Se reciben comentarios en la reunión de la Junta del 10 de noviembre.",
      },
    },
    {
      title: "Street sweeping Thursday — please move cars",
      body: "The street sweeper comes through this Thursday between 7 and 11 AM. Please park in your garage or driveway so the curbs can be cleaned.",
      daysAgo: 2,
    },
    {
      title: "Irrigation cut back to three days a week",
      body: "To meet the city's water-use targets, common-area irrigation runs Monday, Wednesday, and Friday mornings only through October. Brown patches on the greenbelt are expected and will recover with the rains.",
      daysAgo: 40,
    },
    {
      title: "Halloween trick-or-treat route",
      body: "Homes handing out candy on October 31 can put a pumpkin or porch light out front. Please drive slowly between 5 and 9 PM — lots of little ghosts on Sunset Ridge Dr!",
      daysAgo: 1,
      es: {
        title: "Ruta de Halloween",
        body: "Las casas que repartan dulces el 31 de octubre pueden poner una calabaza o la luz del porche encendida. Por favor manejen despacio entre las 5 y las 9 PM, ¡habrá muchos fantasmitas en Sunset Ridge Dr!",
      },
    },
    {
      title: "Annual meeting and board election — January 13",
      body: "The annual members' meeting is Tuesday, January 13 at 7 PM in the clubhouse. Three board seats are up for election. Candidate statements are due by December 1.",
      daysAgo: null,
    },
  ];

  for (const a of announcements) {
    const exists = await prisma.announcement.findFirst({ where: { hoaId: hoa.id, title: a.title } });
    if (exists) continue;
    const publishedAt = a.daysAgo === null ? null : daysAgo(a.daysAgo);
    const created = await prisma.announcement.create({
      data: {
        hoaId: hoa.id,
        authorId: admin.id,
        title: a.title,
        body: a.body,
        priority: a.priority ?? "general",
        sourceLanguage: "en",
        isPinned: a.isPinned ?? false,
        publishedAt,
        scheduledFor: a.daysAgo === null ? new Date(Date.now() + 14 * DAY) : null,
        createdAt: publishedAt ?? new Date(),
      },
    });
    if (a.es) {
      await prisma.announcementTranslation.create({
        data: {
          hoaId: hoa.id,
          announcementId: created.id,
          language: "es",
          title: a.es.title,
          body: a.es.body,
          isAutoTranslated: true,
          reviewedById: a.isPinned ? admin.id : null,
          reviewedAt: a.isPinned ? publishedAt : null,
        },
      });
    }
  }

  // ---------- Dues & payments ----------
  // Five past months + current month + next month. Due on the 15th (delinquency date
  // per CC&Rs 2.2), matching the late-dues cron which flags anything past dueDate.
  const duesCount = await prisma.due.count({ where: { hoaId: hoa.id } });
  if (duesCount === 0) {
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const periods = Array.from({ length: 7 }, (_, k) => {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + k, 15));
      return { period: `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`, dueDate: d, idx: k };
    });
    const methods: PaymentMethod[] = ["ach", "check", "card", "transfer"];

    for (const [u, unitId] of unitIds.entries()) {
      const payerId = occupantByUnit.get(unitId) ?? null;
      for (const p of periods) {
        // Per-unit story: who pays what, and when.
        let paidCents = MONTHLY_DUES_CENTS;
        let waived = false;
        let notes: string | null = null;
        const isNext = p.idx === 6;
        const isCurrent = p.idx === 5;

        if (isNext) paidCents = u % 4 === 0 ? MONTHLY_DUES_CENTS : 0; // autopay households prepaid
        if (u === 2 && isNext) { paidCents = 15000; notes = "Paid $150 toward next month; balance by the 15th."; }
        if (u === 8 && p.idx >= 3) { paidCents = 0; notes = "Payment plan requested — see Board executive session."; }
        if (u === 14 && isCurrent) { paidCents = 0; notes = "Tenant-occupied; reminder sent to owner."; }
        if (u === 3 && isCurrent) { paidCents = 10000; notes = "Partial check received; remainder outstanding."; }
        if (u === 10 && p.idx <= 4) { waived = true; notes = "Lot under construction before closing — waived by Board."; }
        if (u === 11 && p.idx === 2) { waived = true; notes = "Late fee and assessment waived — bank error on ACH."; }

        const fullyPaid = paidCents >= MONTHLY_DUES_CENTS;
        const status = waived
          ? "waived"
          : fullyPaid
            ? "paid"
            : p.dueDate < today
              ? "late"
              : paidCents > 0
                ? "partial"
                : "unpaid";

        const due = await prisma.due.create({
          data: {
            hoaId: hoa.id,
            unitId,
            period: p.period,
            amountCents: MONTHLY_DUES_CENTS,
            dueDate: p.dueDate,
            status,
            notes,
          },
        });

        const amount = waived ? MONTHLY_DUES_CENTS : paidCents;
        if (amount === 0) continue;
        const method: PaymentMethod = waived ? "waiver" : methods[u % methods.length]!;
        const paidAt = new Date(p.dueDate.getTime() - (10 - (u % 9)) * DAY);
        const reference =
          method === "check" ? `Check #${1000 + u * 37 + p.idx}`
          : method === "ach" ? `ACH ${p.period.replace("-", "")}-${String(u + 1).padStart(3, "0")}`
          : method === "card" ? `Card ending ${4000 + u * 13}`
          : method === "transfer" ? `Zelle ${p.period}`
          : null;

        await prisma.payment.create({
          data: {
            hoaId: hoa.id,
            paidByUserId: waived ? null : payerId,
            amountCents: amount,
            method,
            reference,
            paidAt: paidAt > new Date() ? new Date() : paidAt,
            recordedByUserId: admin.id,
            notes: waived ? notes : null,
            allocations: { create: { dueId: due.id, allocatedCents: amount } },
          },
        });
      }
    }
  }

  // ---------- Documents ----------
  const uploadsDir = path.resolve(process.cwd(), "uploads", hoa.id);
  await fs.mkdir(uploadsDir, { recursive: true });

  for (const [i, d] of seedDocuments.entries()) {
    const exists = await prisma.document.findFirst({ where: { hoaId: hoa.id, title: d.title } });
    if (exists) continue;

    const key = `${hoa.id}/seed-${d.fileName}`;
    const buffer = Buffer.from(d.content, "utf8");
    await fs.writeFile(path.join(uploadsDir, `seed-${d.fileName}`), buffer);

    const doc = await prisma.document.create({
      data: {
        hoaId: hoa.id,
        title: d.title,
        category: d.category,
        fileUrl: `/api/files/${encodeURIComponent(key)}`,
        fileType: "text/markdown",
        fileSizeBytes: BigInt(buffer.byteLength),
        uploadedById: admin.id,
        isChatbotIndexed: d.indexed,
        piiReviewStatus: d.indexed ? "acknowledged_safe" : "pending",
        piiReviewedById: d.indexed ? admin.id : null,
        piiReviewedAt: d.indexed ? new Date() : null,
        createdAt: daysAgo(90 - i * 10),
      },
    });

    if (!d.indexed) continue;
    const chunks = chunkText(d.content);
    const { vectors, model } = await embed(chunks.map((c) => c.content));
    for (const [n, chunk] of chunks.entries()) {
      const vec = vectors[n] ?? new Array<number>(1536).fill(0);
      await prisma.$executeRawUnsafe(
        `INSERT INTO document_chunks (id, hoa_id, document_id, chunk_index, content, page_number, section, embedding_model, embedding, created_at)
         VALUES (gen_random_uuid(), $1::uuid, $2::uuid, $3, $4, $5, $6, $7, $8::vector, NOW())`,
        hoa.id,
        doc.id,
        chunk.index,
        chunk.content,
        chunk.pageNumber,
        chunk.section,
        model,
        `[${vec.join(",")}]`,
      );
    }
  }

  // ---------- Maintenance requests ----------
  const maintCount = await prisma.maintenanceRequest.count({ where: { hoaId: hoa.id } });
  if (maintCount === 0) {
    const requests: {
      unit: number;
      title: string;
      description: string;
      category: "landscaping" | "plumbing" | "electrical" | "roads" | "pool" | "other";
      status: "new" | "in_progress" | "resolved" | "closed";
      daysAgo: number;
      assignedTo?: string;
      adminNotes?: string;
    }[] = [
      { unit: 0, title: "Street light out in front of 1024", description: "The street light between 1024 and 1028 has been out for about a week. It's very dark when walking the dog at night.", category: "electrical", status: "in_progress", daysAgo: 6, assignedTo: "Brightline Electric", adminNotes: "Ballast replacement scheduled for Thursday." },
      { unit: 7, title: "Sprinkler head broken on greenbelt", description: "A sprinkler head behind 1044 is broken and spraying onto the walking path. Water is pooling near the bench.", category: "landscaping", status: "new", daysAgo: 1 },
      { unit: 4, title: "Pool gate not latching", description: "The pool gate on the Garden Court side doesn't close all the way on its own. Kids could get in without an adult.", category: "pool", status: "resolved", daysAgo: 24, assignedTo: "Vista Gate & Fence", adminNotes: "Closer spring adjusted and hinge replaced. Verified self-latching." },
      { unit: 9, title: "Pothole near the entrance", description: "There's a pothole about a foot wide just inside the main entrance on the right side. It's getting bigger after the last rain.", category: "roads", status: "in_progress", daysAgo: 15, assignedTo: "Coastal Paving", adminNotes: "Temporary cold patch applied. Permanent repair bundled with the 2027 slurry seal." },
      { unit: 2, title: "Fuga de agua en la línea de riego del frente", description: "Hay agua saliendo del césped junto a la acera frente al 1032 incluso cuando el riego está apagado. Creo que es la línea principal de la asociación.", category: "plumbing", status: "new", daysAgo: 2 },
      { unit: 11, title: "Dead tree on Garden Court common area", description: "The pine tree between 202 and 204 Garden Court looks dead and is dropping branches on the walkway.", category: "landscaping", status: "closed", daysAgo: 70, assignedTo: "GreenScape Landscaping", adminNotes: "Arborist confirmed beetle damage. Tree removed and replaced with a 24-inch box oak." },
      { unit: 5, title: "Clubhouse restroom faucet dripping", description: "The left faucet in the women's restroom at the clubhouse drips constantly.", category: "plumbing", status: "resolved", daysAgo: 33, assignedTo: "Rapid Rooter", adminNotes: "Cartridge replaced." },
      { unit: 12, title: "Spa heater not working", description: "Spa water was cold Sunday evening even though the panel showed it on.", category: "pool", status: "closed", daysAgo: 48, assignedTo: "BlueWave Pool Co.", adminNotes: "Igniter replaced. Heater is 6 years old — flagged in reserve study." },
      { unit: 1, title: "Graffiti on perimeter wall", description: "Someone spray painted the back side of the perimeter wall along Vista Loop.", category: "other", status: "resolved", daysAgo: 19, assignedTo: "GreenScape Landscaping", adminNotes: "Painted over with the approved wall color." },
      { unit: 14, title: "Speed bump request near pool", description: "Cars come around the corner by the pool way too fast. Can we get a speed bump?", category: "roads", status: "new", daysAgo: 9, adminNotes: "On the October Board agenda — collecting quotes." },
    ];

    for (const r of requests) {
      const unitId = unitIds[r.unit]!;
      const submittedById = occupantByUnit.get(unitId) ?? resident.id;
      const createdAt = daysAgo(r.daysAgo);
      const resolvedAt = r.status === "resolved" || r.status === "closed" ? daysAgo(Math.max(0, r.daysAgo - 5)) : null;
      await prisma.maintenanceRequest.create({
        data: {
          hoaId: hoa.id,
          submittedById,
          unitId,
          title: r.title,
          description: r.description,
          category: r.category,
          status: r.status,
          assignedTo: r.assignedTo ?? null,
          adminNotes: r.adminNotes ?? null,
          resolvedAt,
          closedAt: r.status === "closed" ? daysAgo(Math.max(0, r.daysAgo - 8)) : null,
          createdAt,
        },
      });
    }
  }

  // ---------- Board ----------
  const board = [
    { name: "Sam Adler", role: "President", email: "president@sunset-ridge.test", termEnd: "2027-01-31", displayOrder: 1 },
    { name: "Priya Natarajan", role: "Vice President", email: "vicepresident@sunset-ridge.test", termEnd: "2028-01-31", displayOrder: 2 },
    { name: "Lina Romero", role: "Treasurer", email: "treasurer@sunset-ridge.test", termEnd: "2027-01-31", displayOrder: 3 },
    { name: "Jordan Park", role: "Secretary", email: "secretary@sunset-ridge.test", termEnd: "2028-01-31", displayOrder: 4 },
    { name: "Marcus Bell", role: "Director at Large", email: "director@sunset-ridge.test", termEnd: "2027-01-31", displayOrder: 5 },
  ];
  for (const b of board) {
    const existing = await prisma.boardMember.findFirst({ where: { hoaId: hoa.id, name: b.name } });
    if (existing) {
      if (!existing.termEnd) {
        await prisma.boardMember.update({
          where: { id: existing.id },
          data: { termEnd: new Date(b.termEnd), displayOrder: b.displayOrder },
        });
      }
      continue;
    }
    await prisma.boardMember.create({
      data: { hoaId: hoa.id, ...b, termEnd: new Date(b.termEnd) },
    });
  }

  console.log("✓ Seed complete");
  console.log("  HOA:", hoa.slug);
  console.log("  Admin:    admin@sunset-ridge.test / changeme1234");
  console.log("  Resident: resident@sunset-ridge.test / changeme1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
