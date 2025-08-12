# SkinZAI VBMS — Starter Kit (v2)

A **revised, extensive** starter package for a SkinZAI‑style VBMS clone (synthetic data only). This version adds:
- **Postgres-backed API** (SQLAlchemy), not just in-memory.
- **Seed script** to ingest your mock bundles:
  - `QBit_Mock_eFolder_V2_MAX.zip`
  - `QBit_Unstructured_Scans_MEGA.zip`
  Uploads files to **MinIO** (S3) and creates Document/Claim records in Postgres.
- **Expanded docs & templates**, eFolder list page, and utility scripts.

## Quickstart

1) Place your ZIPs in `./data/` (optional but recommended):
   - `QBit_Mock_eFolder_V2_MAX.zip`
   - `QBit_Unstructured_Scans_MEGA.zip`
2) Create env:
```bash
cp .env.example .env
```
3) Launch stack:
```bash
docker compose up -d --build
```
4) Seed (optional):
```bash
docker compose exec api python -m seeds.ingest_from_zips --zips /app/data/QBit_Mock_eFolder_V2_MAX.zip,/app/data/QBit_Unstructured_Scans_MEGA.zip
```
5) Open:
- UI: http://localhost:3000
- API: http://localhost:8000/docs
- MinIO console: http://localhost:9001 (user: `minio`, pass: `minio123`)

> **Synthetic data only.** The viewer/exporter watermark “Synthetic Data” is expected.
