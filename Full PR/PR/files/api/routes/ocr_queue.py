from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from ..db import SessionLocal
from .. import models
from ..celery_tasks import ocr_and_index
from celery.result import AsyncResult
import os

router = APIRouter(prefix="/ocr", tags=["ocr-queue"])

class EnqueueReq(BaseModel):
    document_id: str

@router.post("/enqueue")
def enqueue(body: EnqueueReq):
    db = SessionLocal()
    try:
        doc = db.get(models.Document, body.document_id)
        if not doc:
            raise HTTPException(404, "Document not found")
        task = ocr_and_index.apply_async(args=[doc.id])
        return {"task_id": task.id, "document_id": doc.id}
    finally:
        db.close()

@router.post("/enqueue_claim/{claim_id}")
def enqueue_claim(claim_id: str):
    db = SessionLocal()
    try:
        docs = list(db.query(models.Document).filter(models.Document.claim_id == claim_id))
        if not docs:
            raise HTTPException(404, "No documents for claim")
        tasks = [ocr_and_index.apply_async(args=[d.id]).id for d in docs]
        return {"claim_id": claim_id, "count": len(tasks), "task_ids": tasks[:10] + (["..."] if len(tasks)>10 else [])}
    finally:
        db.close()

@router.get("/status/{task_id}")
def status(task_id: str):
    res = AsyncResult(task_id)
    return {"task_id": task_id, "state": res.state, "result": res.result if res.ready() else None}
