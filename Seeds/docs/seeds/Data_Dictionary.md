# Data Dictionary (seed-relevant)

**Participants**: id, file_number, name, dob, poa, flags[]  
**Claims**: id, participant_id, ep_type, lane, jurisdiction, status, opened_at  
**Contentions**: id, claim_id, title, basis, indicators[], dc_suggested, status  
**Documents**: id, participant_id, claim_id?, doc_type, source, received_date, doc_date, path (S3 key), ocr, tags[]  
**Tasks**: id, claim_id, type, status, assignee, due_at  
**Decisions**: id, claim_id, narrative_path?, codesheet_json?, finalized_at?  
**Awards**: id, claim_id, decision_id?, combined_percent, monthly_amount, transmitted_at?  
**AuditEvents**: id, actor_id, object_type, object_id, action, at, before_json, after_json

**Linking strategy:** This Starter DB lacks a `doc_links` table; the seed script **adds content‑links via `Document.tags`** using `contention:CTN-...` markers.
