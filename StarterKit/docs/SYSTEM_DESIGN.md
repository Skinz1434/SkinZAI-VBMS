# SYSTEM_DESIGN (v2 highlights)

- **API:** FastAPI + SQLAlchemy; DB session middleware, typed DTOs; creates tables at startup.
- **Storage:** MinIO (S3-compatible). Seed script creates bucket if missing and uploads files.
- **Seeds:** Ingests manifest rows from your ZIPs; links docs to a small set of demo participants/claims.
- **UI:** Next.js pages for Dashboard, Search, Claims, and eFolder (list with filters).

## ERD (core tables)

participants (id, file_number, first_name, last_name, dob, poa, flags[])
claims (id, participant_id, ep_type, lane, jurisdiction, status, opened_at, closed_at)
contentions (id, claim_id, title, basis, indicators[], dc_suggested, status)
documents (id, participant_id, claim_id nullable, doc_type, source, received_date, doc_date, path, ocr, tags[])
doc_links (id, document_id, contention_id)
tasks (id, claim_id, type, status, assignee, due_at, created_at)
decisions (id, claim_id, narrative_path, codesheet_json, finalized_at, author_id)
ratings (id, decision_id, contention_id, dc, percent, effective_date, bilateral)
awards (id, claim_id, decision_id, combined_percent, monthly_amount, transmitted_at)
correspondence (id, claim_id, title, template, path, sent_at, delivery)
audit_events (id, actor_id, object_type, object_id, action, at, before_json, after_json)
users (id, email, role, ro_code)

## Data flow (seed ingestion)
ZIP -> read manifest.csv -> upload each file to S3 (MinIO) under /efolder/{zip_basename}/... -> insert Document row with metadata.
Distribute documents across 3 demo Participants and Claims for a realistic UI.
