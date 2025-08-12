from fastapi import FastAPI, Response
from pydantic import BaseModel
from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime

app = FastAPI(title="CodeSheet Service", version="1.0.0")

class Rating(BaseModel):
    contention: str
    dc: str
    percent: int
    effective_date: str

class CodeSheetReq(BaseModel):
    claim_id: str
    ratings: list[Rating]
    combined_percent: int

@app.post("/codesheet/render")
def render(req: CodeSheetReq):
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=LETTER)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(72, 740, f"Code Sheet — Claim {req.claim_id}")
    c.setFont("Helvetica", 10)
    y = 710
    c.drawString(72, y, f"Generated: {datetime.utcnow().isoformat()}"); y -= 20
    c.drawString(72, y, f"Combined Evaluation: {req.combined_percent}%"); y -= 30
    c.setFont("Helvetica-Bold", 10)
    c.drawString(72, y, "Contention"); c.drawString(270, y, "DC"); c.drawString(330, y, "%"); c.drawString(370, y, "Effective Date"); y -= 16
    c.setFont("Helvetica", 10)
    for r in req.ratings:
        c.drawString(72, y, r.contention[:28])
        c.drawString(270, y, r.dc)
        c.drawString(330, y, str(r.percent))
        c.drawString(370, y, r.effective_date)
        y -= 14
        if y < 100:
            c.showPage(); y = 740
    c.showPage(); c.save()
    pdf = buf.getvalue()
    return Response(content=pdf, media_type="application/pdf")
