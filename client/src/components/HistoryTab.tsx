import { motion } from 'framer-motion';
import { HistoricalContext } from '../types/api';

interface HistoryTabProps {
  data: HistoricalContext | null;
}

export default function HistoryTab({ data }: HistoryTabProps) {
  if (!data || !data.sections || data.sections.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic py-8 text-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        Historical context could not be generated.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sections */}
      {data.sections.map((section, i) => (
        <motion.div
          key={`${section.title}-${i}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
          className="bg-white dark:bg-maroon-800/40 border border-gray-200 dark:border-maroon-700/50 rounded-lg p-5 shadow-sm"
        >
          <h3 className="text-lg font-semibold font-serif text-maroon-700 dark:text-gold-500 mb-2">
            {section.title}
          </h3>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-3">
            {section.content}
          </p>
          {section.source_quotes && section.source_quotes.length > 0 && (
            <div className="space-y-2 mt-3">
              {section.source_quotes.map((q, j) => (
                <blockquote
                  key={j}
                  className="border-l-4 border-gold-500 dark:border-gold-500/60 pl-4 py-2 italic text-gray-600 dark:text-gray-300 text-sm bg-gold-50/50 dark:bg-gold-500/5 rounded-r"
                >
                  "{q}"
                </blockquote>
              ))}
            </div>
          )}
        </motion.div>
      ))}

      {/* Timeline */}
      {data.timeline && data.timeline.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: data.sections.length * 0.08, duration: 0.3 }}
          className="bg-white dark:bg-maroon-800/40 border border-gray-200 dark:border-maroon-700/50 rounded-lg p-5 shadow-sm"
        >
          <h3 className="text-lg font-semibold font-serif text-maroon-700 dark:text-gold-500 mb-4">
            Timeline
          </h3>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[38px] top-2 bottom-2 w-px bg-gray-200 dark:bg-maroon-600/50" />
            <div className="space-y-4">
              {data.timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (data.sections.length + i) * 0.05 }}
                  className="flex gap-4 relative"
                >
                  <div className="flex-shrink-0 w-[80px] text-right">
                    <span className="inline-block bg-maroon-50 dark:bg-gold-500/20 text-maroon-700 dark:text-gold-500 text-xs font-mono font-semibold px-2 py-1 rounded">
                      {item.date}
                    </span>
                  </div>
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-maroon-700 dark:bg-gold-500 mt-1.5 relative z-10 border-2 border-white dark:border-maroon-800" />
                  <span className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed flex-1">
                    {item.event}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
