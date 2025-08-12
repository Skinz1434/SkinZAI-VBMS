# Auth & RBAC Pack (v1)

Adds a small **Auth service** (FastAPI) issuing JWTs, demo user store in Postgres, and a drop-in **middleware** for your main API.
Includes a simple **Login page** for the web app and a **compose overlay**.

## Bring it up
```bash
docker compose -f docker-compose.yml -f docker-compose.auth.yml up -d --build
```

## Endpoints (Auth @ :8081)
- `POST /register` { email, password, role } — demo only
- `POST /login` { email, password } → { access_token, token_type }
- `GET /introspect` Authorization: Bearer → user claims

## Integrate with API
1) Copy `api_middleware/auth_mw.py` into your API service under `api/middleware/`.
2) In `api/main.py` add:
```python
from .middleware.auth_mw import auth_dependency
@app.get("/me")(lambda current_user=Depends(auth_dependency): current_user)
```
3) Protect any route by adding `current_user=Depends(auth_dependency)`.

## Frontend
Copy `web/app/login/page.tsx` into your Next.js app. It saves JWT in `localStorage` and sets `Authorization` header for fetches.

> Demo‑grade only. For real deployments, wire SSO/OIDC and refresh tokens.
