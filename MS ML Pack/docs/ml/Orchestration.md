# Multi‑Agent Orchestration (Design)

**Agents**
1) **ClusterAgent (Leiden)** — builds a doc similarity graph; runs Leiden; emits clusters.
2) **DiagnosticAgent (XGBoost)** — predicts top DCs + confidence per cluster; optional rating %.
3) **RationaleAgent (Explainability)** — templated "why" using feature contributions; cites docs.
4) **QualityAgent (Policy & QA)** — checks for conflicts (pyramiding hints, missing evidence, stale dates).

**Orchestrator**
- **Celery** tasks: `cluster_docs` → `score_dcs` → `generate_explanations` → `quality_checks`
- **Broker**: RabbitMQ (already in Starter Kit). Results posted back to API or returned to caller.

**Data Flow**
- Input: `ClaimContext { claim_id, contentions?, documents[] }`
- Embeddings: transform docs(text + type + tags) → vectors; build kNN graph.
- Clustering: apply Leiden; name clusters by top TF‑IDF terms + doc types.
- Scoring: aggregate cluster features; run XGBoost → {dc, confidence, rating%?}
- Explain: extract top SHAP‑like contributions (mocked or real) + key docs list.
- QA: rule checks; produce warnings/errors.

**Modes**
- **Shadow** — only log suggestions; no UI hints.
- **Assist** — UI shows suggestions side‑by‑side with manual flow.
- **Active** — pre‑fills Decision Builder (guarded).

**Events**
- `ml.clustered`, `ml.scored`, `ml.explained`, `ml.qa_done` — publish/subscribe for future automation.
