# SkinZAI VBMS — Seeds Pack (v1)

A dedicated package for **seeding End Products (EPs)**, **contentions** with **diagnostic codes (DCs)**,
and **proper claims flows** (tasks, letters, decisions, awards) using **synthetic data**.
Designed to drop into the **Starter Kit v2** (`/api` folder).

> Note: EP code meanings here are **synthetic approximations for training**; they are not official VA definitions.

## What this includes
- **Catalogs**: `data/catalog/*.json` — EP types, Diagnostic Codes, Document Types
- **Docs**: detailed EP flows, DC mapping, and data dictionary (`docs/seeds/*.md`)
- **Seed script**: `api/seeds/seed_ep_claims.py` — creates Participants/Claims/Contentions/Tasks/Decisions/Awards
  and tags imported documents to contentions.
- **Helper**: uploads tiny placeholder PDFs (letters, decisions) to MinIO for a fully clickable demo.

## How to use (with Starter Kit v2)
1) Copy the contents of this zip into your v2 repo root (it will place files under `api/` and `docs/`).
2) Bring up the stack (if not already): `docker compose up -d --build`
3) (Optional) Import your big document zips first:
   ```bash
   docker compose exec api python -m seeds.ingest_from_zips --zips /app/data/QBit_Mock_eFolder_V2_MAX.zip,/app/data/QBit_Unstructured_Scans_MEGA.zip
   ```
4) Seed claims & flows:
   ```bash
   docker compose exec api python -m seeds.seed_ep_claims --participants 3 --claims-per-ep 2 --finalize 1
   ```
   - `--participants`: create if fewer exist (default 3)
   - `--claims-per-ep`: how many per EP type (010, 020, 040, 110, 400)
   - `--finalize`: proportion (0–1) of claims to progress to decision/award

Open UI → `http://localhost:3000` and explore **Claims**, **eFolder** (letters, decisions), and **Tasks**.
