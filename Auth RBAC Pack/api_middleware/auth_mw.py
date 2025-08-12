from fastapi import Header, HTTPException
from jose import jwt, JWTError
from pydantic import BaseModel
import os

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALG = os.getenv("JWT_ALG", "HS256")

class CurrentUser(BaseModel):
    sub: str
    role: str

def auth_dependency(authorization: str | None = Header(None)) -> CurrentUser:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(401, "Unauthorized")
    tok = authorization.split(" ",1)[1]
    try:
        claims = jwt.decode(tok, JWT_SECRET, algorithms=[JWT_ALG])
        return CurrentUser(sub=claims.get("sub",""), role=claims.get("role",""))
    except JWTError:
        raise HTTPException(401, "Invalid token")
