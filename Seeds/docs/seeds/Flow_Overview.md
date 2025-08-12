# Flow Overview — Tasks, Letters, Packets

## Task templates (seeded)
- `dev_request_records` — request STR/VHA/private records
- `order_exam` — C&P exam order with DBQ type
- `review_evidence` — verify new evidence satisfies DTA
- `rate_issue` — rater task to apply DC/%/ED
- `quality_review` — optional quality gate
- `award_finalize` — compute award snapshot
- `correspondence_send` — mail/portal deliver letter

## Letters (as documents)
- `VCAA_DTA_Notice.pdf` — sent at development start
- `Exam_Scheduling.pdf` — clinic & date (mock)
- `Decision_Letter.pdf` — outcome summary
- `SOC_SSOC_Cover.pdf` — for supplemental/admin actions (mock)

## Packets (ideas for future seeds)
- `Initial_Evidence_Packet` — STRs + initial DBQs
- `Exam_Packet` — C&P results + imaging
- `Decision_Packet` — narrative + code sheet + notice

The seed script uploads tiny placeholder PDFs to MinIO (S3) so these docs are downloadable in the UI.
