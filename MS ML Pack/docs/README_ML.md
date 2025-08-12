# SkinZAI VBMS — ML Pack (v1)

A plug‑in ML microservice to showcase **Leiden clustering + XGBoost diagnostics** with **multi‑agent orchestration**.
Designed to snap onto the Starter Kit v2 via a compose overlay.

**Goals**
- Cluster eFolder documents by topic/issue using **Leiden** (graph communities).
- Predict **Diagnostic Codes (DCs)** and **rating % suggestions** via **XGBoost**.
- Orchestrate multi‑stage inference with agents (Cluster → Diagnose → Explain → QA).
- Surface a **SkinZAI‑styled UI** that makes the uplift *obvious* (clusters, confidences, why).

> All data is synthetic. This is a demo system; not for real adjudication.

## Quickstart

1) Copy this folder into your repo root (it introduces `ml/` and `docs/ml/`).
2) Bring up the ML service + worker:
```bash
docker compose -f docker-compose.yml -f docker-compose.ml.yml up -d --build
```
3) Train a quick toy model (uses mock vectors if no embeddings available):
```bash
docker compose exec ml python -m training.train --mock 1
```
4) Try a sample inference:
```bash
curl -X POST http://localhost:8088/infer/sample | jq
```
5) Open the **Diagnostics** UI page (Next.js):
- Copy `web/app/diagnostics/page.tsx` into your web app and navigate to `/diagnostics`.

## Integration (API)
- `/agents/run_diagnostic` — kicks off the full multi‑agent pipeline (async).
- `/infer/claim` — synchronous: pass claim+docs JSON, get clusters + DC suggestions.
- `/infer/sample` — returns a synthetic demo payload for UI wiring.
- `/train` — optional endpoint to train/retrain (mock or real).

See `docs/ml/Orchestration.md` and `docs/ml/Model_Card.md` for details.
