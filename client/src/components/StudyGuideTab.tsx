import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StudyGuide, ConceptGuide } from '../types/api';

interface StudyGuideTabProps {
  data: StudyGuide | null;
}

function ConceptCard({ item, index }: { item: ConceptGuide; index: number }) {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="bg-white dark:bg-maroon-800/40 border border-gray-200 dark:border-maroon-700/50 rounded-lg shadow-sm overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-maroon-700/30 transition-colors"
      >
        <h3 className="text-lg font-semibold font-serif text-maroon-700 dark:text-gold-500">
          {item.concept}
        </h3>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-maroon-700 dark:text-gold-500 text-sm ml-4 flex-shrink-0"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-gray-100 dark:border-maroon-700/30 pt-4">
              {/* Definition */}
              <div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-white bg-maroon-700 dark:bg-gold-500 dark:text-maroon-900 px-2 py-0.5 rounded mb-1.5">
                  Definition
                </span>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  {item.definition}
                </p>
              </div>

              {/* Stakes */}
              {item.stakes && (
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-white bg-blue-600 dark:bg-blue-500 px-2 py-0.5 rounded mb-1.5">
                    Why It Matters
                  </span>
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                    {item.stakes}
                  </p>
                </div>
              )}

              {/* Exam Trap */}
              {item.exam_trap && (
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-white bg-red-600 dark:bg-red-500 px-2 py-0.5 rounded mb-1.5">
                    Exam Trap
                  </span>
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded p-3 text-sm">
                    {item.exam_trap}
                  </p>
                </div>
              )}

              {/* Source Quotes */}
              {item.source_quotes && item.source_quotes.length > 0 && (
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 px-2 py-0.5 mb-1.5">
                    From The Text
                  </span>
                  <div className="space-y-2">
                    {item.source_quotes.map((q, j) => (
                      <blockquote
                        key={j}
                        className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 italic text-gray-600 dark:text-gray-300 text-sm bg-blue-50/50 dark:bg-blue-500/5 rounded-r"
                      >
                        "{q}"
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function StudyGuideTab({ data }: StudyGuideTabProps) {
  if (!data || !data.concepts || data.concepts.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic py-8 text-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        Study guide could not be generated.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.concepts.map((concept, i) => (
        <ConceptCard key={`${concept.concept}-${i}`} item={concept} index={i} />
      ))}
    </div>
  );
}
