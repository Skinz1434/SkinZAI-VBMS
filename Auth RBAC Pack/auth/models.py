from sqlalchemy import Column, String, DateTime
from .db import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="VSR")
    created_at = Column(DateTime, default=datetime.utcnow)
