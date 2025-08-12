from typing import Dict, Any
def train_models(mock: bool = True) -> Dict[str, Any]:
    # Placeholder: in a real setup, fit XGBoost classifiers and persist to /models
    # Here we just return toy metrics
    return {"macro_f1": 0.77 if mock else 0.0, "note": "mock training complete"}
