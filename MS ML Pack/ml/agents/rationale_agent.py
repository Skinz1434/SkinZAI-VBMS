from typing import List, Dict, Any

def build_explanations(clusters, diagnostics, docs_by_id):
    out = []
    dmap = {d["cluster_id"]: d for d in diagnostics}
    for c in clusters:
        d = dmap.get(c["cluster_id"])
        if not d:
            continue
        key_docs = [docs_by_id[mid] for mid in c["members"][:3] if mid in docs_by_id]
        out.append({
            "cluster_id": c["cluster_id"],
            "dc": d["suggested_dc"],
            "why": d["reasons"],
            "key_docs": [{"id": k["id"], "doc_type": k.get("doc_type","")} for k in key_docs]
        })
    return out
