# Security & Compliance (demo posture)

- **Synthetic only**: all seeded participants, claims, contentions, and letters are fictitious. Watermark your viewers/exports.
- **RBAC**: create demo users per role in future seeds (VSR/RVSR/Coach/VSO/Admin).  
- **Audit**: seed writes create AuditEvents for key objects.  
- **Storage**: placeholder letters/decisions are uploaded to MinIO with random names; signed URL access recommended in production.
- **PII hygiene**: logs avoid full names by default; toggles to enable for test data only.
