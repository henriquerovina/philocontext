import { ChangeEvent, FormEvent, useState } from 'react';
import { motion } from 'framer-motion';

interface UploadProps {
  onAnalyze: (file: File) => void;
  loading: boolean;
  error: string | null;
}

export default function Upload({ onAnalyze, loading, error }: UploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (file) onAnalyze(file);
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-md space-y-6">
        <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl font-bold font-serif text-ink-900 dark:text-surface-50">
          Philocontext
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-lg text-ink-800/70 dark:text-surface-100/70">
          Understand philosophy papers instantly
        </motion.p>

        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface-50 dark:bg-ink-800 rounded-lg shadow-lg p-8">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
              isDragging ? 'border-ink-800 dark:border-surface-50 bg-ink-800/10 dark:bg-surface-50/10' : 'border-ink-800/20 dark:border-surface-50/20 dark:hover:border-surface-50/40'
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="block cursor-pointer">
              <p className="text-ink-800/70 dark:text-surface-100/70">
                {file ? file.name : 'Drag PDF here or click to select'}
              </p>
            </label>
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={!file || loading}
            className="w-full mt-6 bg-ink-800 hover:bg-ink-900 dark:bg-surface-100 dark:hover:bg-surface-200 dark:text-ink-900 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-1.5">
                Analyzing
                <span className="inline-flex gap-0.5">
                  {[0, 0.2, 0.4].map((d) => (
                    <span key={d} className="w-1.5 h-1.5 bg-current rounded-full animate-pulse-dot" style={{ animationDelay: `${d}s` }} />
                  ))}
                </span>
              </span>
            ) : 'Analyze'}
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
}
