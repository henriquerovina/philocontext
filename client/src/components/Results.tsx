import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult } from '../types/api';
import Tabs from './Tabs';
import ArgumentTab from './ArgumentTab';

interface ResultsProps {
  result: AnalysisResult;
  onNew: () => void;
}

export default function Results({ result, onNew }: ResultsProps) {
  const [activeTab, setActiveTab] = useState('argument');

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
    const arg = result.argument;
    const md = `# ${result.metadata.work}
By ${result.metadata.author}

## Metadata
- **Author**: ${result.metadata.author}
- **Work**: ${result.metadata.work}
- **Period**: ${result.metadata.period}
- **Location**: ${result.metadata.location}
- **Key Concepts**: ${result.metadata.core_concepts.join(', ')}

## Argument Analysis
### Thesis
- Original: ${arg?.thesis.original ?? ''}
- Simplified: ${arg?.thesis.simplified ?? ''}
- Logical Form: ${arg?.thesis.logical_form ?? ''}

### Premises
${(arg?.premises ?? []).map((p, i) => `${i + 1}. ${p.original} | ${p.simplified}`).join('\n')}

### Conclusion
- Original: ${arg?.conclusion.original ?? ''}
- Simplified: ${arg?.conclusion.simplified ?? ''}

### Reconstructions
${(arg?.reconstructions ?? []).map((r) => `- ${r.type}: ${r.formal} — ${r.plain}`).join('\n')}

### Fallacies
${(arg?.fallacies ?? []).length === 0 ? 'No fallacies detected' : (arg?.fallacies ?? []).map((f) => `- ${f.name}: ${f.description} (Found: "${f.found_in_text}")`).join('\n')}

### Objections
${(arg?.objections ?? []).map((o) => `- ${o.critic} (${o.era}, ${o.popularity}): ${o.summary} | Response: ${o.response}`).join('\n')}

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
    { id: 'argument', label: 'Argument', content: <ArgumentTab argument={result.argument} /> },
    { id: 'metadata', label: 'Metadata', content: <MetadataTab result={result} /> },
    {
      id: 'history',
      label: 'Historical Context',
      content: <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-100">{result.historical_context}</div>,
    },
    {
      id: 'guide',
      label: 'Study Guide',
      content: <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-100">{result.exam_study_guide}</div>,
    },
    {
      id: 'export',
      label: 'Export',
      content: (
        <div className="space-y-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={exportAsJSON}
            className="w-full bg-maroon-700 hover:bg-maroon-800 dark:bg-gold-500 dark:hover:bg-gold-700 dark:text-maroon-900 text-white py-2 rounded transition-colors"
          >
            Download JSON
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={exportAsMarkdown}
            className="w-full bg-maroon-700 hover:bg-maroon-800 dark:bg-gold-500 dark:hover:bg-gold-700 dark:text-maroon-900 text-white py-2 rounded transition-colors"
          >
            Download Markdown
          </motion.button>
        </div>
      ),
    },
  ];

  return (
    <motion.div className="min-h-screen bg-gray-50 dark:bg-maroon-900 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="max-w-4xl mx-auto">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNew}
          className="mb-6 bg-maroon-700 hover:bg-maroon-800 dark:bg-gold-500 dark:hover:bg-gold-700 dark:text-maroon-900 text-white px-4 py-2 rounded transition-colors"
        >
          ← New Analysis
        </motion.button>

        <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl font-bold font-serif text-maroon-700 dark:text-gray-50 mb-2">{result.metadata.work}</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-lg text-gray-600 dark:text-gray-300 mb-8">by {result.metadata.author}</motion.p>

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </motion.div>
  );
}

function MetadataTab({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-gray-600 dark:text-gray-300 font-semibold">Author</p>
        <p className="text-gray-900 dark:text-gray-50">{result.metadata.author}</p>
      </div>
      <div>
        <p className="text-gray-600 dark:text-gray-300 font-semibold">Period</p>
        <p className="text-gray-900 dark:text-gray-50">{result.metadata.period}</p>
      </div>
      <div>
        <p className="text-gray-600 dark:text-gray-300 font-semibold">Location</p>
        <p className="text-gray-900 dark:text-gray-50">{result.metadata.location}</p>
      </div>
      <div>
        <p className="text-gray-600 dark:text-gray-300 font-semibold">Key Concepts</p>
        <div className="flex flex-wrap gap-2">
          {result.metadata.core_concepts.map((concept) => (
            <span
              key={concept}
              className="bg-maroon-50 text-maroon-700 dark:bg-gold-500/20 dark:text-gold-500 border border-maroon-100 dark:border-gold-500/30 px-3 py-1 rounded-full text-sm"
            >
              {concept}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
