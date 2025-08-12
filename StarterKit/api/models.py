from sqlalchemy import Column, String, Integer, Date, DateTime, Boolean, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from .db import Base
from datetime import datetime

class Participant(Base):
    __tablename__ = "participants"
    id = Column(String, primary_key=True)
    file_number = Column(String, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    dob = Column(Date)
    poa = Column(String)
    flags = Column(JSON, default=list)

class Claim(Base):
    __tablename__ = "claims"
    id = Column(String, primary_key=True)
    participant_id = Column(String, ForeignKey("participants.id"), nullable=False, index=True)
    ep_type = Column(String, nullable=False, index=True)
    lane = Column(String)
    jurisdiction = Column(String)
    status = Column(String, default="open")
    opened_at = Column(DateTime, default=datetime.utcnow)
    closed_at = Column(DateTime)

class Contention(Base):
    __tablename__ = "contentions"
    id = Column(String, primary_key=True)
    claim_id = Column(String, ForeignKey("claims.id"), index=True, nullable=False)
    title = Column(String, nullable=False)
    basis = Column(String)
    indicators = Column(JSON, default=list)
    dc_suggested = Column(String)
    status = Column(String, default="pending")

class Document(Base):
    __tablename__ = "documents"
    id = Column(String, primary_key=True)
    participant_id = Column(String, ForeignKey("participants.id"), index=True, nullable=False)
    claim_id = Column(String, ForeignKey("claims.id"), index=True, nullable=True)
    doc_type = Column(String, index=True, nullable=False)
    source = Column(String)
    received_date = Column(Date, index=True)
    doc_date = Column(Date)
    path = Column(String, nullable=False)  # S3 key
    ocr = Column(Boolean, default=False)
    tags = Column(JSON, default=list)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(String, primary_key=True)
    claim_id = Column(String, ForeignKey("claims.id"), index=True, nullable=False)
    type = Column(String, nullable=False)
    status = Column(String, default="todo", index=True)
    assignee = Column(String)
    due_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

class Decision(Base):
    __tablename__ = "decisions"
    id = Column(String, primary_key=True)
    claim_id = Column(String, ForeignKey("claims.id"), index=True, nullable=False)
    narrative_path = Column(String)
    codesheet_json = Column(JSON)
    finalized_at = Column(DateTime)
    author_id = Column(String)

class Award(Base):
    __tablename__ = "awards"
    id = Column(String, primary_key=True)
    claim_id = Column(String, ForeignKey("claims.id"), index=True, nullable=False)
    decision_id = Column(String, ForeignKey("decisions.id"))
    combined_percent = Column(Integer)
    monthly_amount = Column(Integer)
    transmitted_at = Column(DateTime)

class AuditEvent(Base):
    __tablename__ = "audit_events"
    id = Column(String, primary_key=True)
    actor_id = Column(String)
    object_type = Column(String, index=True)
    object_id = Column(String, index=True)
    action = Column(String)
    at = Column(DateTime, default=datetime.utcnow, index=True)
    before_json = Column(JSON)
    after_json = Column(JSON)
