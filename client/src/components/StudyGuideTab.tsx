import { useState, useCallback, useEffect } from 'react';
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

function FlashCardView({
  concepts,
}: { concepts: ConceptGuide[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [knownSet, setKnownSet] = useState<Set<number>>(new Set());
  const [learningSet, setLearningSet] = useState<Set<number>>(new Set());

  // Initialize shuffled order
  useEffect(() => {
    const order = concepts.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    setShuffledOrder(order);
  }, [concepts]);

  const effectiveIndex = isShuffled ? shuffledOrder[currentIndex] : currentIndex;
  const currentConcept = concepts[effectiveIndex];
  const isKnown = knownSet.has(effectiveIndex);
  const isLearning = learningSet.has(effectiveIndex);
  const knownCount = knownSet.size;
  const learningCount = learningSet.size;
  const total = concepts.length;
  const progress = ((knownCount + learningCount) / total) * 100;

  const handleFlip = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleShuffle = useCallback(() => {
    setIsShuffled(!isShuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  const handleMarkKnown = useCallback(() => {
    setKnownSet((prev) => {
      const next = new Set(prev);
      if (next.has(effectiveIndex)) {
        next.delete(effectiveIndex);
      } else {
        next.add(effectiveIndex);
        next.delete(effectiveIndex); // remove from learning if present
      }
      return next;
    });
    setLearningSet((prev) => {
      const next = new Set(prev);
      next.delete(effectiveIndex);
      return next;
    });
  }, [effectiveIndex]);

  const handleMarkLearning = useCallback(() => {
    setLearningSet((prev) => {
      const next = new Set(prev);
      if (next.has(effectiveIndex)) {
        next.delete(effectiveIndex);
      } else {
        next.add(effectiveIndex);
        next.delete(effectiveIndex); // remove from known if present
      }
      return next;
    });
    setKnownSet((prev) => {
      const next = new Set(prev);
      next.delete(effectiveIndex);
      return next;
    });
  }, [effectiveIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          if (!isFlipped) setIsFlipped(true);
          else handleNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (isFlipped) setIsFlipped(false);
          else handlePrev();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleMarkKnown();
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleMarkLearning();
          break;
      }
    },
    [isFlipped, handleNext, handlePrev, handleMarkKnown, handleMarkLearning]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Known: {knownCount}</span>
          <span>Still Learning: {learningCount}</span>
          <span>Total: {total}</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-maroon-600 to-gold-500 rounded-full"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
          {Math.round(progress)}% complete
        </p>
      </div>

      {/* Card Counter */}
      <div className="flex items-center justify-between w-full max-w-md">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Card {currentIndex + 1} of {total}
        </span>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={isShuffled}
            onChange={handleShuffle}
            className="w-4 h-4 accent-maroon-600 rounded"
          />
          Shuffle
        </label>
      </div>

      {/* Flashcard */}
      <motion.div
        onClick={handleFlip}
        onKeyDown={(e) => e.key === 'Enter' && handleFlip()}
        tabIndex={0}
        role="button"
        aria-label={isFlipped ? 'Flip back to concept' : 'Flip to reveal definition'}
        className="perspective-1000 w-full max-w-md cursor-pointer"
        style={{ minHeight: '280px' }}
      >
        <AnimatePresence mode="wait">
          {isFlipped ? (
            <motion.div
              key="back"
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: -90 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="relative w-full h-full transform-style-3d backface-hidden"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 w-full h-full bg-white dark:bg-maroon-800/60 border border-gray-200 dark:border-maroon-700/50 rounded-xl shadow-lg p-6 transform-style-3d backface-hidden rotate-y-180" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                <div className="space-y-5">
                  <h3 className="text-xl font-bold font-serif text-maroon-700 dark:text-gold-500 text-center">
                    {currentConcept.concept}
                  </h3>

                  <div className="space-y-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-white bg-maroon-700 dark:bg-gold-500 dark:text-maroon-900 px-2 py-0.5 rounded">
                      Definition
                    </span>
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-lg">
                      {currentConcept.definition}
                    </p>
                  </div>

                  {currentConcept.stakes && (
                    <div className="space-y-1 pt-2 border-t border-gray-100 dark:border-maroon-700/30">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-white bg-blue-600 dark:bg-blue-500 px-2 py-0.5 rounded">
                        Why It Matters
                      </span>
                      <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                        {currentConcept.stakes}
                      </p>
                    </div>
                  )}

                  {currentConcept.exam_trap && (
                    <div className="space-y-1 pt-2 border-t border-gray-100 dark:border-maroon-700/30">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-white bg-red-600 dark:bg-red-500 px-2 py-0.5 rounded">
                        Exam Trap
                      </span>
                      <p className="text-gray-700 dark:text-gray-200 leading-relaxed bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded p-3 text-sm">
                        {currentConcept.exam_trap}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="front"
              initial={{ rotateY: -90 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: 90 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="relative w-full h-full transform-style-3d backface-hidden"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 w-full h-full bg-white dark:bg-maroon-800/60 border border-gray-200 dark:border-maroon-700/50 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center transform-style-3d backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                <h3 className="text-2xl font-bold font-serif text-maroon-700 dark:text-gold-500 text-center">
                  {currentConcept.concept}
                </h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center"
                >
                  Click or press Space to flip
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between w-full max-w-md">
        <button
          onClick={handlePrev}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          disabled={total <= 1}
          aria-label="Previous card"
        >
          ◀ Prev
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleMarkLearning}
            className={isLearning
              ? 'px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg'
              : 'px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30'
            }
            aria-pressed={isLearning}
            aria-label={isLearning ? 'Remove from Still Learning' : 'Mark as Still Learning'}
          >
            ? Still Learning
          </button>
          <button
            onClick={handleMarkKnown}
            className={isKnown
              ? 'px-4 py-2 text-sm font-medium text-white bg-maroon-600 rounded-lg'
              : 'px-4 py-2 text-sm font-medium text-maroon-700 dark:text-gold-500 bg-maroon-50 dark:bg-maroon-900/20 border border-maroon-200 dark:border-maroon-800/50 rounded-lg hover:bg-maroon-100 dark:hover:bg-maroon-900/30'
            }
            aria-pressed={isKnown}
            aria-label={isKnown ? 'Remove from Known' : 'Mark as Known'}
          >
            ✓ Known
          </button>
        </div>

        <button
          onClick={handleNext}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          disabled={total <= 1}
          aria-label="Next card"
        >
          Next ▶
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        Space/→ flip&nbsp;|&nbsp;← back&nbsp;|&nbsp;↑ known&nbsp;|&nbsp;↓ learning
      </p>
    </div>
  );
}

export default function StudyGuideTab({ data }: StudyGuideTabProps) {
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);

  if (!data || !data.concepts || data.concepts.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic py-8 text-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        Study guide could not be generated.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        <button
          onClick={() => setIsFlashcardMode(false)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            !isFlashcardMode
              ? 'bg-white dark:bg-maroon-800/40 text-maroon-700 dark:text-gold-500 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          Detailed View
        </button>
        <button
          onClick={() => setIsFlashcardMode(true)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            isFlashcardMode
              ? 'bg-white dark:bg-maroon-800/40 text-maroon-700 dark:text-gold-500 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          Flashcards
        </button>
      </div>

      {isFlashcardMode ? (
        <FlashCardView concepts={data.concepts} />
      ) : (
        <div className="space-y-3">
          {data.concepts.map((concept, i) => (
            <ConceptCard key={`${concept.concept}-${i}`} item={concept} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}