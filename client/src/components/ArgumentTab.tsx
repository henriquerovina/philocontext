import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArgumentAnalysis, Objection } from '../types/api';

interface ArgumentTabProps {
  argument: ArgumentAnalysis;
}

type SectionId = 'thesis' | 'premises' | 'reconstructions' | 'fallacies' | 'objections';

export default function ArgumentTab({ argument }: ArgumentTabProps) {
  const [openSections, setOpenSections] = useState<Set<SectionId>>(new Set(['thesis']));
  const [objectionFilter, setObjectionFilter] = useState<'all' | 'contemporary' | 'later'>('all');

  const toggleSection = (id: SectionId) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredObjections = argument.objections.filter((o) => {
    if (objectionFilter === 'all') return true;
    return o.era.toLowerCase() === objectionFilter;
  });

  const Section = ({
    id,
    title,
    children,
    accent = 'maroon',
  }: {
    id: SectionId;
    title: string;
    children: React.ReactNode;
    accent?: 'maroon' | 'gold' | 'blue' | 'plum';
  }) => {
    const isOpen = openSections.has(id);
    const accentMap = {
      maroon: 'border-maroon-700 bg-maroon-50 dark:bg-maroon-800/30 dark:border-maroon-600',
      gold: 'border-gold-500 bg-gold-50 dark:bg-gold-500/10 dark:border-gold-500',
      blue: 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 dark:border-blue-500',
      plum: 'border-plum-500 bg-plum-500/5 dark:bg-plum-500/10 dark:border-plum-500',
    };
    const titleColorMap = {
      maroon: 'text-maroon-700 dark:text-gold-500',
      gold: 'text-gold-700 dark:text-gold-500',
      blue: 'text-blue-700 dark:text-blue-500',
      plum: 'text-plum-700 dark:text-plum-500',
    };
    return (
      <div className={`rounded-lg border-2 overflow-hidden ${accentMap[accent]}`}>
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between px-4 py-3 font-semibold text-left hover:opacity-80 transition"
        >
          <span className={`${titleColorMap[accent]} text-lg`}>{title}</span>
          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className={`${titleColorMap[accent]}`}>
            ▼
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-1 bg-white dark:bg-gray-800">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Section id="thesis" title="Thesis" accent="maroon">
        <blockquote className="border-l-4 border-maroon-700 dark:border-gold-500 pl-4 italic text-gray-800 dark:text-gray-100 bg-maroon-50 dark:bg-maroon-900/30 py-3 rounded-r">
          "{argument.thesis.original}"
        </blockquote>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-maroon-700 dark:text-gold-500">Simplified: </span>
          {argument.thesis.simplified}
        </p>
        <pre className="mt-3 bg-gray-900 text-gold-100 dark:bg-maroon-900 dark:text-gray-50 p-3 rounded-lg overflow-x-auto text-sm font-mono border border-gray-700 dark:border-maroon-700">
          {argument.thesis.logical_form}
        </pre>
      </Section>

      <Section id="premises" title="Premises & Conclusion" accent="blue">
        <div className="space-y-4">
          <ol className="space-y-3">
            {argument.premises.map((premise, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <div className="flex-1 space-y-1">
                  <p className="text-gray-900 dark:text-gray-50 font-medium">"{premise.original}"</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    <span className="text-blue-700 dark:text-blue-500 font-semibold">Simplified: </span>
                    {premise.simplified}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-maroon-700 text-white flex items-center justify-center text-sm font-bold">
                ∴
              </span>
              <div className="flex-1 space-y-1">
                <p className="text-gray-900 dark:text-gray-50 font-semibold">"{argument.conclusion.original}"</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  <span className="text-maroon-700 dark:text-gold-500 font-semibold">Simplified: </span>
                  {argument.conclusion.simplified}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="reconstructions" title="Formal Reconstructions" accent="plum">
        <div className="grid gap-3">
          {argument.reconstructions.map((rec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-lg border border-plum-500/20 dark:border-plum-500/30 bg-plum-500/5 dark:bg-plum-500/10 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-plum-500 text-white text-xs font-bold uppercase">
                  {rec.type.replace(/_/g, ' ')}
                </span>
              </div>
              <pre className="text-plum-700 dark:text-plum-500 font-mono font-bold text-base mb-2 whitespace-pre-wrap">
                {rec.formal}
              </pre>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{rec.plain}</p>
            </motion.div>
          ))}
          {argument.reconstructions.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 italic">No formal reconstructions provided.</p>
          )}
        </div>
      </Section>

      <Section id="fallacies" title="Fallacies" accent="gold">
        {argument.fallacies.length === 0 ? (
          <p className="text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg px-4 py-3 font-medium">
            ✓ No logical fallacies detected
          </p>
        ) : (
          <div className="grid gap-3">
            {argument.fallacies.map((fallacy, idx) => (
              <div key={idx} className="rounded-lg border border-gold-500/30 bg-gold-50 dark:bg-gold-500/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-gold-500 text-maroon-900 text-xs font-bold uppercase">
                    {fallacy.name.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-200 text-sm mb-2">{fallacy.description}</p>
                <blockquote className="border-l-2 border-gold-500 pl-3 italic text-gray-600 dark:text-gray-300 text-sm bg-white dark:bg-gray-900/50 py-2 rounded-r">
                  "{fallacy.found_in_text}"
                </blockquote>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section id="objections" title="Objections" accent="maroon">
        <div className="flex gap-2 mb-4">
          {(['all', 'contemporary', 'later'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setObjectionFilter(filter)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                objectionFilter === filter
                  ? 'bg-maroon-700 text-white dark:bg-gold-500 dark:text-maroon-900'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-maroon-50 dark:hover:bg-maroon-800'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
        <div className="grid gap-3">
          {filteredObjections.map((obj: Objection, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-lg border border-gray-200 dark:border-maroon-700 bg-white dark:bg-gray-800 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-bold text-maroon-700 dark:text-gold-500">{obj.critic}</h4>
                <div className="flex gap-1.5 flex-shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      obj.era.toLowerCase() === 'contemporary'
                        ? 'bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-500 border border-blue-500/20'
                        : 'bg-plum-500/10 text-plum-700 dark:bg-plum-500/20 dark:text-plum-500 border border-plum-500/20'
                    }`}
                  >
                    {obj.era}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      obj.popularity.toLowerCase() === 'major'
                        ? 'bg-maroon-700 text-white dark:bg-gold-500 dark:text-maroon-900'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {obj.popularity}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 text-sm mb-2">{obj.summary}</p>
              <div className="bg-gray-50 dark:bg-maroon-900/30 border border-gray-100 dark:border-maroon-700 rounded p-3 mt-2">
                <p className="text-xs font-semibold text-maroon-700 dark:text-gold-500 mb-1">Response:</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{obj.response}</p>
              </div>
            </motion.div>
          ))}
          {filteredObjections.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 italic">No objections in this category.</p>
          )}
        </div>
      </Section>
    </div>
  );
}
