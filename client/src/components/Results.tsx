import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult } from '../types/api';
import Tabs from './Tabs';
import ArgumentTab from './ArgumentTab';
import HistoryTab from './HistoryTab';
import StudyGuideTab from './StudyGuideTab';
import { saveStudy } from '../lib/studies';

interface ResultsProps {
  result: AnalysisResult;
  onNew: () => void;
}

export default function Results({ result, onNew }: ResultsProps) {
  const [activeTab, setActiveTab] = useState('history');
  const [saved, setSaved] = useState(false);

  const handleSaveStudy = () => {
    setSaved(saveStudy(result) !== null);
  };

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
${(() => {
  const hc = result.historical_context;
  if (!hc || !hc.sections) return 'Not available.';
  const secMd = hc.sections
    .map((s) => {
      const quotes = (s.source_quotes ?? []).map((q) => `> "${q}"`).join('\n');
      return `### ${s.title}\n${s.content}\n${quotes}`;
    })
    .join('\n\n');
  const tlMd =
    hc.timeline && hc.timeline.length > 0
      ? `\n\n#### Timeline\n${hc.timeline.map((t) => `- ${t.date}: ${t.event}`).join('\n')}`
      : '';
  return secMd + tlMd;
})()}

## Study Guide
${(() => {
  const sg = result.exam_study_guide;
  if (!sg || !sg.concepts) return 'Not available.';
  return sg.concepts
    .map((c) => {
      const quotes = (c.source_quotes ?? []).map((q) => `> "${q}"`).join('\n');
      return `### ${c.concept}\n- **Definition**: ${c.definition}\n- **Stakes**: ${c.stakes}\n- **Exam Trap**: ${c.exam_trap}\n${quotes}`;
    })
    .join('\n\n');
})()}
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
    {
      id: 'history',
      label: 'Historical Context',
      content: <HistoryTab data={result.historical_context} />,
    },
    { id: 'argument', label: 'Argument', content: <ArgumentTab argument={result.argument} /> },
    {
      id: 'guide',
      label: 'Study Guide',
      content: <StudyGuideTab data={result.exam_study_guide} />,
    },
    { id: 'metadata', label: 'Metadata', content: <MetadataTab result={result} /> },
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
        <div className="mb-6 flex flex-wrap gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onNew}
            className="bg-maroon-700 hover:bg-maroon-800 dark:bg-gold-500 dark:hover:bg-gold-700 dark:text-maroon-900 text-white px-4 py-2 rounded transition-colors"
          >
            ← New Analysis
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSaveStudy}
            disabled={saved || !(result.exam_study_guide?.concepts.length)}
            className="border border-maroon-700 px-4 py-2 rounded text-maroon-700 transition-colors hover:bg-maroon-50 disabled:opacity-50 dark:border-gold-500 dark:text-gold-500 dark:hover:bg-gold-500/10"
          >
            {saved ? 'Study Saved' : 'Save Study'}
          </motion.button>
        </div>

        <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl font-bold font-serif text-maroon-700 dark:text-gray-50 mb-2">{result.metadata.work}</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-lg text-gray-600 dark:text-gray-300 mb-8">by {result.metadata.author}</motion.p>

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </motion.div>
  );
}

function MetadataTab({ result }: { result: AnalysisResult }) {
  const authorPhoto = useAuthorPhoto(result.metadata.author);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-gray-600 dark:text-gray-300 font-semibold">Author</p>
        <div className="mt-2 flex items-center gap-3">
          {authorPhoto ? (
            <img
              src={authorPhoto.thumbnail}
              alt={`Portrait of ${result.metadata.author}`}
              className="h-16 w-16 rounded-full object-cover border-2 border-maroon-100 dark:border-gold-500/30"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-maroon-100 text-xl font-semibold text-maroon-700 dark:bg-gold-500/20 dark:text-gold-500"
            >
              {getInitials(result.metadata.author)}
            </div>
          )}
          <div>
            <p className="text-gray-900 dark:text-gray-50">{result.metadata.author}</p>
            {authorPhoto && (
              <a
                href={authorPhoto.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gray-500 hover:text-maroon-700 dark:text-gray-400 dark:hover:text-gold-500"
              >
                View on Wikipedia
              </a>
            )}
          </div>
        </div>
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

interface AuthorPhoto {
  thumbnail: string;
  url: string;
}

function useAuthorPhoto(author: string): AuthorPhoto | null {
  const [photo, setPhoto] = useState<AuthorPhoto | null>(null);

  useEffect(() => {
    const name = author.trim();
    if (!name) {
      setPhoto(null);
      return;
    }

    const controller = new AbortController();
    setPhoto(null);

    const params = new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: name,
      gsrnamespace: '0',
      gsrlimit: '1',
      prop: 'pageimages|info',
      inprop: 'url',
      piprop: 'thumbnail',
      pithumbsize: '240',
      format: 'json',
      origin: '*',
    });

    fetch(`https://en.wikipedia.org/w/api.php?${params}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const page = data?.query?.pages ? Object.values(data.query.pages)[0] as {
          thumbnail?: { source?: string };
          fullurl?: string;
        } : undefined;
        const thumbnail = page?.thumbnail?.source;
        if (thumbnail && page.fullurl) {
          setPhoto({ thumbnail, url: page.fullurl });
        }
      })
      .catch(() => {
        // A missing network connection or Wikipedia page should not affect analysis.
      });

    return () => controller.abort();
  }, [author]);

  return photo;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}
