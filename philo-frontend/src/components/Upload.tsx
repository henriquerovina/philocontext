import { ChangeEvent, FormEvent, useState } from 'react';

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Philocontext</h1>
        <p className="text-lg text-gray-600 mb-8">Understand philosophy papers instantly</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
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
              <p className="text-gray-600">
                {file ? file.name : 'Drag PDF here or click to select'}
              </p>
            </label>
          </div>

          {error && <p className="text-red-600 mt-4">{error}</p>}

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg font-semibold disabled:opacity-50 hover:bg-blue-700"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
      </div>
    </div>
  );
}
