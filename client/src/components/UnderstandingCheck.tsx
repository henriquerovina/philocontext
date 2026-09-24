import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult, DebateQuestion, AnswerEvaluation } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

interface UnderstandingCheckProps {
  result: AnalysisResult;
}

type Stage = 'loading' | 'question' | 'evaluating' | 'feedback' | 'done' | 'error';

function getSpeechRecognition(): any {
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

export default function UnderstandingCheck({ result }: UnderstandingCheckProps) {
  const [stage, setStage] = useState<Stage>('loading');
  const [questions, setQuestions] = useState<DebateQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [evaluations, setEvaluations] = useState<AnswerEvaluation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const listeningRef = useRef(false);

  const SpeechRecognition = getSpeechRecognition();
  const currentQuestion = questions[currentIndex] ?? null;
  const total = questions.length;
  const progress = ((currentIndex) / total) * 100;

  // Fetch questions on mount
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch(`${API_URL}/api/debate/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            metadata: result.metadata,
            raw_text: result.raw_text ?? '',
            study_guide_concepts: result.exam_study_guide?.concepts ?? [],
            count: 6,
          }),
        });
        if (!response.ok) throw new Error('Failed to generate questions');
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setQuestions(data.questions ?? []);
        setStage('question');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
        setStage('error');
      }
    }
    fetchQuestions();
  }, [result]);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      setAnswer((prev) => prev + (prev ? ' ' : '') + text);
    };

    recognition.onerror = () => {
      setIsListening(false);
      listeningRef.current = false;
    };

    recognition.onend = () => {
      if (!listeningRef.current) return;
      setIsListening(false);
      listeningRef.current = false;
    };

    try {
      recognitionRef.current = recognition;
      listeningRef.current = true;
      recognition.start();
      setIsListening(true);
    } catch {
      listeningRef.current = false;
      setIsListening(false);
      setError('Microphone access denied. Check browser permissions or type your answer.');
    }
  }, [SpeechRecognition]);

  const stopListening = useCallback(() => {
    listeningRef.current = false;
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const submitAnswer = useCallback(async () => {
    if (!currentQuestion || !answer.trim()) return;
    setStage('evaluating');
    try {
      const response = await fetch(`${API_URL}/api/debate/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          user_answer: answer.trim(),
          metadata: result.metadata,
        }),
      });
      if (!response.ok) throw new Error('Evaluation failed');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setEvaluation(data);
      setEvaluations((prev) => [...prev, data]);
      setStage('feedback');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Evaluation failed');
      setStage('error');
    }
  }, [currentQuestion, answer, result.metadata]);

  const nextQuestion = useCallback(() => {
    setAnswer('');
    setEvaluation(null);
    setError(null);
    if (currentIndex + 1 >= total) {
      setStage('done');
    } else {
      setCurrentIndex((prev) => prev + 1);
      setStage('question');
    }
  }, [currentIndex, total]);

  const scoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600 dark:text-green-400';
    if (score >= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const scoreLabel = (score: number) => {
    if (score === 5) return 'Excellent';
    if (score === 4) return 'Good';
    if (score === 3) return 'Partial';
    if (score === 2) return 'Weak';
    return 'Incorrect';
  };

  // --- Loading ---
  if (stage === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-8 h-8 border-2 border-maroon-700 dark:border-gold-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-300">Generating exam questions…</p>
      </div>
    );
  }

  // --- Error ---
  if (stage === 'error') {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-maroon-700 hover:bg-maroon-800 dark:bg-gold-500 dark:hover:bg-gold-700 text-white dark:text-maroon-900 px-4 py-2 rounded transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // --- Done (summary) ---
  if (stage === 'done') {
    const avgScore = evaluations.length > 0
      ? (evaluations.reduce((s, e) => s + e.score, 0) / evaluations.length).toFixed(1)
      : '—';
    const weakConcepts = evaluations
      .filter((e) => e.score <= 2)
      .map((e) => e.suggested_study)
      .filter(Boolean);

    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto py-12 space-y-6 text-center">
        <h2 className="text-2xl font-bold font-serif text-maroon-700 dark:text-gray-50">Session Complete</h2>
        <div className="bg-white dark:bg-maroon-800/40 border border-gray-200 dark:border-maroon-700/50 rounded-lg p-6 space-y-4">
          <p className="text-4xl font-bold text-maroon-700 dark:text-gold-500">{avgScore}/5</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Average score across {evaluations.length} questions</p>
          {weakConcepts.length > 0 && (
            <div className="text-left pt-4 border-t border-gray-100 dark:border-maroon-700/30">
              <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Areas to re-study:</p>
              <ul className="space-y-1">
                {weakConcepts.map((c, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300">• {c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          onClick={() => { setStage('question'); setCurrentIndex(0); setEvaluations([]); setAnswer(''); setEvaluation(null); }}
          className="bg-maroon-700 hover:bg-maroon-800 dark:bg-gold-500 dark:hover:bg-gold-700 text-white dark:text-maroon-900 px-6 py-2 rounded transition-colors"
        >
          Start Over
        </button>
      </motion.div>
    );
  }

  // --- Question / Evaluating / Feedback ---
  return (
    <div className="max-w-md mx-auto space-y-6 py-4">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Question {currentIndex + 1} of {total}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-maroon-600 to-gold-500 rounded-full"
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="bg-white dark:bg-maroon-800/40 border border-gray-200 dark:border-maroon-700/50 rounded-lg p-5 space-y-4"
        >
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-white bg-blue-600 dark:bg-blue-500 px-2 py-0.5 rounded mb-2">
              {currentQuestion?.concept_tested}
            </span>
            <h3 className="text-lg font-semibold font-serif text-maroon-700 dark:text-gold-500 leading-snug">
              {currentQuestion?.question}
            </h3>
          </div>

          {/* Hints */}
          {currentQuestion?.hints && currentQuestion.hints.length > 0 && stage === 'question' && (
            <details className="text-sm text-gray-500 dark:text-gray-400">
              <summary className="cursor-pointer hover:text-maroon-700 dark:hover:text-gold-500">Need a hint?</summary>
              <ul className="mt-2 space-y-1 pl-4">
                {currentQuestion.hints.map((h, i) => (
                  <li key={i}>• {h}</li>
                ))}
              </ul>
            </details>
          )}

          {/* Voice + Text Input */}
          {stage === 'question' && (
            <div className="space-y-3">
              {!SpeechRecognition && (
                <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Voice input is not supported in your browser. Use <strong>Chrome</strong> or <strong>Edge</strong> for voice support — or just type below.
                  </p>
                </div>
              )}
              {error && (
                <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
              )}
              {SpeechRecognition && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={isListening ? stopListening : startListening}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isListening
                          ? 'bg-red-600 text-white'
                          : 'bg-maroon-700 text-white hover:bg-maroon-800 dark:bg-gold-500 dark:text-maroon-900 dark:hover:bg-gold-700'
                      } ${isListening ? 'animate-pulse' : ''}`}
                    >
                      {isListening ? '🎤 Listening…' : '🎤 Speak'}
                    </motion.button>
                    {isListening && (
                      <button
                        onClick={stopListening}
                        className="text-sm text-red-600 dark:text-red-400 hover:underline"
                      >
                        Stop
                      </button>
                    )}
                  </div>
                  {isListening && (
                    <div className="bg-gray-900 dark:bg-gray-950 rounded-lg px-4 py-3">
                      <p className="text-sm text-gray-400 italic">Listening for your answer…</p>
                    </div>
                  )}
                </div>
              )}
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type or speak your answer…"
                rows={4}
                className={`w-full px-3 py-2 border rounded resize-none focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 transition-colors ${
                  isListening
                    ? 'border-red-400 dark:border-red-500 focus:ring-red-400 dark:focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-maroon-500 dark:focus:ring-gold-500'
                }`}
              />
              <button
                onClick={submitAnswer}
                disabled={!answer.trim()}
                className="w-full bg-maroon-700 hover:bg-maroon-800 dark:bg-gold-500 dark:hover:bg-gold-700 text-white dark:text-maroon-900 py-2 rounded disabled:opacity-50 transition-colors"
              >
                Submit Answer
              </button>
            </div>
          )}

          {/* Evaluating spinner */}
          {stage === 'evaluating' && (
            <div className="flex flex-col items-center py-8 space-y-3">
              <div className="w-8 h-8 border-2 border-maroon-700 dark:border-gold-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Evaluating…</p>
            </div>
          )}

          {/* Feedback */}
          {stage === 'feedback' && evaluation && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-2 border-t border-gray-100 dark:border-maroon-700/30">
              <div className="flex items-center gap-3">
                <span className={`text-3xl font-bold ${scoreColor(evaluation.score)}`}>
                  {evaluation.score}/5
                </span>
                <span className={`text-sm font-medium ${scoreColor(evaluation.score)}`}>
                  {scoreLabel(evaluation.score)}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{evaluation.feedback}</p>
              {evaluation.missing_points.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 mb-1">Missing</p>
                  <ul className="space-y-1">
                    {evaluation.missing_points.map((p, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-300">• {p}</li>
                    ))}
                  </ul>
                </div>
              )}
              {evaluation.suggested_study && (
                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800/50 rounded p-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">Re-study</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{evaluation.suggested_study}</p>
                </div>
              )}
              <button
                onClick={nextQuestion}
                className="w-full bg-maroon-700 hover:bg-maroon-800 dark:bg-gold-500 dark:hover:bg-gold-700 text-white dark:text-maroon-900 py-2 rounded transition-colors"
              >
                {currentIndex + 1 >= total ? 'See Summary' : 'Next Question'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
