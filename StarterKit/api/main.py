from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import Optional, List
from datetime import datetime
from .env import CORS_ORIGINS
from .db import Base, engine, SessionLocal
from . import models, schemas

app = FastAPI(title="SkinZAI VBMS API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup (simple demo behavior)
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health():
    return {"ok": True, "time": datetime.utcnow().isoformat()}

# Participants
@app.get("/participants", response_model=List[schemas.ParticipantOut])
def participants_list(q: Optional[str] = None, db: Session = Depends(get_db)):
    stmt = select(models.Participant)
    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where(models.Participant.file_number.ilike(like) | models.Participant.last_name.ilike(like))
    return list(db.scalars(stmt))

@app.post("/participants", response_model=schemas.ParticipantOut, status_code=201)
def participants_create(body: schemas.ParticipantCreate, db: Session = Depends(get_db)):
    nid = f"PAR-{int(datetime.utcnow().timestamp())}{len(body.file_number)}"
    obj = models.Participant(id=nid, **body.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    _audit(db, "system", "Participant", obj.id, "CREATE", None, obj)
    return obj

@app.get("/participants/{pid}", response_model=schemas.ParticipantOut)
def participants_get(pid: str, db: Session = Depends(get_db)):
    obj = db.get(models.Participant, pid)
    if not obj: return {}
    return obj

# Claims
@app.post("/claims", response_model=schemas.ClaimOut, status_code=201)
def claim_create(body: schemas.ClaimCreate, db: Session = Depends(get_db)):
    nid = f"CLM-{int(datetime.utcnow().timestamp())}"
    obj = models.Claim(id=nid, **body.model_dump(), status="open")
    db.add(obj); db.commit(); db.refresh(obj)
    _audit(db, "system","Claim", obj.id, "CREATE", None, obj)
    return obj

@app.get("/claims", response_model=List[schemas.ClaimOut])
def claim_list(ep_type: Optional[str] = None, db: Session = Depends(get_db)):
    stmt = select(models.Claim)
    if ep_type:
        stmt = stmt.where(models.Claim.ep_type == ep_type)
    return list(db.scalars(stmt))

@app.get("/claims/{cid}", response_model=schemas.ClaimOut)
def claim_get(cid: str, db: Session = Depends(get_db)):
    obj = db.get(models.Claim, cid)
    return obj or {}

# Contentions
@app.post("/claims/{cid}/contentions", response_model=schemas.ContentionOut, status_code=201)
def contention_add(cid: str, body: schemas.ContentionCreate, db: Session = Depends(get_db)):
    nid = f"CTN-{int(datetime.utcnow().timestamp())}"
    obj = models.Contention(id=nid, claim_id=cid, **body.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    _audit(db, "system","Contention", obj.id, "CREATE", None, obj)
    return obj

@app.get("/claims/{cid}/contentions", response_model=List[schemas.ContentionOut])
def contention_list(cid: str, db: Session = Depends(get_db)):
    stmt = select(models.Contention).where(models.Contention.claim_id==cid)
    return list(db.scalars(stmt))

# Documents
@app.get("/documents", response_model=List[schemas.DocumentOut])
def doc_list(q: Optional[str] = None, type: Optional[str] = None, db: Session = Depends(get_db)):
    stmt = select(models.Document)
    if type:
        stmt = stmt.where(models.Document.doc_type==type)
    # Simple q: search in path or doc_type
    if q:
        like = f"%{q.lower()}%"
        from sqlalchemy import or_, func
        stmt = stmt.where(or_(func.lower(models.Document.path).like(like), func.lower(models.Document.doc_type).like(like)))
    return list(db.scalars(stmt))

@app.post("/documents", response_model=schemas.DocumentOut, status_code=201)
def doc_create(body: schemas.DocumentCreate, db: Session = Depends(get_db)):
    nid = f"DOC-{int(datetime.utcnow().timestamp())}"
    obj = models.Document(id=nid, **body.model_dump(), ocr=False)
    db.add(obj); db.commit(); db.refresh(obj)
    _audit(db, "system","Document", obj.id, "CREATE", None, obj)
    return obj

# Tasks
@app.post("/tasks", response_model=schemas.TaskOut, status_code=201)
def task_create(body: schemas.TaskCreate, db: Session = Depends(get_db)):
    nid = f"TSK-{int(datetime.utcnow().timestamp())}"
    obj = models.Task(id=nid, **body.model_dump(), status="todo")
    db.add(obj); db.commit(); db.refresh(obj)
    _audit(db, "system","Task", obj.id, "CREATE", None, obj)
    return obj

@app.get("/tasks", response_model=List[schemas.TaskOut])
def task_list(db: Session = Depends(get_db)):
    return list(db.scalars(select(models.Task)))

# Decisions/Awards (stubs)
@app.post("/decisions", status_code=201)
def decision_create(body: schemas.DecisionCreate, db: Session = Depends(get_db)):
    nid = f"DEC-{int(datetime.utcnow().timestamp())}"
    obj = models.Decision(id=nid, claim_id=body.claim_id)
    db.add(obj); db.commit(); _audit(db, "system","Decision", obj.id, "CREATE", None, {"claim_id": body.claim_id})
    return {"id": nid}

@app.post("/awards", status_code=201)
def award_create(body: schemas.AwardCreate, db: Session = Depends(get_db)):
    nid = f"AWD-{int(datetime.utcnow().timestamp())}"
    amt = 100 + int(body.combined_percent) * 10
    obj = models.Award(id=nid, claim_id=body.claim_id, combined_percent=body.combined_percent, monthly_amount=amt)
    db.add(obj); db.commit(); _audit(db, "system","Award", obj.id, "CREATE", None, {"amount": amt})
    return {"id": nid, "monthly_amount": amt}

@app.get("/audit")
def audit_list(db: Session = Depends(get_db)):
    return list(db.execute("select * from audit_events order by at desc limit 500")).mappings()

def _audit(db: Session, actor, obj_type, obj_id, action, before, after):
    nid = f"AUD-{int(datetime.utcnow().timestamp())}"
    db.execute(
        models.AuditEvent.__table__.insert().values(
            id=nid, actor_id=actor, object_type=obj_type, object_id=obj_id,
            action=action, before_json=(before.dict() if hasattr(before, 'dict') else before),
            after_json=(after.__dict__ if hasattr(after, '__dict__') else (after.dict() if hasattr(after,'dict') else after)),
        )
    )
    db.commit()
