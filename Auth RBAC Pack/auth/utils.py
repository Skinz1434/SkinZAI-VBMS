from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from .env import JWT_SECRET, JWT_ALG, TOKEN_TTL

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(p): return pwd.hash(p)
def verify_password(p, h): return pwd.verify(p, h)

def make_token(sub: str, role: str):
    now = datetime.utcnow()
    payload = {"sub": sub, "role": role, "iat": int(now.timestamp()), "exp": int((now+timedelta(seconds=TOKEN_TTL)).timestamp())}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)
def decode_token(tok: str): return jwt.decode(tok, JWT_SECRET, algorithms=[JWT_ALG])
