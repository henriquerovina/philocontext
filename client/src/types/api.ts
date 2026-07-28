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

export interface AnalysisResult {
  metadata: PhilosophyMetadata;
  historical_context: string;
  exam_study_guide: string;
  argument: ArgumentAnalysis;
}
