export interface PhilosophyMetadata {
  author: string;
  work: string;
  period: string;
  location: string;
  core_concepts: string[];
}

export interface AnalysisResult {
  metadata: PhilosophyMetadata;
  historical_context: string;
  exam_study_guide: string;
}
