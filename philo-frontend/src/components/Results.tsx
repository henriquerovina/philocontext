import { useState } from 'react';
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
      content: <div className="prose prose-sm whitespace-pre-wrap">{result.historical_context}</div>,
    },
    {
      id: 'guide',
      label: 'Study Guide',
      content: <div className="prose prose-sm whitespace-pre-wrap">{result.exam_study_guide}</div>,
    },
    {
      id: 'export',
      label: 'Export',
      content: (
        <div className="space-y-4">
          <button
            onClick={exportAsJSON}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Download JSON
          </button>
          <button
            onClick={exportAsMarkdown}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Download Markdown
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onNew}
          className="mb-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          ← New Analysis
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{result.metadata.work}</h1>
        <p className="text-lg text-gray-600 mb-8">by {result.metadata.author}</p>

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

function MetadataTab({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-gray-600 font-semibold">Author</p>
        <p className="text-gray-900">{result.metadata.author}</p>
      </div>
      <div>
        <p className="text-gray-600 font-semibold">Period</p>
        <p className="text-gray-900">{result.metadata.period}</p>
      </div>
      <div>
        <p className="text-gray-600 font-semibold">Location</p>
        <p className="text-gray-900">{result.metadata.location}</p>
      </div>
      <div>
        <p className="text-gray-600 font-semibold">Key Concepts</p>
        <div className="flex flex-wrap gap-2">
          {result.metadata.core_concepts.map((concept) => (
            <span
              key={concept}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {concept}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
