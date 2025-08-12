import os, requests
from .db import SessionLocal
from . import models
from .celery_app import celery

OCR_URL = os.getenv("OCR_URL", "http://ocr:8082")
INDEXER_URL = os.getenv("INDEXER_URL", "http://indexer:8083")
OS_INDEX = os.getenv("OS_INDEX", "documents")

@celery.task(name="ocr_and_index")
def ocr_and_index(doc_id: str):
    """Fetch Document by id -> OCR (via OCR service) -> Index (via Indexer) -> mark ocr=True."""
    db = SessionLocal()
    try:
        doc = db.get(models.Document, doc_id)
        if not doc:
            return {"ok": False, "id": doc_id, "error": "Document not found"}
        s3_key = doc.path
        # OCR
        r = requests.post(f"{OCR_URL}/ocr/run", json={"s3_key": s3_key}, timeout=180)
        r.raise_for_status()
        ocr = r.json()
        text = ocr.get("text", "")

        # Index
        payload = {
            "id": doc.id,
            "participant_id": doc.participant_id,
            "claim_id": doc.claim_id,
            "doc_type": doc.doc_type,
            "source": doc.source,
            "received_date": str(doc.received_date) if getattr(doc,'received_date',None) else None,
            "doc_date": str(doc.doc_date) if getattr(doc,'doc_date',None) else None,
            "tags": getattr(doc,'tags',[]) or [],
            "text": text,
            "path": doc.path
        }
        r2 = requests.post(f"{INDEXER_URL}/index/document", json=payload, timeout=120)
        r2.raise_for_status()

        # Mark ocr True
        if hasattr(doc, 'ocr'):
            doc.ocr = True
            db.add(doc); db.commit()
        return {"ok": True, "id": doc.id, "page_count": ocr.get("page_count")}
    except Exception as e:
        db.rollback()
        return {"ok": False, "id": doc_id, "error": str(e)}
    finally:
        db.close()
