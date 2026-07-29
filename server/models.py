from pydantic import BaseModel
from typing import List, Dict, Any, Optional


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


class HistoricalSection(BaseModel):
    title: str
    content: str
    source_quotes: List[str]


class HistoricalContext(BaseModel):
    sections: List[HistoricalSection]
    timeline: Optional[List[Dict[str, str]]] = None


class ConceptGuide(BaseModel):
    concept: str
    definition: str
    stakes: str
    exam_trap: str
    source_quotes: List[str]


class StudyGuide(BaseModel):
    concepts: List[ConceptGuide]


class AnalysisResult(BaseModel):
    metadata: Dict[str, Any]
    historical_context: HistoricalContext | None = None
    exam_study_guide: StudyGuide | None = None
    argument: ArgumentAnalysis | None = None


class AnalysisRequest(BaseModel):
    filename: str
    section: str = "Whole Book"


class ResearchPacket(BaseModel):
    metadata: Dict[str, Any]
    historical_context: HistoricalContext | None = None
    exam_study_guide: StudyGuide | None = None
    argument: ArgumentAnalysis | None = None
    raw_text: str | None = None


class IdentifyPaperRequest(BaseModel):
    description: str


class PaperCandidate(BaseModel):
    author: str
    work: str
    period: str
    confidence: int
    reasoning: str


class IdentifyCandidatesResponse(BaseModel):
    candidates: List[PaperCandidate]


class DebateQuestion(BaseModel):
    question: str
    concept_tested: str
    expected_key_points: List[str]
    hints: List[str]


class DebateQuestionsRequest(BaseModel):
    metadata: Dict[str, Any]
    raw_text: str = ""
    study_guide_concepts: List[Dict[str, Any]] = []
    count: int = 6


class EvaluateAnswerRequest(BaseModel):
    question: DebateQuestion
    user_answer: str
    metadata: Dict[str, Any]


class AnswerEvaluation(BaseModel):
    score: int
    correct_points: List[str]
    missing_points: List[str]
    feedback: str
    suggested_study: str


class AnalyzeCandidateRequest(BaseModel):
    author: str
    work: str
    period: str
