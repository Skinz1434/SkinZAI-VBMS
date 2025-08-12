from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel
from sqlalchemy import select
from datetime import datetime
from .db import Base, engine, SessionLocal
from .models import User
from .utils import hash_password, verify_password, make_token, decode_token

app = FastAPI(title="SkinZAI Auth", version="1.0.0")
Base.metadata.create_all(bind=engine)

def db_sess():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Register(BaseModel):
    email: str
    password: str
    role: str = "VSR"

class Login(BaseModel):
    email: str
    password: str

@app.post("/register")
def register(body: Register, db=Depends(db_sess)):
    uid = f"USR-{int(datetime.utcnow().timestamp())}"
    if db.scalar(select(User).where(User.email==body.email)):
        raise HTTPException(400, "Email already registered")
    u = User(id=uid, email=body.email, password_hash=hash_password(body.password), role=body.role)
    db.add(u); db.commit()
    return {"id": uid, "email": body.email, "role": body.role}

@app.post("/login")
def login(body: Login, db=Depends(db_sess)):
    u = db.scalar(select(User).where(User.email==body.email))
    if not u or not verify_password(body.password, u.password_hash):
        raise HTTPException(401, "Invalid credentials")
    tok = make_token(u.email, u.role)
    return {"access_token": tok, "token_type": "bearer", "role": u.role}

@app.get("/introspect")
def introspect(authorization: str | None = Header(None)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(401, "Missing token")
    tok = authorization.split(" ",1)[1]
    try:
        claims = decode_token(tok)
        return {"active": True, "claims": claims}
    except Exception as e:
        raise HTTPException(401, f"Invalid token: {e}")
