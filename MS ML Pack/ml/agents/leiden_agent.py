from typing import List, Dict, Any
import numpy as np

def _hash_embed(text: str, dim: int = 64) -> np.ndarray:
    # Stable faux-embedding for demo (no external models)
    rng = np.random.default_rng(abs(hash(text)) % (2**32))
    v = rng.normal(0, 1, size=dim)
    v /= (np.linalg.norm(v) + 1e-9)
    return v

def _vectorize_docs(docs: List[Dict[str, Any]]) -> np.ndarray:
    vecs = []
    for d in docs:
        key = (d.get("text") or d.get("doc_type") or "doc")
        vecs.append(_hash_embed(key, 64))
    return np.vstack(vecs)

def _leiden_clusters_from_knn(X: np.ndarray, k: int = 4) -> List[List[int]]:
    try:
        import igraph as ig
        import leidenalg as la
        # kNN: cosine sim -> edges
        sim = X @ X.T
        np.fill_diagonal(sim, -1)
        edges = []
        for i in range(sim.shape[0]):
            nbrs = np.argsort(sim[i])[::-1][:k]
            for j in nbrs:
                if i < j:
                    edges.append((i, j, float(sim[i, j])))
        g = ig.Graph()
        g.add_vertices(X.shape[0])
        if edges:
            g.add_edges([(i, j) for i,j,_ in edges])
            g.es["weight"] = [w for _,_,w in edges]
        part = la.find_partition(g, la.RBConfigurationVertexPartition, weights="weight", resolution_parameter=1.0)
        clusters = [list(c) for c in part]
        return clusters if clusters else [list(range(X.shape[0]))]
    except Exception:
        # Fallback to naive 2-cluster split
        mid = X.shape[0]//2 or 1
        return [list(range(0, mid)), list(range(mid, X.shape[0]))]

def cluster_documents(docs: List[Dict[str, Any]]):
    X = _vectorize_docs(docs)
    idx_clusters = _leiden_clusters_from_knn(X, k=4)
    clusters = []
    for cid, idxs in enumerate(idx_clusters):
        members = [docs[i] for i in idxs]
        # simple label: majority doc_type
        types = [d.get("doc_type","Unknown") for d in members]
        label = max(set(types), key=types.count) if types else "Cluster"
        clusters.append({
            "cluster_id": f"C{cid+1}",
            "label": label,
            "members": [m["id"] for m in members],
            "centroid": np.mean(X[idxs], axis=0).tolist()
        })
    return {"clusters": clusters}

def demo_sample_result():
    docs = [
        {"id":"d1","doc_type":"DBQ Knee","text":"left knee meniscal tear; pain; popping; MRI shows medial meniscus"},
        {"id":"d2","doc_type":"MRI Knee","text":"meniscal tear and effusion"},
        {"id":"d3","doc_type":"Orthopedics Note","text":"instability with positive McMurray"},
        {"id":"d4","doc_type":"DBQ Back","text":"lumbar strain with spasms and limited ROM"},
        {"id":"d5","doc_type":"Radiology Report","text":"degenerative changes L4-L5"},
        {"id":"d6","doc_type":"DBQ Mental","text":"PTSD symptoms; nightmares; hypervigilance"},
    ]
    cl = cluster_documents(docs)
    # attach naive DC scoring for demo
    from .xgb_agent import score_clusters
    scored = score_clusters(docs, cl["clusters"])
    return {"clusters": cl["clusters"], "diagnostics": scored}
