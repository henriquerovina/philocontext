from pydantic import BaseModel
from typing import List, Dict, Any


class PhilosophyMetadata(BaseModel):
    author: str
    work: str
    period: str
    location: str
    core_concepts: List[str]


class ArgumentThesis(BaseModel):
    original: str
    simplified: str
    logical_form: str


class Premise(BaseModel):
    original: str
    simplified: str


class Conclusion(BaseModel):
    original: str
    simplified: str


class ArgumentReconstruction(BaseModel):
    type: str
    formal: str
    plain: str


class Fallacy(BaseModel):
    name: str
    description: str
    found_in_text: str


class Objection(BaseModel):
    critic: str
    summary: str
    era: str
    popularity: str
    response: str


class ArgumentAnalysis(BaseModel):
    thesis: ArgumentThesis
    premises: List[Premise]
    conclusion: Conclusion
    reconstructions: List[ArgumentReconstruction]
    fallacies: List[Fallacy]
    objections: List[Objection]


class AnalysisResult(BaseModel):
    metadata: Dict[str, Any]
    historical_context: str
    exam_study_guide: str
    argument: ArgumentAnalysis | None = None


class AnalysisRequest(BaseModel):
    filename: str
    section: str = "Whole Book"


class ResearchPacket(BaseModel):
    metadata: Dict[str, Any]
    historical_context: str
    exam_study_guide: str
    argument: ArgumentAnalysis
