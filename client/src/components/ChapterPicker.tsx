import { motion } from 'framer-motion';
import { ChapterInfo } from '../types/api';

interface ChapterRange {
  start_page: number;
  end_page: number;
}

interface ChapterPickerProps {
  chapters: ChapterInfo[];
  totalPages: number;
  onSelect: (range: ChapterRange | null) => void;
  onBack: () => void;
  loading: boolean;
}

const MAX_WHOLE_BOOK_PAGES = 50;

export default function ChapterPicker({ chapters, totalPages, onSelect, onBack, loading }: ChapterPickerProps) {
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
            Pick a Chapter
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            This book has {totalPages} pages. Choose a chapter to analyze, or stick with the whole book (only the first {MAX_WHOLE_BOOK_PAGES} pages will be used):
          </motion.p>
        </div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <button
              type="button"
              disabled={loading}
              onClick={() => onSelect(null)}
              className="w-full text-left bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg p-5 border border-gray-100 dark:border-maroon-700 hover:border-maroon-700 dark:hover:border-gold-500 transition group cursor-pointer disabled:opacity-50"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-maroon-700 dark:text-gray-50 group-hover:text-maroon-800 dark:group-hover:text-gold-400 transition-colors">
                    Whole Book
                  </h3>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">
                    First {Math.min(MAX_WHOLE_BOOK_PAGES, totalPages)} of {totalPages} pages
                  </p>
                </div>
              </div>
            </button>
          </motion.div>

          {chapters.map((chapter, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.05 }}
            >
              <button
                type="button"
                disabled={loading}
                onClick={() => onSelect({ start_page: chapter.start_page, end_page: chapter.end_page })}
                className="w-full text-left bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg p-5 border border-gray-100 dark:border-maroon-700 hover:border-maroon-700 dark:hover:border-gold-500 transition group cursor-pointer disabled:opacity-50"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-maroon-700 dark:text-gray-50 group-hover:text-maroon-800 dark:group-hover:text-gold-400 transition-colors">
                      {chapter.title}
                    </h3>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block bg-maroon-50 dark:bg-gold-500/10 text-maroon-700 dark:text-gold-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-maroon-200 dark:border-gold-500/30">
                      Pages {chapter.start_page}-{chapter.end_page}
                    </span>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            ← Upload a different file
          </button>
        </div>
      </div>
    </motion.div>
  );
}
