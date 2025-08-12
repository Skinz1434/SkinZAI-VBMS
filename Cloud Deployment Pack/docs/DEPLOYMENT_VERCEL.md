# Cloud Deployment — Vercel (Web) + Managed Backends

This guide assumes:
- Web (Next.js) on **Vercel**
- Backends on **Railway** or **Render** (Docker)
- Managed services:
  - **Postgres**: Neon (or Railway/Render Postgres)
  - **Object storage**: Cloudflare R2 (S3-compatible) or AWS S3
  - **Queue**: CloudAMQP (RabbitMQ)
  - **Search**: Elastic Cloud / Bonsai / Meilisearch (optional alternative to OpenSearch)

## 0) Prereqs
- GitHub repo (connect to Vercel)
- Docker installed locally (for testing)
- Accounts: Vercel, Neon, Cloudflare R2, CloudAMQP, Elastic Cloud (or Meilisearch host)

## 1) Configure env (single source of truth)
Create `/env/.cloud.example` and copy to your secret managers:
```
# API
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
S3_ENDPOINT=https://<r2-account-id>.r2.cloudflarestorage.com
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_BUCKET=efolder
CORS_ORIGINS=https://<your-vercel-domain>.vercel.app,https://<custom-domain>

# ML
BROKER_URL=amqps://<cloudamqp-uri>
RESULT_BACKEND=rpc://
API_URL=https://<api-domain>

# SEARCH (if using OpenSearch/Elastic)
OS_HOST=https://<elastic-host>  # or http://opensearch:9200 for self-hosted
OS_INDEX=documents
```

On **Vercel → Project Settings → Environment Variables**, set:
```
NEXT_PUBLIC_API_URL=/api/proxy   # use our proxy route
API_URL=https://<api-domain>     # server-side proxy target
NEXT_PUBLIC_ML_URL=https://<ml-domain>  # optional direct calls
NEXT_PUBLIC_SEARCH_URL=https://<search-ui>   # optional dashboards
```

## 2) Replace MinIO with R2/S3 (recommended)
- Keep the same keys: `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET`.
- In R2, create a bucket `efolder` and an API token; paste into your API service env.

## 3) Deploy backends (Railway/Render)
Choose **Railway** (fast) or **Render** (simple):

### Railway (Docker) quick template
1) Create a new Railway project → "Empty".
2) Add services by Docker repos:
   - `api/` → port 8000
   - `ml/` → port 8088
   - (optional) `ocr/` → 8082, `indexer/` → 8083, `codesheet/` → 8084, `correspondence/` → 8085
3) Add **Variables** for each service from `/env/.cloud.example`.
4) Add **Neon Postgres** plugin and **CloudAMQP** URL.
5) Deploy. Note the public URLs.

### Render (render.yaml included)
```
render.yaml
├─ services:
│  ├─ api (Docker)   -> 8000
│  ├─ ml  (Docker)   -> 8088
│  ├─ codesheet      -> 8084
│  ├─ correspondence -> 8085
│  ├─ indexer        -> 8083
│  └─ ocr            -> 8082
```
Create new **Blueprint** from `infra/render.yaml` and deploy.

## 4) Frontend on Vercel
- Push your repo; connect Vercel to GitHub.
- Ensure `NEXT_PUBLIC_API_URL=/api/proxy` and `API_URL` points to your API base.
- In **Build & Output Settings**, the framework is Next.js. No special config needed.

## 5) Proxy route (avoids CORS headaches)
Use `web/app/api/proxy/[...path]/route.ts` (included) so the browser calls `/api/proxy/*` and the edge function forwards to your API using `API_URL`.

## 6) After deploy: seed the cloud
From your laptop, call the seed endpoints remotely (replace API host):
```
curl -X POST https://<api-domain>/decisions -H 'Content-Type: application/json' -d '{"claim_id":"smoke"}' || true

# or shell into API container and run:
docker compose exec api python -m seeds.ingest_from_zips --zips /app/data/QBit_Mock_eFolder_V2_MAX.zip
docker compose exec api python -m seeds.seed_ep_claims --participants 3 --claims-per-ep 2 --finalize 1
```
For managed storage (R2), upload sample docs via the R2 console first, or run a one-off job container to push sample PDFs.

## 7) Nice-to-haves
- Custom domain on Vercel
- Grafana Cloud for hosted dashboards
- GHCR for Docker images + Render/Railway auto-deploy
- Preview environments: Vercel handles web previews; point them to `API_PREVIEW_URL` if you spin preview backends
