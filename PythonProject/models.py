from pydantic import BaseModel
from typing import List, Dict, Any


class PhilosophyMetadata(BaseModel):
    author: str
    work: str
    period: str
    location: str
    core_concepts: List[str]


class AnalysisResult(BaseModel):
    metadata: Dict[str, Any]
    historical_context: str
    exam_study_guide: str


class AnalysisRequest(BaseModel):
    filename: str
    section: str = "Whole Book"


class ResearchPacket(BaseModel):
    metadata: Dict[str, Any]
    historical_context: str
    exam_study_guide: str
