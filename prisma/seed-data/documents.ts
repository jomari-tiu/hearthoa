// Sample governing documents for the Sunset Ridge pilot HOA. Plain markdown so the
// ingest pipeline (text/markdown) can parse them and the chatbot can cite them.

export type SeedDocument = {
  title: string;
  category: "bylaws" | "ccrs" | "minutes" | "financials" | "forms" | "other";
  fileName: string;
  indexed: boolean;
  content: string;
};

export const seedDocuments: SeedDocument[] = [
  {
    title: "Declaration of Covenants, Conditions & Restrictions (CC&Rs)",
    category: "ccrs",
    fileName: "sunset-ridge-ccrs.md",
    indexed: true,
    content: `# Declaration of Covenants, Conditions & Restrictions
## Sunset Ridge Community Association

Recorded with the County Recorder. Amended and restated effective January 1, 2024.

## Article 1 — Definitions

1.1 "Association" means Sunset Ridge Community Association, a nonprofit mutual benefit corporation.
1.2 "Lot" means any plot of land shown on the recorded subdivision map, together with the residence on it.
1.3 "Common Area" means all property owned by the Association, including the pool and clubhouse, the greenbelt, the entry monuments, private streets, and the guest parking areas.
1.4 "Owner" means the record owner of a Lot. "Resident" means any person living in a residence, whether Owner or tenant.

## Article 2 — Assessments

2.1 Regular assessments. Each Lot is charged a regular assessment set by the Board in the annual budget. For fiscal year 2026 the regular assessment is $285 per month.
2.2 Due date. Assessments are due on the first (1st) day of each month and are delinquent if not received by the fifteenth (15th) day of the month.
2.3 Late charges. A late charge of $25 or 10% of the delinquent amount, whichever is greater, is added to any assessment that is delinquent. Interest accrues at 12% per year starting 30 days after the due date.
2.4 Special assessments. The Board may levy a special assessment of up to 5% of the annual budgeted gross expenses without a membership vote. Larger special assessments require approval of a majority of a quorum of Owners.
2.5 Payment plans. An Owner who is behind may request a payment plan in writing. The Board will respond within 15 days.
2.6 Reserves. At least 10% of regular assessments are deposited into the reserve fund for the repair and replacement of Common Area components.

## Article 3 — Use Restrictions

3.1 Residential use. Lots are for residential purposes only. Home offices are allowed if there is no customer traffic, signage, or inventory stored outside.
3.2 Rentals. Owners may lease their residence for a term of no less than 30 days. Short-term rentals of less than 30 days (including vacation rental platforms) are prohibited. Owners must provide the Association with a copy of the lease and tenant contact information within 10 days of signing.
3.3 Pets. Each residence may keep up to three (3) common household pets. Dogs must be leashed in the Common Area, and owners must pick up after their pets immediately. Pets that create a nuisance through excessive barking may be subject to a hearing.
3.4 Noise. Quiet hours are 10:00 PM to 7:00 AM Sunday through Thursday and 11:00 PM to 8:00 AM on Friday and Saturday. Construction noise is limited to 8:00 AM to 6:00 PM Monday through Saturday.
3.5 Trash. Trash, recycling, and green waste containers may be placed at the curb no earlier than 6:00 PM the evening before collection and must be returned out of street view by 9:00 PM on collection day. Collection day is Tuesday.
3.6 Signs. One "For Sale" or "For Rent" sign no larger than 18 by 24 inches is allowed. Political signs are permitted as provided by state law.
3.7 Holiday decorations. Decorations may be displayed up to 30 days before and must be removed within 15 days after the holiday.

## Article 4 — Parking and Vehicles

4.1 Garages must be kept usable for parking at least one vehicle.
4.2 Residents may not park on private streets overnight between 2:00 AM and 6:00 AM without a temporary permit from management.
4.3 Guest parking spaces are limited to 72 consecutive hours per vehicle.
4.4 Boats, trailers, RVs, and commercial vehicles over 10,000 lbs may not be parked in the community except for loading or unloading for up to 24 hours.
4.5 Inoperable or unregistered vehicles may be towed after a 96-hour notice posted on the vehicle.

## Article 5 — Architectural Review

5.1 Approval required. No exterior change — including paint color, fences, patio covers, solar panels, landscaping that replaces more than 25% of the front yard, windows, or doors — may be made without prior written approval of the Architectural Review Committee (ARC).
5.2 Application. Owners submit the Architectural Change Request form with plans, materials, and color samples. The ARC will approve or deny within 45 days. An application not acted on within 45 days is deemed denied, and the Owner may appeal to the Board.
5.3 Approved paint palette. Exterior paint must come from the Association's approved palette, available in the Document Library.
5.4 Solar. Solar energy systems are approved as required by state law; the ARC may only impose reasonable restrictions that do not significantly increase cost or reduce efficiency.
5.5 Fences. Side and rear fences may not exceed 6 feet in height. Front-yard fences are not permitted.

## Article 6 — Maintenance Responsibilities

6.1 Association. The Association maintains the Common Area, private streets, street lighting, the perimeter wall, the pool and clubhouse, and front-yard irrigation main lines.
6.2 Owners. Owners maintain their residence, roof, driveway, windows, back yard, and any front-yard landscaping within the Lot boundary.
6.3 Failure to maintain. If an Owner fails to maintain their Lot after 30 days' written notice, the Association may perform the work and charge the cost to the Owner as a reimbursement assessment.

## Article 7 — Pool and Clubhouse

7.1 Pool hours are 7:00 AM to 10:00 PM daily, May through September, and 8:00 AM to 8:00 PM October through April.
7.2 Children under 14 must be accompanied by an adult. No lifeguard is on duty.
7.3 Each household may bring up to four guests at a time. The resident must be present.
7.4 The clubhouse may be reserved for private events with a $150 refundable deposit. Reservations are made through management at least 14 days in advance.

## Article 8 — Enforcement

8.1 Notice and hearing. Before imposing a fine, the Board will give the Owner at least 10 days' written notice and an opportunity for a hearing.
8.2 Fine schedule. First violation: written warning. Second violation of the same rule within 12 months: $100. Each further violation: $200. Continuing violations may be fined weekly.
8.3 Fines are not assessments and may not be the basis for a lien.

## Article 9 — Insurance

9.1 The Association carries property insurance on Common Area improvements and general liability coverage of at least $2,000,000.
9.2 Owners are responsible for insuring their own residence and personal property.

## Article 10 — Amendment

10.1 This Declaration may be amended by the affirmative vote of Owners holding at least 51% of the voting power.
`,
  },
  {
    title: "Bylaws of Sunset Ridge Community Association",
    category: "bylaws",
    fileName: "sunset-ridge-bylaws.md",
    indexed: true,
    content: `# Bylaws of Sunset Ridge Community Association

## Article I — Membership and Voting

1.1 Every Owner of a Lot is a Member. Membership is tied to the Lot and cannot be transferred separately.
1.2 Each Lot has one (1) vote. When a Lot has multiple Owners, they must agree among themselves how to cast the vote.
1.3 Members may vote in person, by secret ballot by mail, or by proxy where allowed by law.

## Article II — Meetings of Members

2.1 Annual meeting. The annual meeting is held in January each year at the clubhouse or another location set by the Board.
2.2 Special meetings. A special meeting may be called by the President, a majority of the Board, or Members holding at least 5% of the voting power.
2.3 Notice. Notice of a Members' meeting is sent at least 10 days and not more than 90 days before the meeting.
2.4 Quorum. A quorum is 25% of the voting power. If a quorum is not reached, the meeting may be adjourned and reconvened with a quorum of 15%.

## Article III — Board of Directors

3.1 Number. The Board has five (5) directors.
3.2 Terms. Directors serve staggered two-year terms. Three seats are elected in even years and two seats in odd years.
3.3 Qualifications. A director must be a Member in good standing who is not more than 60 days delinquent in assessments.
3.4 Vacancies. The remaining directors may fill a vacancy until the next annual meeting.
3.5 Compensation. Directors serve without pay but may be reimbursed for reasonable expenses.

## Article IV — Board Meetings

4.1 Regular meetings are held on the second Tuesday of every month at 7:00 PM.
4.2 Notice of Board meetings and the agenda are posted at least 4 days in advance on the portal and at the clubhouse.
4.3 Members may attend open sessions and speak during the open forum at the start of each meeting, limited to 3 minutes per speaker.
4.4 The Board may meet in executive session only to discuss litigation, contracts with third parties, personnel matters, member discipline, and delinquent assessments.
4.5 Minutes of open sessions are made available to Members within 30 days.

## Article V — Officers

5.1 The officers are a President, Vice President, Treasurer, and Secretary, elected by the Board from among the directors.
5.2 The President presides over meetings and signs contracts approved by the Board.
5.3 The Treasurer oversees the Association's funds, presents a monthly financial report, and prepares the annual budget with the manager.
5.4 The Secretary keeps the minutes and the membership register.

## Article VI — Committees

6.1 Standing committees are the Architectural Review Committee, the Landscape Committee, and the Social Committee.
6.2 Committee members are appointed by the Board and serve at its pleasure.

## Article VII — Fiscal Matters

7.1 The fiscal year is January 1 through December 31.
7.2 The Board distributes a pro forma operating budget to Members 30 to 90 days before the start of the fiscal year.
7.3 An independent review of the financial statements is completed each year for associations with gross income over $75,000.
7.4 Withdrawals from the reserve account require the signatures of two directors.

## Article VIII — Records

8.1 Members may inspect Association records on 10 days' written request. Copies are provided at reasonable cost.
`,
  },
  {
    title: "Board Meeting Minutes — September 2026",
    category: "minutes",
    fileName: "minutes-2026-09.md",
    indexed: true,
    content: `# Board Meeting Minutes — September 9, 2026

Location: Sunset Ridge Clubhouse. Called to order at 7:02 PM by President Sam Adler.

Directors present: Sam Adler (President), Priya Natarajan (Vice President), Lina Romero (Treasurer), Jordan Park (Secretary), Marcus Bell (Director). Quorum confirmed.

## Open Forum

- A resident on Sunset Ridge Dr asked about speeding near the pool entrance. The Board will get quotes for a speed hump.
- A resident on Garden Court thanked the Landscape Committee for the new drought-tolerant plantings at the entry.

## Approval of Minutes

The August 12, 2026 minutes were approved as written (5–0).

## Treasurer's Report

- Operating account balance: $48,212.
- Reserve account balance: $186,940 (54% funded per the 2025 reserve study).
- Delinquencies over 30 days: 3 units totaling $1,140.

## Business

1. Pool resurfacing. Received three bids. Motion to award to BlueWave Pool Co. for $38,500 from reserves, work to begin November 3. Approved 5–0.
2. Speed hump. Secretary to collect two quotes for the October meeting.
3. Landscape contract renewal. Tabled to October pending the Landscape Committee's recommendation.
4. 2027 budget. Treasurer presented a draft with a proposed 3.5% increase (to $295/month). Will be distributed to Members by October 31.

## Architectural Review

- 1028 Sunset Ridge Dr — rooftop solar: approved.
- 200 Garden Court Unit B — patio cover: approved with the condition that the color matches the trim.

Executive session held 8:15–8:40 PM regarding one delinquent account. No action taken in open session.

Adjourned at 8:42 PM. Next meeting: October 13, 2026.
`,
  },
  {
    title: "Board Meeting Minutes — August 2026",
    category: "minutes",
    fileName: "minutes-2026-08.md",
    indexed: true,
    content: `# Board Meeting Minutes — August 12, 2026

Location: Sunset Ridge Clubhouse. Called to order at 7:00 PM.

Directors present: Sam Adler, Priya Natarajan, Lina Romero, Jordan Park. Absent: Marcus Bell. Quorum confirmed.

## Business

1. Gate repair. The east pedestrian gate latch was replaced for $640. Ratified 4–0.
2. Pool pump. The main circulation pump failed on July 28 and was replaced for $2,180 from reserves. Ratified 4–0.
3. Portal launch. The Board approved moving announcements, dues, and documents to the HearthHOA portal. Paper notices will continue for residents who request them.
4. Water use. The Landscape Committee will reduce common-area irrigation to three days per week through October.

Adjourned at 8:05 PM.
`,
  },
  {
    title: "2026 Annual Operating Budget",
    category: "financials",
    fileName: "budget-2026.md",
    indexed: true,
    content: `# 2026 Annual Operating Budget — Sunset Ridge Community Association

Adopted by the Board on November 11, 2025. 16 Lots. Regular assessment: $285 per Lot per month.

## Income

| Line item | Annual |
|---|---|
| Regular assessments (16 × $285 × 12) | $54,720 |
| Late fees and interest | $600 |
| Clubhouse rentals | $900 |
| **Total income** | **$56,220** |

## Operating expenses

| Line item | Annual |
|---|---|
| Landscaping contract | $14,400 |
| Common-area water | $6,200 |
| Common-area electricity (street lights, pool) | $4,800 |
| Pool service and chemicals | $5,400 |
| Insurance (property, liability, D&O) | $7,900 |
| Management fee | $6,000 |
| Legal and accounting | $2,400 |
| Repairs and maintenance | $2,500 |
| Portal and office | $800 |
| **Total operating** | **$50,400** |

## Reserve contribution

Transfer to reserves: $5,820 (10.6% of assessment income).

## Notes

- The 2025 reserve study recommends gradually raising the reserve contribution to reach 70% funded by 2030.
- A 3.5% assessment increase is proposed for 2027.
`,
  },
  {
    title: "Reserve Study Summary 2025",
    category: "financials",
    fileName: "reserve-study-2025.md",
    indexed: false,
    content: `# Reserve Study Summary — 2025 Update

Prepared by Coastline Reserve Consultants. Site visit: March 18, 2025.

Percent funded: 54%. Recommended annual contribution: $7,200.

| Component | Useful life | Remaining life | Replacement cost |
|---|---|---|---|
| Pool resurfacing | 12 yrs | 1 yr | $38,000 |
| Pool heater | 10 yrs | 4 yrs | $6,500 |
| Private street slurry seal | 5 yrs | 2 yrs | $22,000 |
| Street asphalt overlay | 25 yrs | 11 yrs | $140,000 |
| Perimeter wall paint | 10 yrs | 6 yrs | $18,000 |
| Clubhouse roof | 25 yrs | 14 yrs | $24,000 |
| Street light fixtures (LED) | 20 yrs | 15 yrs | $9,800 |
| Entry monument | 30 yrs | 18 yrs | $12,000 |
`,
  },
  {
    title: "Architectural Change Request Form",
    category: "forms",
    fileName: "architectural-change-request.md",
    indexed: false,
    content: `# Architectural Change Request

Submit to the Architectural Review Committee before starting any exterior change. The ARC responds within 45 days.

Owner name: ______________________
Property address: ______________________

Type of change (check all that apply):
[ ] Exterior paint   [ ] Fence or wall   [ ] Patio cover   [ ] Solar
[ ] Front-yard landscaping   [ ] Windows or doors   [ ] Other: __________

Description of work:
______________________________________________

Attach: site plan or sketch, material and color samples, contractor name and license number.

Estimated start date: __________   Estimated completion: __________

Neighbor acknowledgment (adjacent Lots):
1. ______________________   2. ______________________

I agree to complete the work as approved and to comply with the CC&Rs.

Owner signature: ______________________   Date: __________
`,
  },
  {
    title: "Pool & Clubhouse Rules",
    category: "other",
    fileName: "pool-clubhouse-rules.md",
    indexed: true,
    content: `# Pool & Clubhouse Rules

- Summer hours (May–September): 7:00 AM – 10:00 PM. Winter hours (October–April): 8:00 AM – 8:00 PM.
- No lifeguard on duty. Swim at your own risk.
- Children under 14 must be accompanied by an adult.
- Up to four guests per household; the resident must be present.
- No glass containers in the pool area.
- Pets are not allowed inside the pool gate (service animals excepted).
- Use your key fob to enter. Do not prop the gate open.
- Clubhouse reservations: $150 refundable deposit, book at least 14 days in advance, events must end by 10:00 PM.
- Report maintenance issues through the Maintenance Requests page in the portal.
`,
  },
];
