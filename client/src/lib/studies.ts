import { AnalysisResult, ConceptGuide } from '../types/api';

const STUDIES_KEY = 'philocontext.saved-studies';
const COMPILATIONS_KEY = 'philocontext.study-compilations';

export interface SavedStudy {
  id: string;
  title: string;
  author: string;
  work: string;
  savedAt: string;
  concepts: ConceptGuide[];
}

export interface StudyCompilation {
  id: string;
  name: string;
  createdAt: string;
  studyIds: string[];
}

function read<T>(key: string): T[] {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getSavedStudies(): SavedStudy[] {
  return read<SavedStudy>(STUDIES_KEY);
}

export function saveStudy(result: AnalysisResult): SavedStudy | null {
  const concepts = result.exam_study_guide?.concepts ?? [];
  if (concepts.length === 0) return null;

  const study = {
    id: crypto.randomUUID(),
    title: `${result.metadata.author} - ${result.metadata.work}`,
    author: result.metadata.author,
    work: result.metadata.work,
    savedAt: new Date().toISOString(),
    concepts,
  };
  write(STUDIES_KEY, [study, ...getSavedStudies()]);
  return study;
}

export function deleteStudy(id: string): void {
  write(STUDIES_KEY, getSavedStudies().filter((study) => study.id !== id));
  write(
    COMPILATIONS_KEY,
    getCompilations().map((compilation) => ({
      ...compilation,
      studyIds: compilation.studyIds.filter((studyId) => studyId !== id),
    }))
  );
}

export function getCompilations(): StudyCompilation[] {
  return read<StudyCompilation>(COMPILATIONS_KEY);
}

export function createCompilation(name: string, studyIds: string[]): StudyCompilation {
  const compilation = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    studyIds: [...new Set(studyIds)],
  };
  write(COMPILATIONS_KEY, [compilation, ...getCompilations()]);
  return compilation;
}

export function deleteCompilation(id: string): void {
  write(COMPILATIONS_KEY, getCompilations().filter((compilation) => compilation.id !== id));
}

export function mergeCompilations(name: string, compilations: StudyCompilation[]): StudyCompilation {
  return createCompilation(name, compilations.flatMap((compilation) => compilation.studyIds));
}

export function conceptsForStudies(studyIds: string[]): ConceptGuide[] {
  const studies = new Map(getSavedStudies().map((study) => [study.id, study]));
  return studyIds.flatMap((id) => studies.get(id)?.concepts ?? []);
}
