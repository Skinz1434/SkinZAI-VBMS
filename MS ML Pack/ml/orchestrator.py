from typing import Dict, Any
from .agents.leiden_agent import cluster_documents
from .agents.xgb_agent import score_clusters
from .agents.rationale_agent import build_explanations
from .agents.quality_agent import run_quality_checks

def run_pipeline_sync(ctx: Dict[str, Any]):
    docs = ctx["documents"]
    cl = cluster_documents(docs)
    diags = score_clusters(docs, cl["clusters"])
    expl = build_explanations(cl["clusters"], diags, {d["id"]: d for d in docs})
    qa = run_quality_checks(cl["clusters"], diags)
    return {"clusters": cl["clusters"], "diagnostics": diags, "explanations": expl, "qa": qa}
