# QBit Mock VA eFolder — V2 MAX (Synthetic)

**Veteran:** Jordan R. Sampleton (File#: F31605305 | EDIPI: 0400481269)
**Branch/MOS:** Navy / 25B Information Tech
**Service:** 2002-05-20 to 2014-08-15

This is a large, fully synthetic, **non-PII** mock e-folder for testing ingestion, retrieval, adjudication flows, and UI prototyping.
It contains **938 narrative TXT documents** plus **structured CSV datasets** for meds, labs, vitals, EPs, contentions, ratings, and appointments.

## Major Components
- `manifest.csv` / `manifest.jsonl` / `manifest.sqlite` — Master index for your pipelines.
- Rich category tree (01–23) — STRs, Personnel, CAPRI, DBQs, Decisions, SOC/SSOC, BVA, Imaging, Dental, Audiology, etc.
- Structured datasets: `17_Pharmacy/pharmacy_medications.csv`, `18_Labs/lab_results.csv`, `19_Vitals/vitals.csv`, `16_Claims_Workflow/end_products.csv`, `16_Claims_Workflow/contentions.csv`, `15_Financial_Awards/ratings_history.csv`, `13_Misc_Admin/appointments.csv`
- `packets.json` — Example groupings to simulate packet-based submissions.

## Notes
- Documents simulate scan artifacts (e.g., skew, coffee stain) and CAPRI formatting.
- Some items are marked as redacted; treat accordingly in your UI logic.
- All identifiers are fake. Any resemblance to real persons is coincidental.

## Suggested Scenarios
1. **Evidence Timeliner**: build a chronological viewer from `manifest.*` and link to content.
2. **Contention Mapper**: join `contentions.csv` with decision documents to visualize outcomes.
3. **Health Trends**: chart A1c/BP from labs/vitals to demo clinical correlation.
4. **Packet Review**: use `packets.json` to simulate claim/appeal/remand packets.
