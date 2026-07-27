import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult } from '../types/api';
import Tabs from './Tabs';

interface ResultsProps {
  result: AnalysisResult;
  onNew: () => void;
}

export default function Results({ result, onNew }: ResultsProps) {
  const [activeTab, setActiveTab] = useState('metadata');

  const exportAsJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.metadata.author}_analysis.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsMarkdown = () => {
    const md = `# ${result.metadata.work}
By ${result.metadata.author}

## Metadata
- **Author**: ${result.metadata.author}
- **Work**: ${result.metadata.work}
- **Period**: ${result.metadata.period}
- **Location**: ${result.metadata.location}
- **Key Concepts**: ${result.metadata.core_concepts.join(', ')}

## Historical Context
${result.historical_context}

## Study Guide
${result.exam_study_guide}
`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.metadata.author}_study_guide.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'metadata', label: 'Metadata', content: <MetadataTab result={result} /> },
    {
      id: 'history',
      label: 'Historical Context',
      content: <div className="whitespace-pre-wrap leading-relaxed">{result.historical_context}</div>,
    },
    {
      id: 'guide',
      label: 'Study Guide',
      content: <div className="whitespace-pre-wrap leading-relaxed">{result.exam_study_guide}</div>,
    },
    {
      id: 'export',
      label: 'Export',
      content: (
        <div className="space-y-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={exportAsJSON}
            className="w-full bg-ink-800 hover:bg-ink-900 dark:bg-surface-100 dark:hover:bg-surface-200 dark:text-ink-900 text-white py-2 rounded"
          >
            Download JSON
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={exportAsMarkdown}
            className="w-full bg-ink-800 hover:bg-ink-900 dark:bg-surface-100 dark:hover:bg-surface-200 dark:text-ink-900 text-white py-2 rounded"
          >
            Download Markdown
          </motion.button>
        </div>
      ),
    },
  ];

  return (
    <motion.div className="min-h-screen bg-surface-50 dark:bg-ink-900 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="max-w-4xl mx-auto">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNew}
          className="mb-6 bg-ink-800 hover:bg-ink-900 dark:bg-surface-100 dark:hover:bg-surface-200 dark:text-ink-900 text-white px-4 py-2 rounded"
        >
          ← New Analysis
        </motion.button>

        <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl font-bold font-serif text-ink-900 dark:text-surface-50 mb-2">{result.metadata.work}</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-lg text-ink-800/70 dark:text-surface-100/70 mb-8">by {result.metadata.author}</motion.p>

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </motion.div>
  );
}

function MetadataTab({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-ink-800/70 dark:text-surface-100/70 font-semibold">Author</p>
        <p className="text-ink-900 dark:text-surface-50">{result.metadata.author}</p>
      </div>
      <div>
        <p className="text-ink-800/70 dark:text-surface-100/70 font-semibold">Period</p>
        <p className="text-ink-900 dark:text-surface-50">{result.metadata.period}</p>
      </div>
      <div>
        <p className="text-ink-800/70 dark:text-surface-100/70 font-semibold">Location</p>
        <p className="text-ink-900 dark:text-surface-50">{result.metadata.location}</p>
      </div>
      <div>
        <p className="text-ink-800/70 dark:text-surface-100/70 font-semibold">Key Concepts</p>
        <div className="flex flex-wrap gap-2">
          {result.metadata.core_concepts.map((concept) => (
            <span
              key={concept}
              className="bg-ink-800/10 text-ink-800 dark:bg-surface-50/10 dark:text-surface-50 px-3 py-1 rounded-full text-sm"
            >
              {concept}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
