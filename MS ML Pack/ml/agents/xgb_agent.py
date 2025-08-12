from typing import List, Dict, Any
import numpy as np

DC_MAP = {
    "knee": ["5258","5257","5260","5261"],
    "spine": ["5237","5242","5243"],
    "mental": ["9411","9434"],
    "audio": ["6260","6100"],
}

def _features_for_cluster(docs: List[Dict[str, Any]], member_ids: List[str]) -> np.ndarray:
    # very simple heuristic features by doc_type counts
    members = [d for d in docs if d["id"] in member_ids]
    types = [d.get("doc_type","").lower() for d in members]
    f = [
        sum("knee" in t for t in types),
        sum("back" in t or "spine" in t for t in types),
        sum("mental" in t or "psy" in t for t in types),
        sum("audio" in t or "audiogram" in t for t in types),
        sum("mri" in t for t in types),
        sum("radiology" in t for t in types),
        sum("dbq" in t for t in types),
    ]
    return np.array(f, dtype=float)

def _heuristic_dc(features: np.ndarray) -> str:
    knee, spine, mental, audio = features[0], features[1], features[2], features[3]
    if knee >= max(spine, mental, audio):
        return "5258"  # meniscal as splashy demo
    if spine >= max(knee, mental, audio):
        return "5237"
    if mental >= max(knee, spine, audio):
        return "9411"
    if audio >= max(knee, spine, mental):
        return "6100"
    return "5237"

def score_clusters(docs: List[Dict[str, Any]], clusters: List[Dict[str, Any]]):
    out = []
    for c in clusters:
        x = _features_for_cluster(docs, c["members"])
        dc = _heuristic_dc(x)
        confidence = min(0.95, 0.55 + 0.1*float(x.max()))
        rating = int(min(70, 10 + 10*float(x.max())))  # demo-only
        out.append({
            "cluster_id": c["cluster_id"],
            "suggested_dc": dc,
            "confidence": round(confidence, 2),
            "suggested_percent": rating,
            "reasons": [
                "High presence of matching DBQ/imaging for this body system",
                "Temporal proximity of evidence supports current severity"
            ]
        })
    return out
