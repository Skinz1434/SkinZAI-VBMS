# Model Card — Leiden + XGBoost (Demo)

**Intended Use**: Suggest diagnostic codes and cluster evidence in a training/demo environment with synthetic data.

**Data**: Synthetic documents from Seeds Pack; labels derived from the DC catalog. No real PII/PHI.

**Features**
- Document features: type one‑hots, OCR keywords (tf‑idf), recency, source.
- Cluster features: doc type counts, avg recency, presence of DBQs/imaging per category.
- Text vectors: sentence embeddings (falls back to stable hashing vectors if embeddings unavailable).

**Models**
- **Leiden clustering** over kNN graph of doc vectors.
- **XGBoost** classifiers (one‑vs‑rest for DC categories) and optional regressor for % level.

**Metrics (demo)**
- Macro‑F1 on synthetic holdout; not meaningful for production policy.
- Calibrated confidence via Platt scaling (optional).

**Limitations**
- Trained on synthetic data; not representative of real‑world distributions.
- Explanations are template‑based unless SHAP is enabled.
- Never finalize decisions without human review.

**Ethics & Safety**
- No real PII; watermark exports.
- A/B gating with shadow mode to prevent silent automation.
