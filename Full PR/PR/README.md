# Full PR — ML Assist → Ratings + OCR Queue + Vercel Proxy

This PR bundle contains:
1) **Decision Builder upgrade**: ML Assist results can be **applied** to the Ratings table.
2) **OCR/Index Queue**: Celery worker that calls your OCR & Indexer services and updates Document.ocr.
3) **Vercel-friendly UI bits**: API/ML proxy routes, theme, header, tour (included for convenience).

## Apply steps
```bash
git checkout -b feat/full-demo-pr
# Copy PR/files/* into your repo (see structure below)
git add .
git commit -m "feat: ML Assist apply + OCR queue + Vercel proxy"
git push origin feat/full-demo-pr
```

## Where to copy
- `PR/files/web/*` → your Next.js app (e.g., `web/` or `StarterKit/web/`)
- `PR/files/api/*` → your API service directory (e.g., `api/`)
- `PR/files/workers/*` → repo root under `workers/`
- `PR/files/docker-compose.search-ocr-queue.yml` → repo root

## API changes required
Append to `api/requirements.txt` (if not present already):
```
celery==5.3.6
requests==2.31.0
```

In `api/main.py`, mount the router:
```python
from .routes import ocr_queue as ocr_queue_router
app.include_router(ocr_queue_router.router)
```

## Bring up services (local)
```bash
# Core + ML
docker compose up -d --build
docker compose -f docker-compose.yml -f docker-compose.ml.yml up -d --build

# OCR + Search (from your earlier pack)
docker compose -f docker-compose.yml -f docker-compose.search-ocr.yml up -d --build

# Queue worker (this PR)
docker compose -f docker-compose.yml -f docker-compose.search-ocr.yml -f docker-compose.search-ocr-queue.yml up -d --build
```

## Env (local)
```
BROKER_URL=amqp://guest:guest@rabbitmq:5672//
RESULT_BACKEND=rpc://
DATABASE_URL=postgresql://skinzai:skinzai@db:5432/skinzai
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio123
S3_BUCKET=efolder
OCR_URL=http://ocr:8082
INDEXER_URL=http://indexer:8083
OS_HOST=http://opensearch:9200
OS_INDEX=documents
CORS_ORIGINS=http://localhost:3000
```

## Use it
- Go to `/decisions/<claimId>` → click **Analyze** (ML) → click **Apply suggestions** → generate Code Sheet PDF.
- OCR queue:
  - `POST http://localhost:8000/ocr/enqueue {"document_id":"<DOC-ID>"}`
  - or `POST http://localhost:8000/ocr/enqueue_claim/<CLAIM-ID>`
  - watch: `docker compose logs -f queueworker`

All code is synthetic-demo grade and adjusts safely if optional services are absent.
