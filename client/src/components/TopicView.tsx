import { motion } from 'framer-motion';
import { TopicView as TopicViewType, Objection } from '../types/api';

interface TopicViewProps {
  view: TopicViewType;
  onNew: () => void;
}

export default function TopicView({ view, onNew }: TopicViewProps) {
  return (
    <div className="min-h-screen px-4 py-10 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold font-serif text-maroon-700 dark:text-gray-50">
          {view.philosopher} on {view.topic}
        </h1>
        <button
          onClick={onNew}
          className="flex-shrink-0 text-sm text-maroon-700 dark:text-gold-500 hover:underline font-medium"
        >
          ← New search
        </button>
      </div>

      <div className="rounded-lg border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-sm px-4 py-3">
        {view.disclaimer}
      </div>

      <div className="rounded-lg border-2 border-maroon-700 dark:border-maroon-600 bg-maroon-50 dark:bg-maroon-800/30 overflow-hidden">
        <div className="px-4 py-3">
          <span className="text-maroon-700 dark:text-gold-500 text-lg font-semibold">The View</span>
        </div>
        <div className="px-4 pb-4 pt-1 bg-white dark:bg-gray-800">
          <blockquote className="border-l-4 border-maroon-700 dark:border-gold-500 pl-4 text-gray-800 dark:text-gray-100 bg-maroon-50 dark:bg-maroon-900/30 py-3 rounded-r">
            {view.explanation}
          </blockquote>
        </div>
      </div>

      <div className="rounded-lg border-2 border-maroon-700 dark:border-maroon-600 overflow-hidden">
        <div className="px-4 py-3">
          <span className="text-maroon-700 dark:text-gold-500 text-lg font-semibold">Objections</span>
        </div>
        <div className="px-4 pb-4 pt-1 bg-white dark:bg-gray-800 grid gap-3">
          {view.objections.map((obj: Objection, idx: number) => (
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
          {view.objections.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 italic">No well-documented objections found.</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border-2 border-gold-500 bg-gold-50 dark:bg-gold-500/10 dark:border-gold-500 overflow-hidden">
        <div className="px-4 py-3">
          <span className="text-gold-700 dark:text-gold-500 text-lg font-semibold">Famous Quotes</span>
        </div>
        <div className="px-4 pb-4 pt-1 bg-white dark:bg-gray-800 space-y-3">
          {view.quotes.map((q, idx) => (
            <blockquote
              key={idx}
              className="border-l-4 border-gold-500 pl-4 italic text-gray-800 dark:text-gray-100 bg-gold-50 dark:bg-gold-500/10 py-3 rounded-r"
            >
              "{q.quote}"
              <footer className="mt-1 text-xs not-italic text-gray-500 dark:text-gray-400">{q.context}</footer>
            </blockquote>
          ))}
          {view.quotes.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 italic">No quotes available.</p>
          )}
          {view.quote_recognition_hint && (
            <div className="bg-gray-50 dark:bg-maroon-900/30 border border-gray-100 dark:border-maroon-700 rounded p-3 mt-4">
              <p className="text-xs font-semibold text-gold-700 dark:text-gold-500 mb-1">
                How to recognize {view.philosopher}'s quotes:
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{view.quote_recognition_hint}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
