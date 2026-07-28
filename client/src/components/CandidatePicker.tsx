import { motion } from 'framer-motion';
import { PaperCandidate } from '../types/api';

interface CandidatePickerProps {
  candidates: PaperCandidate[];
  onSelect: (candidate: PaperCandidate) => void;
  onBack: () => void;
  loading: boolean;
}

export default function CandidatePicker({ candidates, onSelect, onBack, loading }: CandidatePickerProps) {
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-lg space-y-6">
        <div>
          <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl font-bold font-serif text-maroon-700 dark:text-gray-50">
            Select Your Reading
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            We found these matches for your description. Please choose the one you were looking for:
          </motion.p>
        </div>

        <div className="space-y-4">
          {candidates.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-100 dark:border-maroon-700 text-center">
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                We couldn't recognize any specific philosophy paper from your description.
              </p>
              <button
                type="button"
                onClick={onBack}
                className="bg-maroon-700 hover:bg-maroon-800 dark:bg-gold-500 dark:hover:bg-gold-700 dark:text-maroon-900 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
              >
                Try Describing Again
              </button>
            </div>
          ) : (
            candidates.map((candidate, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
              >
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onSelect(candidate)}
                  className="w-full text-left bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg p-5 border border-gray-100 dark:border-maroon-700 hover:border-maroon-700 dark:hover:border-gold-500 transition group cursor-pointer disabled:opacity-50"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-maroon-700 dark:text-gray-50 group-hover:text-maroon-800 dark:group-hover:text-gold-400 transition-colors">
                        {candidate.work}
                      </h3>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">
                        {candidate.author} <span className="text-gray-400 dark:text-gray-500 font-normal">({candidate.period})</span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="inline-block bg-maroon-50 dark:bg-gold-500/10 text-maroon-700 dark:text-gold-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-maroon-200 dark:border-gold-500/30">
                        {candidate.confidence * 10}% match
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic line-clamp-2">
                    "{candidate.reasoning}"
                  </p>
                </button>
              </motion.div>
            ))
          )}
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            ← None of these? Describe differently or upload file
          </button>
        </div>
      </div>
    </motion.div>
  );
}
