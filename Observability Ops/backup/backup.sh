#!/usr/bin/env bash
set -euo pipefail

PGURL="${DATABASE_URL:-postgresql://skinzai:skinzai@db:5432/skinzai}"
S3_ENDPOINT="${S3_ENDPOINT:-http://minio:9000}"
S3_ACCESS_KEY="${S3_ACCESS_KEY:-minio}"
S3_SECRET_KEY="${S3_SECRET_KEY:-minio123}"
S3_BUCKET="${S3_BUCKET:-efolder}"

STAMP=$(date -u +%Y%m%d)
OUT="/tmp/backup-$STAMP.sql.gz"
pg_dump "$PGURL" | gzip -9 > "$OUT"

# install mc (minio client) on the fly
wget -q https://dl.min.io/client/mc/release/linux-amd64/mc -O /usr/local/bin/mc
chmod +x /usr/local/bin/mc
mc alias set local "$S3_ENDPOINT" "$S3_ACCESS_KEY" "$S3_SECRET_KEY"
mc cp "$OUT" local/$S3_BUCKET/postgres/
echo "Backup uploaded: postgres/backup-$STAMP.sql.gz"
