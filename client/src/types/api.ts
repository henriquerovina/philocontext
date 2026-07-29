export interface PhilosophyMetadata {
  author: string;
  work: string;
  period: string;
  location: string;
  core_concepts: string[];
}

export interface ArgumentThesis {
  original: string;
  simplified: string;
  logical_form: string;
}

export interface Premise {
  original: string;
  simplified: string;
}

export interface Conclusion {
  original: string;
  simplified: string;
}

export interface ArgumentReconstruction {
  type: string;
  formal: string;
  plain: string;
}

export interface Fallacy {
  name: string;
  description: string;
  found_in_text: string;
}

export interface Objection {
  critic: string;
  summary: string;
  era: string;
  popularity: string;
  response: string;
}

export interface ArgumentAnalysis {
  thesis: ArgumentThesis;
  premises: Premise[];
  conclusion: Conclusion;
  reconstructions: ArgumentReconstruction[];
  fallacies: Fallacy[];
  objections: Objection[];
}

export interface HistoricalSection {
  title: string;
  content: string;
  source_quotes: string[];
}

export interface HistoricalContext {
  sections: HistoricalSection[];
  timeline?: { date: string; event: string }[];
}

export interface ConceptGuide {
  concept: string;
  definition: string;
  stakes: string;
  exam_trap: string;
  source_quotes: string[];
}

export interface StudyGuide {
  concepts: ConceptGuide[];
}

export interface AnalysisResult {
  metadata: PhilosophyMetadata;
  historical_context: HistoricalContext | null;
  exam_study_guide: StudyGuide | null;
  argument: ArgumentAnalysis;
  raw_text?: string;
}

export interface DebateQuestion {
  question: string;
  concept_tested: string;
  expected_key_points: string[];
  hints: string[];
}

export interface AnswerEvaluation {
  score: number;
  correct_points: string[];
  missing_points: string[];
  feedback: string;
  suggested_study: string;
}

export interface PaperCandidate {
  author: string;
  work: string;
  period: string;
  confidence: number;
  reasoning: string;
}

export interface IdentifyCandidatesResponse {
  candidates: PaperCandidate[];
  error?: string;
}
