from fastapi import FastAPI, Response
from pydantic import BaseModel
from jinja2 import Environment, FileSystemLoader
from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
from io import BytesIO
from .env import S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET
from minio import Minio
from pypdf import PdfReader, PdfWriter
import tempfile, os, datetime

env = Environment(loader=FileSystemLoader("templates"))
app = FastAPI(title="Correspondence & Packet", version="1.0.0")

def minio_client():
    import urllib.parse as up
    ep = up.urlparse(S3_ENDPOINT)
    secure = ep.scheme == "https"
    host = ep.netloc
    return Minio(host, access_key=S3_ACCESS_KEY, secret_key=S3_SECRET_KEY, secure=secure)

class LetterReq(BaseModel):
    template: str
    variables: dict

@app.post("/letters/render")
def render_letter(req: LetterReq):
    tpl = env.get_template(req.template)
    if "date" not in req.variables:
        req.variables["date"] = datetime.date.today().isoformat()
    text = tpl.render(**req.variables)
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=LETTER)
    y = 740
    for line in text.splitlines():
        c.drawString(72, y, line)
        y -= 16
        if y < 72:
            c.showPage(); y = 740
    c.showPage(); c.save()
    pdf = buf.getvalue()
    return Response(content=pdf, media_type="application/pdf")

class PacketReq(BaseModel):
    s3_keys: list[str]
    title: str = "Packet"

@app.post("/packet/build")
def build_packet(req: PacketReq):
    cli = minio_client()
    writer = PdfWriter()
    with tempfile.TemporaryDirectory() as td:
        for key in req.s3_keys:
            loc = os.path.join(td, os.path.basename(key).replace('/','_'))
            cli.fget_object(S3_BUCKET, key, loc)
            reader = PdfReader(loc)
            for i, page in enumerate(reader.pages):
                writer.add_page(page)
        out = BytesIO(); writer.write(out)
    return Response(content=out.getvalue(), media_type="application/pdf")
