from fastapi import FastAPI
from pydantic import BaseModel
from .env import S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET
from minio import Minio
import tempfile, os, pytesseract, json
from pdf2image import convert_from_path

app = FastAPI(title="OCR Service", version="1.0.0")

def minio_client():
    import urllib.parse as up
    ep = up.urlparse(S3_ENDPOINT)
    secure = ep.scheme == "https"
    host = ep.netloc
    return Minio(host, access_key=S3_ACCESS_KEY, secret_key=S3_SECRET_KEY, secure=secure)

class OCRReq(BaseModel):
    s3_key: str

@app.post("/ocr/run")
def ocr_run(body: OCRReq):
    cli = minio_client()
    with tempfile.TemporaryDirectory() as td:
        loc = os.path.join(td, "doc.pdf")
        cli.fget_object(S3_BUCKET, body.s3_key, loc)
        pages = convert_from_path(loc, dpi=200)
        texts = []
        for p in pages:
            texts.append(pytesseract.image_to_string(p))
        return {"key": body.s3_key, "page_count": len(texts), "text": "\n\n".join(texts)}
