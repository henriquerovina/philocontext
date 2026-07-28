import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AnalysisResult, PaperCandidate } from './types/api';
import Upload from './components/Upload';
import CandidatePicker from './components/CandidatePicker';
import Results from './components/Results';
import ThemeToggle from './components/ThemeToggle';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [candidates, setCandidates] = useState<PaperCandidate[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (file: File) => {
    setLoading(true);
    setError(null);
    setCandidates(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleIdentifyPaper = async (description: string) => {
    setLoading(true);
    setError(null);
    setCandidates(null);

    try {
      const response = await fetch(`${API_URL}/api/identify-paper`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to identify paper');
      
      const foundCandidates = data.candidates || [];
      if (foundCandidates.length === 0) {
        throw new Error("We couldn't find any matching readings or papers for your description.");
      }
      setCandidates(foundCandidates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCandidate = async (candidate: PaperCandidate) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/analyze-identified`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: candidate.author,
          work: candidate.work,
          period: candidate.period,
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setCandidates(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setCandidates(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-maroon-900">
      <ThemeToggle />
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
            <Results result={result} onNew={handleNewAnalysis} />
          </motion.div>
        ) : candidates ? (
          <motion.div key="candidates" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
            <CandidatePicker candidates={candidates} onSelect={handleAnalyzeCandidate} onBack={() => setCandidates(null)} loading={loading} />
          </motion.div>
        ) : (
          <motion.div key="upload" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
            <Upload onAnalyze={handleAnalyze} onIdentifyPaper={handleIdentifyPaper} loading={loading} error={error} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
