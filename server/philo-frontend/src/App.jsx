import React, { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [section, setSection] = useState("Whole Book");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('section', section);

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/analyze-philosophy', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.error) {
        alert("Backend Error: " + result.error);
      } else {
        setData(result);
      }
    } catch (err) {
      alert("Connection failed! Run 'python api.py' first.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <header className="mb-10 border-b border-emerald-900 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black text-emerald-500 tracking-tighter italic">PhiloContext</h1>
          <p className="text-slate-400 font-mono text-xs mt-2 uppercase tracking-widest">UWL // COMPUTER SCIENCE & PHILOSOPHY</p>
        </div>

        <div className="flex gap-4 items-center">
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="bg-slate-900 text-emerald-400 border-2 border-emerald-500/50 p-3 px-6 rounded-full font-bold outline-none hover:border-emerald-500 transition-all cursor-pointer"
          >
            <option value="Whole Book">Whole Book</option>
            <option value="Preface">Preface</option>
            <option value="Section I">Section I</option>
            <option value="Section II">Section II</option>
            <option value="Section III">Section III</option>
          </select>

          <label className="cursor-pointer bg-emerald-500 text-black font-black py-4 px-12 rounded-full hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all">
            UPLOAD PDF
            <input type="file" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </header>

      {loading && (
        <div className="flex flex-col items-center justify-center mt-32">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 mb-6"></div>
          <p className="text-emerald-400 text-2xl font-black animate-pulse uppercase">Extracting Logic...</p>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-[75vh]">
          <div className="bg-slate-900 rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl">
            <iframe
              src={`http://127.0.0.1:8000/view-pdf/${data.metadata?.filename}`}
              className="w-full h-full"
              title="PDF Viewer"
            />
          </div>

          <div className="overflow-y-auto space-y-10 pr-4">
            <div className="bg-emerald-950/30 p-8 rounded-3xl border-2 border-emerald-500/50">
              <h2 className="text-emerald-400 font-black uppercase text-xs mb-2 tracking-widest">Metadata</h2>
              <p className="text-white text-4xl font-black">{data.metadata?.author}</p>
              <p className="text-emerald-200 text-xl italic mt-1">{data.metadata?.work}</p>
            </div>

            <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
              <h2 className="text-emerald-400 font-black uppercase text-sm mb-4 tracking-widest">Historical Atmosphere</h2>
              <p className="text-white text-[21px] leading-relaxed font-bold whitespace-pre-wrap">
                {data.historical_context}
              </p>
            </section>

            <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 pb-20">
              <h2 className="text-emerald-400 font-black uppercase text-sm mb-4 tracking-widest">Exam Study Guide</h2>
              <p className="text-white text-[21px] leading-relaxed font-bold whitespace-pre-wrap">
                {data.exam_study_guide}
              </p>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;