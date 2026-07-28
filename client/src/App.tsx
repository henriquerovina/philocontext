import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AnalysisResult } from './types/api';
import Upload from './components/Upload';
import Results from './components/Results';
import ThemeToggle from './components/ThemeToggle';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (file: File) => {
    setLoading(true);
    setError(null);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-maroon-900">
      <ThemeToggle />
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="upload" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
            <Upload onAnalyze={handleAnalyze} loading={loading} error={error} />
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
            <Results result={result} onNew={() => setResult(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
