import argparse, os, zipfile, io, sys, csv, random
from datetime import datetime
from minio import Minio
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..env import S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, DATABASE_URL
from ..db import SessionLocal, Base, engine
from .. import models

def ensure_bucket(client: Minio, bucket: str):
    found = client.bucket_exists(bucket)
    if not found:
        client.make_bucket(bucket)

def upload_object(client: Minio, bucket: str, key: str, data: bytes):
    import hashlib
    size = len(data)
    client.put_object(bucket, key, io.BytesIO(data), length=size, content_type="application/octet-stream")
    return hashlib.md5(data).hexdigest()

def random_name():
    fn = random.choice(["Jordan","Taylor","Alex","Casey","Riley","Morgan","Cameron"])
    ln = random.choice(["Sampleton","Testwell","Demoman","Placeholder","Mocke","Fakeman"])
    return fn, ln

def get_or_create_demo_entities(db: Session):
    # create 3 participants, each with 1 claim
    participants = list(db.scalars(select(models.Participant)))
    claims = list(db.scalars(select(models.Claim)))
    if len(participants) >= 3 and len(claims) >= 3:
        return participants[:3], claims[:3]
    # create
    res_p = []
    for i in range(3):
        fn, ln = random_name()
        pid = f"PAR-SEED-{i+1:02d}"
        p = models.Participant(id=pid, file_number=f"F{10000000+i}", first_name=fn, last_name=ln)
        db.add(p); res_p.append(p)
    db.commit()
    res_c = []
    for i, p in enumerate(res_p, start=1):
        cid = f"CLM-SEED-{i:02d}"
        c = models.Claim(id=cid, participant_id=p.id, ep_type=random.choice(["010 New","020 Increase","040 Supplemental"]), status="open")
        db.add(c); res_c.append(c)
    db.commit()
    return res_p, res_c

def parse_manifest_csv(zf: zipfile.ZipFile, inner_path: str):
    with zf.open(inner_path) as f:
        data = f.read().decode("utf-8", errors="ignore").splitlines()
        reader = csv.DictReader(data)
        return list(reader)

def find_manifest(zf: zipfile.ZipFile):
    # look for manifest.csv at root or */manifest*.csv
    for name in zf.namelist():
        base = name.lower().split("/")[-1]
        if base.startswith("manifest") and base.endswith(".csv"):
            return name
    return None

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--zips", type=str, required=True, help="Comma-separated paths inside container, e.g., /app/data/V2.zip,/app/data/MEGA.zip")
    args = parser.parse_args()

    # Setup DB
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Setup MinIO
    import urllib.parse as up
    ep = up.urlparse(S3_ENDPOINT)
    secure = ep.scheme == "https"
    host = ep.netloc
    client = Minio(host, access_key=S3_ACCESS_KEY, secret_key=S3_SECRET_KEY, secure=secure)
    ensure_bucket(client, S3_BUCKET)

    participants, claims = get_or_create_demo_entities(db)
    claim_cycle = (c.id for c in claims)

    for zip_path in args.zips.split(","):
        zip_path = zip_path.strip()
        if not zip_path:
            continue
        if not os.path.exists(zip_path):
            print(f"[WARN] ZIP not found: {zip_path}", file=sys.stderr)
            continue

        with zipfile.ZipFile(zip_path, "r") as zf:
            mani = find_manifest(zf)
            if not mani:
                print(f"[WARN] Manifest not found in {zip_path}", file=sys.stderr)
                continue
            rows = parse_manifest_csv(zf, mani)
            # detect doc root prefix from file_path column
            key_col = "file_path" if "file_path" in rows[0] else "path"
            print(f"[INFO] {zip_path}: {len(rows)} manifest rows")
            processed = 0
            for row in rows:
                rel = row.get(key_col, "")
                if not rel:
                    continue
                rel = rel.strip("/")
                # try to read the file from the zip
                try:
                    data = zf.read(rel)
                except KeyError:
                    # sometimes manifest uses different separators; try case-insensitive match
                    lowered = {n.lower(): n for n in zf.namelist()}
                    rel2 = rel.lower()
                    if rel2 in lowered:
                        data = zf.read(lowered[rel2])
                    else:
                        # skip if not found
                        continue

                # Upload to S3
                zipbase = os.path.splitext(os.path.basename(zip_path))[0]
                key = f"{zipbase}/{rel.replace('..','_')}"
                upload_object(client, S3_BUCKET, key, data)

                # Insert Document row
                claim_id = next(claim_cycle, None)
                if claim_id is None:
                    claim_cycle = (c.id for c in claims)
                    claim_id = next(claim_cycle)
                doc = models.Document(
                    id=f"DOC-SEED-{zipbase}-{processed:06d}",
                    participant_id=participants[processed % len(participants)].id,
                    claim_id=claim_id,
                    doc_type=row.get("doc_type") or "Unknown",
                    source=row.get("source") or "SeedImport",
                    received_date=(row.get("received_date") or None),
                    doc_date=(row.get("doc_date") or None),
                    path=key,
                    ocr=str(row.get("file_type","")).lower() != "pdf"  # assume text docs have OCR-like content
                )
                db.add(doc)
                processed += 1
                if processed % 200 == 0:
                    db.commit()
            db.commit()
            print(f"[OK] Imported {processed} docs from {zip_path}")

if __name__ == "__main__":
    main()
