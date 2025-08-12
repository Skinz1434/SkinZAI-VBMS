from pydantic import BaseModel, Field
from typing import Optional, List

class ParticipantCreate(BaseModel):
    file_number: str
    first_name: str
    last_name: str
    dob: Optional[str] = None

class ParticipantOut(BaseModel):
    id: str
    file_number: str
    first_name: str
    last_name: str
    dob: Optional[str] = None
    class Config:
        from_attributes = True

class ClaimCreate(BaseModel):
    participant_id: str
    ep_type: str
    lane: Optional[str] = None
    jurisdiction: Optional[str] = None

class ClaimOut(BaseModel):
    id: str
    participant_id: str
    ep_type: str
    lane: Optional[str] = None
    jurisdiction: Optional[str] = None
    status: str
    class Config:
        from_attributes = True

class ContentionCreate(BaseModel):
    title: str
    basis: Optional[str] = None
    indicators: Optional[List[str]] = None

class ContentionOut(BaseModel):
    id: str
    claim_id: str
    title: str
    basis: Optional[str] = None
    indicators: Optional[List[str]] = None
    dc_suggested: Optional[str] = None
    status: str
    class Config:
        from_attributes = True

class DocumentCreate(BaseModel):
    participant_id: str
    claim_id: Optional[str] = None
    doc_type: str
    source: Optional[str] = None
    received_date: Optional[str] = None
    doc_date: Optional[str] = None
    path: str
    tags: Optional[List[str]] = None

class DocumentOut(BaseModel):
    id: str
    participant_id: str
    claim_id: Optional[str] = None
    doc_type: str
    source: Optional[str] = None
    received_date: Optional[str] = None
    doc_date: Optional[str] = None
    path: str
    ocr: bool
    tags: Optional[List[str]] = None
    class Config:
        from_attributes = True

class TaskCreate(BaseModel):
    claim_id: str
    type: str
    assignee: Optional[str] = None
    due_at: Optional[str] = None

class TaskOut(BaseModel):
    id: str
    claim_id: str
    type: str
    status: str
    assignee: Optional[str] = None
    due_at: Optional[str] = None
    class Config:
        from_attributes = True

class DecisionCreate(BaseModel):
    claim_id: str
    issues: Optional[List[str]] = None
    codes: Optional[List[str]] = None

class AwardCreate(BaseModel):
    claim_id: str
    combined_percent: int
