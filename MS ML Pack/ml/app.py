from fastapi import FastAPI, Body
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from .orchestrator import run_pipeline_sync
from .agents.leiden_agent import demo_sample_result
from .training.train import train_models

app = FastAPI(title="SkinZAI ML", version="1.0.0")

class DocIn(BaseModel):
    id: str
    doc_type: str
    text: Optional[str] = None
    tags: Optional[List[str]] = None
    received_date: Optional[str] = None
    source: Optional[str] = None

class ClaimContext(BaseModel):
    claim_id: Optional[str] = None
    documents: List[DocIn]

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/infer/claim")
def infer_claim(ctx: ClaimContext):
    return run_pipeline_sync(ctx.model_dump())

@app.post("/infer/sample")
def infer_sample():
    return demo_sample_result()

@app.post("/train")
def train(mock: int = 1):
    metrics = train_models(mock=bool(mock))
    return {"ok": True, "metrics": metrics}
