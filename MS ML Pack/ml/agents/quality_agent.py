from typing import List, Dict, Any

def run_quality_checks(clusters, diagnostics):
    # Demo rules: missing DBQ for knee/spine; low confidence; conflicting clusters
    issues = []
    for d in diagnostics:
        if d["confidence"] < 0.6:
            issues.append({"cluster_id": d["cluster_id"], "level":"warn", "msg":"Low confidence suggestion"})
        if d["suggested_dc"] in ("5258","5237") and d["suggested_percent"] >= 60:
            issues.append({"cluster_id": d["cluster_id"], "level":"info", "msg":"Consider staged ratings if severity fluctuates"})
    return issues
