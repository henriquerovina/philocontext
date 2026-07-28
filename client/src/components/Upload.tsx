import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface UploadProps {
  onAnalyze: (file: File) => void;
  loading: boolean;
  error: string | null;
}

export default function Upload({ onAnalyze, loading, error }: UploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isImageFile = (f: File | null) => {
    if (!f) return false;
    return f.type.startsWith('image/');
  };

  useEffect(() => {
    if (file && isImageFile(file)) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

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
        <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl font-bold font-serif text-maroon-700 dark:text-gray-50">
          Philocontext
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-lg text-gray-600 dark:text-gray-300">
          Understand philosophy papers instantly
        </motion.p>

        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-100 dark:border-maroon-700">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
              isDragging ? 'border-maroon-700 dark:border-gold-500 bg-maroon-50 dark:bg-gold-500/10' : 'border-gray-300 dark:border-gray-600 hover:border-maroon-700/40 dark:hover:border-gold-500/40'
            }`}
          >
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="block cursor-pointer">
              {previewUrl ? (
                <div className="space-y-3">
                  <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                  <p className="text-gray-600 dark:text-gray-300 text-sm truncate">{file?.name}</p>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  {file ? file.name : 'Drag PDF or image here or click to select'}
                </p>
              )}
            </label>
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={!file || loading}
            className="w-full mt-6 bg-maroon-700 hover:bg-maroon-800 dark:bg-gold-500 dark:hover:bg-gold-700 dark:text-maroon-900 text-white py-2 rounded-lg font-semibold disabled:opacity-50 transition-colors"
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
