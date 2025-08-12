# Decision Builder & Code Sheet Pack (v1)

Delivers a **three-column Decision Builder UI** and a **Code Sheet microservice** that generates a PDF.
Includes a small **rules file** for validation (mock) and a **compose overlay**.

## UI (Next.js)
Copy `web/app/decisions/[claimId]/page.tsx` into your app.

## Code Sheet Service
Runs on :8084. Endpoint:
- `POST /codesheet/render` → returns a PDF (application/pdf) with ratings table.

## Bring it up
```bash
docker compose -f docker-compose.yml -f docker-compose.codesheet.yml up -d --build
```
