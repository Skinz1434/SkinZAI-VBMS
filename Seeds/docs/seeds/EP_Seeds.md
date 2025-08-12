# EP Seeds — Flows & Behavior

**Purpose:** Provide realistic, repeatable seeded claims across major EP types with
appropriate tasks, documents, and outcomes. These flows are *synthetic* but mimic practical steps.

## EP Types (synthetic mapping)
- **010 — Original Compensation**: new service connection claim.
- **020 — Increased Evaluation**: worsening of already service‑connected conditions.
- **040 — Supplemental (Reopened)**: new and relevant evidence after prior denial.
- **110 — Pension/A&A (mock)**: non‑SC pension with Aid & Attendance/Housebound (simplified).
- **400 — Administrative Review (mock)**: corrections/character of discharge/other admin actions.

## Canonical flow (per EP)
1) **Intake** → create EP, add contentions (1–6)
2) **Development** → request records, schedule exams; generate **DTA/VCAA** letters
3) **Evidence** → docs land in eFolder; OCR (optional); link to contentions
4) **Decision** → diagnostic codes, % evals, effective dates, narrative + code sheet
5) **Award** → compute + archive award snapshot; send decision letter
6) **Handoff** → (optional) appeals lane placeholder; packet write‑back

## Flow nuances
- **010**: broader development; more exams. Typical docs: STRs, DBQs, CAPRI notes.
- **020**: focused exams; compare with prior ratings; fewer development requests.
- **040**: requires new/relevant evidence; seed ensures a new DBQ or imaging arrives.
- **110**: generates income/needs assessment docs; different letters; no DC ratings here.
- **400**: produces admin decisions and correspondence; no award snapshot.

See `data/catalog/ep_types.json` for tunable knobs per EP (contention counts, task templates, document mix).
