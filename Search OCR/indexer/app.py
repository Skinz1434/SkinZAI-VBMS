from fastapi import FastAPI
from pydantic import BaseModel
from .env import OS_HOST, INDEX
from opensearchpy import OpenSearch
import json, os

app = FastAPI(title="Indexer", version="1.0.0")
os_client = OpenSearch(OS_HOST, http_compress=True, timeout=30)

def ensure_index():
    if not os_client.indices.exists(INDEX):
        with open(os.path.join(os.path.dirname(__file__),"mappings.json"),"r") as f:
            body = json.load(f)
        os_client.indices.create(INDEX, body=body)
ensure_index()

class DocIndex(BaseModel):
    id: str
    participant_id: str|None=None
    claim_id: str|None=None
    doc_type: str|None=None
    source: str|None=None
    received_date: str|None=None
    doc_date: str|None=None
    tags: list[str]|None=None
    text: str|None=None
    path: str

@app.post("/index/document")
def index_document(body: DocIndex):
    os_client.index(index=INDEX, id=body.id, document=body.model_dump())
    return {"ok": True}
