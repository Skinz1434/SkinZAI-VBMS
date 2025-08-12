# Observability & Ops Pack (v1)

Adds **Prometheus + Grafana** with ready dashboards, plus a lightweight **Backup job** that dumps Postgres to MinIO.
Includes minimal OpenTelemetry setup snippets for API & ML.

## Bring it up
```bash
docker compose -f docker-compose.yml -f docker-compose.observability.yml up -d
```

## Backup
Container `db-backup` runs nightly (UTC 02:00) and writes `postgres/backup-YYYYmmdd.sql.gz` to MinIO.
Restore instructions in this README.

> For production: secure Grafana, tune retention, and add alertmanager.
