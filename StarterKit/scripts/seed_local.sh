#!/usr/bin/env bash
set -euo pipefail
docker compose exec api python -m seeds.ingest_from_zips --zips /app/data/QBit_Mock_eFolder_V2_MAX.zip,/app/data/QBit_Unstructured_Scans_MEGA.zip
echo 'Seed import complete.'
