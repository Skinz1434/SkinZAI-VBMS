import argparse, json, os, io, random
from datetime import datetime, timedelta
from minio import Minio
from sqlalchemy import select, func, or_
from sqlalchemy.orm import Session
from ..db import SessionLocal, Base, engine
from ..env import S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET
from .. import models

def minio_client():
    import urllib.parse as up
    ep = up.urlparse(S3_ENDPOINT)
    secure = ep.scheme == "https"
    host = ep.netloc
    return Minio(host, access_key=S3_ACCESS_KEY, secret_key=S3_SECRET_KEY, secure=secure)

def ensure_bucket(cli, bucket):
    if not cli.bucket_exists(bucket):
        cli.make_bucket(bucket)

def tiny_pdf_bytes(title="Synthetic Document"):
    txt = title.replace("(","[").replace(")","]")
    body = f"""%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Count 1 /Kids [3 0 R] >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 300 200] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 60 >> stream
BT /F1 12 Tf 40 120 Td ({txt}) Tj ET
endstream endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000062 00000 n 
0000000117 00000 n 
0000000297 00000 n 
0000000391 00000 n 
trailer << /Root 1 0 R /Size 6 >>
startxref
470
%%EOF"""
    return body.encode("latin-1")

def upload_placeholder(cli, key, title):
    data = tiny_pdf_bytes(title)
    cli.put_object(S3_BUCKET, key, io.BytesIO(data), length=len(data), content_type="application/pdf")
    return key

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def get_or_create_participants(db: Session, target_count: int):
    existing = list(db.scalars(select(models.Participant)))
    if len(existing) >= target_count:
        return existing[:target_count]
    for i in range(len(existing), target_count):
        pid = f"PAR-SEED-{i+1:02d}"
        p = models.Participant(id=pid, file_number=f"F{10000000+i}", first_name=random.choice(["Alex","Jordan","Casey","Morgan"]), last_name=random.choice(["Demo","Sample","Mocke","Fakeman"]))
        db.add(p)
    db.commit()
    return list(db.scalars(select(models.Participant)))

def make_claim(db: Session, participant_id: str, ep_code: str):
    cid = f"CLM-{ep_code}-{int(datetime.utcnow().timestamp())}-{random.randint(100,999)}"
    c = models.Claim(id=cid, participant_id=participant_id, ep_type=ep_code, status="open")
    db.add(c); db.commit()
    return c

def make_contention(db: Session, claim_id: str, title: str, dc: str|None):
    ctid = f"CTN-{int(datetime.utcnow().timestamp())}-{random.randint(100,999)}"
    obj = models.Contention(id=ctid, claim_id=claim_id, title=title, dc_suggested=dc, status="pending")
    db.add(obj); db.commit()
    return obj

def make_task(db: Session, claim_id: str, ttype: str, assignee: str|None=None, due_days:int=14):
    tid = f"TSK-{int(datetime.utcnow().timestamp())}-{random.randint(100,999)}"
    due = datetime.utcnow() + timedelta(days=due_days)
    obj = models.Task(id=tid, claim_id=claim_id, type=ttype, status="todo", assignee=assignee, due_at=due)
    db.add(obj); db.commit()
    return obj

def mark_doc_link(db: Session, document, contention_id: str):
    tags = document.tags or []
    if f"contention:{contention_id}" not in tags:
        tags.append(f"contention:{contention_id}")
    document.tags = tags
    db.add(document)

def pick_docs_for_contention(db: Session, claim_id: str, hints: list[str], limit:int=3):
    like_conds = [func.lower(models.Document.doc_type).like(f"%{h.lower()}%") for h in hints]
    stmt = select(models.Document).where(or_(*like_conds))
    arr = [d for d in db.scalars(stmt) if d.claim_id == claim_id]
    if len(arr) < limit:
        arr = list(db.scalars(stmt))
    random.shuffle(arr)
    return arr[:limit]

def ensure_letter_docs(db: Session, cli, claim, labels: list[str]):
    created = []
    for label in labels:
        key = f"synthetic/{claim.id}/{label}_{random.randint(1000,9999)}.pdf"
        upload_placeholder(cli, key, label.replace("_"," "))
        doc = models.Document(
            id=f"DOC-LTR-{random.randint(100000,999999)}",
            participant_id=claim.participant_id,
            claim_id=claim.id,
            doc_type="Correspondence",
            source="SeedLetters",
            received_date=datetime.utcnow().date(),
            doc_date=datetime.utcnow().date(),
            path=key,
            ocr=False,
            tags=[label]
        )
        db.add(doc); created.append(doc)
    db.commit()
    return created

def finalize_decision_award(db: Session, cli, claim, contentions):
    ensure_letter_docs(db, cli, claim, ["Decision_Letter","Code_Sheet"])
    did = f"DEC-{int(datetime.utcnow().timestamp())}-{random.randint(100,999)}"
    dec = models.Decision(id=did, claim_id=claim.id)
    db.add(dec); db.commit()
    awid = f"AWD-{int(datetime.utcnow().timestamp())}-{random.randint(100,999)}"
    combined = random.choice([10,20,30,40,50,60,70])
    aw = models.Award(id=awid, claim_id=claim.id, decision_id=did, combined_percent=combined, monthly_amount=100+combined*10)
    db.add(aw); db.commit()
    return dec, aw

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--participants", type=int, default=3)
    parser.add_argument("--claims-per-ep", type=int, default=2)
    parser.add_argument("--finalize", type=float, default=0.5)
    parser.add_argument("--catalog-root", type=str, default="/app/data/catalog")
    args = parser.parse_args()

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    participants = get_or_create_participants(db, args.participants)
    with open(os.path.join(args.catalog_root, "ep_types.json"), "r") as f:
        ep_types = json.load(f)
    with open(os.path.join(args.catalog_root, "diagnostic_codes.json"), "r") as f:
        dcs = json.load(f)

    cli = minio_client(); ensure_bucket(cli, S3_BUCKET)

    seeded = []
    for ep in ep_types:
        for i in range(args.claims_per_ep):
            p = random.choice(participants)
            claim = make_claim(db, p.id, ep["code"])
            # contentions
            n = random.randint(ep["min_contentions"], ep["max_contentions"])
            chosen = random.sample(dcs, k=min(n, len(dcs))) if n>0 else []
            cts = []
            for j in range(n):
                dc = chosen[j % len(chosen)] if chosen else None
                title = dc["name"] if dc else (f"Admin Issue {j+1}" if ep["code"] in ["110","400"] else f"Contention {j+1}")
                ct = make_contention(db, claim.id, title, dc["dc"] if dc else None); cts.append(ct)
                hints = dc["doc_hints"] if dc else ["Administrative","Income","Caregiver"]
                for d in pick_docs_for_contention(db, claim.id, hints, limit=random.randint(1,3)):
                    mark_doc_link(db, d, ct.id)
                db.commit()
            # tasks
            for t in ep["task_flow"]:
                make_task(db, claim.id, t)
            # letters
            ensure_letter_docs(db, cli, claim, ["VCAA_DTA_Notice","Exam_Scheduling"] if "order_exam" in ep["task_flow"] else ["Admin_Notice"])
            # maybe finalize (not for 110/400)
            if random.random() < args.finalize and ep["code"] not in ["110","400"]:
                finalize_decision_award(db, cli, claim, cts)
            seeded.append(claim.id)

    print(f"[OK] Seeded {len(seeded)} claims across EPs.")
if __name__ == "__main__":
    main()
