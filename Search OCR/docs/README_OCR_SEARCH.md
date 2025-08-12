# Search & OCR Pack (v1)

Adds **OpenSearch + Dashboards** and an **OCR API + Indexer**:
- `ocr/` service: turns PDFs/images from MinIO into text (Tesseract) and emits JSON.
- `indexer/` service: indexes metadata + OCR text into OpenSearch (`documents` index).
- Compose overlay spins up OpenSearch + Dashboards.

> Heavy dependencies (tesseract/poppler) are installed in the OCR Dockerfile.

## Bring it up
```bash
docker compose -f docker-compose.yml -f docker-compose.search-ocr.yml up -d --build
```

## Workflow
1) Call OCR: `POST /ocr/run` with `{ s3_key }` → returns `{ text, page_count }`.
2) Call Indexer: `POST /index/document` with document metadata and `text` to index into OpenSearch.

You can also wire queue-based flows later (ocr.request → ocr.result → index.refresh).
