import { useState } from 'react';
import { StudyGuide } from '../types/api';
import StudyGuideTab from './StudyGuideTab';
import {
  conceptsForStudies,
  createCompilation,
  deleteCompilation,
  deleteStudy,
  getCompilations,
  getSavedStudies,
  mergeCompilations,
  SavedStudy,
  StudyCompilation,
} from '../lib/studies';

interface StudyManagerProps {
  onBack: () => void;
}

interface OpenGuide {
  title: string;
  data: StudyGuide;
}

export default function StudyManager({ onBack }: StudyManagerProps) {
  const [studies, setStudies] = useState(getSavedStudies);
  const [compilations, setCompilations] = useState(getCompilations);
  const [selectedStudyIds, setSelectedStudyIds] = useState<string[]>([]);
  const [selectedCompilationIds, setSelectedCompilationIds] = useState<string[]>([]);
  const [compilationName, setCompilationName] = useState('');
  const [mergeName, setMergeName] = useState('');
  const [openGuide, setOpenGuide] = useState<OpenGuide | null>(null);

  const refresh = () => {
    setStudies(getSavedStudies());
    setCompilations(getCompilations());
  };

  const toggle = (id: string, selected: string[], setSelected: (ids: string[]) => void) => {
    setSelected(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  };

  const saveCompilation = () => {
    const name = compilationName.trim();
    if (!name || selectedStudyIds.length === 0) return;
    createCompilation(name, selectedStudyIds);
    setCompilationName('');
    setSelectedStudyIds([]);
    refresh();
  };

  const combineCompilations = () => {
    const name = mergeName.trim();
    const selected = compilations.filter((compilation) => selectedCompilationIds.includes(compilation.id));
    if (!name || selected.length < 2) return;
    mergeCompilations(name, selected);
    setMergeName('');
    setSelectedCompilationIds([]);
    refresh();
  };

  const openStudy = (study: SavedStudy) => {
    setOpenGuide({ title: study.title, data: { concepts: study.concepts } });
  };

  const openCompilation = (compilation: StudyCompilation) => {
    setOpenGuide({
      title: compilation.name,
      data: { concepts: conceptsForStudies(compilation.studyIds) },
    });
  };

  if (openGuide) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-maroon-900 p-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setOpenGuide(null)} className="mb-6 bg-maroon-700 hover:bg-maroon-800 dark:bg-gold-500 dark:hover:bg-gold-700 dark:text-maroon-900 text-white px-4 py-2 rounded transition-colors">
            ← My Studies
          </button>
          <h1 className="text-3xl font-bold font-serif text-maroon-700 dark:text-gray-50 mb-8">{openGuide.title}</h1>
          <StudyGuideTab data={openGuide.data} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-maroon-900 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <button onClick={onBack} className="bg-maroon-700 hover:bg-maroon-800 dark:bg-gold-500 dark:hover:bg-gold-700 dark:text-maroon-900 text-white px-4 py-2 rounded transition-colors">
          ← Back
        </button>
        <header>
          <h1 className="text-3xl font-bold font-serif text-maroon-700 dark:text-gray-50">My Studies</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Save generated study guides and combine readings for an exam.</p>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-100 dark:border-maroon-700">
          <h2 className="text-xl font-semibold font-serif text-maroon-700 dark:text-gold-500">Saved Readings</h2>
          {studies.length === 0 ? (
            <p className="mt-4 text-gray-500 dark:text-gray-400">Save a generated study guide to start a compilation.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {studies.map((study) => (
                <div key={study.id} className="flex flex-wrap items-center justify-between gap-3 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <label className="flex items-center gap-3 min-w-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStudyIds.includes(study.id)}
                      onChange={() => toggle(study.id, selectedStudyIds, setSelectedStudyIds)}
                      className="h-4 w-4 accent-maroon-700"
                    />
                    <span className="min-w-0">
                      <span className="block font-medium text-gray-900 dark:text-gray-50 truncate">{study.title}</span>
                      <span className="block text-sm text-gray-500 dark:text-gray-400">{study.concepts.length} concepts · Saved {new Date(study.savedAt).toLocaleDateString()}</span>
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => openStudy(study)} className="text-sm font-medium text-maroon-700 dark:text-gold-500 hover:underline">Study</button>
                    <button onClick={() => { deleteStudy(study.id); refresh(); }} className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <input
              value={compilationName}
              onChange={(event) => setCompilationName(event.target.value)}
              placeholder="e.g. Midterm 1"
              className="flex-1 min-w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50"
            />
            <button onClick={saveCompilation} disabled={!compilationName.trim() || selectedStudyIds.length === 0} className="bg-maroon-700 hover:bg-maroon-800 dark:bg-gold-500 dark:hover:bg-gold-700 dark:text-maroon-900 text-white px-4 py-2 rounded disabled:opacity-50 transition-colors">
              Create Compilation ({selectedStudyIds.length})
            </button>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-100 dark:border-maroon-700">
          <h2 className="text-xl font-semibold font-serif text-maroon-700 dark:text-gold-500">Compilations</h2>
          {compilations.length === 0 ? (
            <p className="mt-4 text-gray-500 dark:text-gray-400">Create a compilation to study several readings together.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {compilations.map((compilation) => {
                const conceptCount = conceptsForStudies(compilation.studyIds).length;
                return (
                  <div key={compilation.id} className="flex flex-wrap items-center justify-between gap-3 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <label className="flex items-center gap-3 min-w-0 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCompilationIds.includes(compilation.id)}
                        onChange={() => toggle(compilation.id, selectedCompilationIds, setSelectedCompilationIds)}
                        className="h-4 w-4 accent-maroon-700"
                      />
                      <span>
                        <span className="block font-medium text-gray-900 dark:text-gray-50">{compilation.name}</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">{compilation.studyIds.length} readings · {conceptCount} concepts</span>
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <button onClick={() => openCompilation(compilation)} className="text-sm font-medium text-maroon-700 dark:text-gold-500 hover:underline">Open</button>
                      <button onClick={() => { deleteCompilation(compilation.id); refresh(); }} className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline">Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <input
              value={mergeName}
              onChange={(event) => setMergeName(event.target.value)}
              placeholder="e.g. Final Exam Review"
              className="flex-1 min-w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50"
            />
            <button onClick={combineCompilations} disabled={!mergeName.trim() || selectedCompilationIds.length < 2} className="bg-maroon-700 hover:bg-maroon-800 dark:bg-gold-500 dark:hover:bg-gold-700 dark:text-maroon-900 text-white px-4 py-2 rounded disabled:opacity-50 transition-colors">
              Combine ({selectedCompilationIds.length})
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
