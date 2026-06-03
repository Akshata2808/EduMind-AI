import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import api from '../api/axios.js';

const PDFSummaryPage = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  // Customization Options
  const [summaryLength, setSummaryLength] = useState('detailed');
  const [focusArea, setFocusArea] = useState('exam');

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        alert("Please drop a valid PDF file! 📄");
      }
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const upload = async (e) => {
    if (e) e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult(null); // Clear old results
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('summaryLength', summaryLength);
    formData.append('focusArea', focusArea);
    
    try {
      const { data } = await api.post('/ai/summarize', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      setResult(data.note);
      setActiveTab('summary');
    } catch (error) {
      setResult({ 
        summary: 'Ah! I encountered an issue parsing your PDF notes. Please make sure the PDF is readable and try uploading again! 📚', 
        highlights: [
          'Ensure the document is a readable text PDF, not a scanned image.',
          'Verify that the PDF file is under 10MB.',
          'Try reloading the webpage and resubmitting.'
        ], 
        questions: [
          'How can I convert scanned PDFs to readable text?',
          'What is the maximum size limit for upload?'
        ] 
      });
      setActiveTab('summary');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    let contentToCopy = '';
    
    if (activeTab === 'summary') {
      contentToCopy = result.summary;
    } else if (activeTab === 'highlights') {
      contentToCopy = result.highlights.join('\n');
    } else if (activeTab === 'questions') {
      contentToCopy = result.questions.join('\n');
    }

    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanText = (text) => {
    // Strips out leading numbers or symbols like "1. ", "✔ ", "• "
    return text.replace(/^[\d\.\-\*•✔\s▶]+/, '');
  };

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12 overflow-hidden">
      {/* Dynamic Background Blur Glows */}
      <div className="absolute top-1/10 left-1/12 -z-10 h-72 w-72 rounded-full bg-palegreen/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/10 right-1/12 -z-10 h-96 w-96 rounded-full bg-mint/15 blur-[120px] pointer-events-none" />

      {/* Main Grid Wrapper */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.25fr_0.85fr]">
        
        {/* Left Column: Core Upload Box */}
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white/70 backdrop-blur-md border border-sage/20 p-6 sm:p-8 shadow-soft relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute -left-16 -top-16 h-36 w-36 rounded-full bg-palegreen/20 blur-2xl pointer-events-none" />
            <div className="absolute -right-16 -bottom-16 h-36 w-36 rounded-full bg-mint/20 blur-2xl pointer-events-none" />

            {/* Title Block */}
            <div className="mb-8 text-center relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/60 border border-sage/30 px-4.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.25em] text-emerald-950">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                PDF Smart Summarizer
              </span>
              <h1 className="mt-4 text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
                Drop Your Notes & Summarize Instantly!
              </h1>
              <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed max-w-lg mx-auto">
                Transform complex engineering lectures and textbooks into high-yield study notes. Upload your PDFs to extract executive summaries, core key takeaways, and relevant oral viva questions.
              </p>
            </div>

            {/* Interactive Upload Zone Form */}
            <form 
              onSubmit={upload} 
              onDragEnter={handleDrag} 
              onDragOver={handleDrag} 
              onDragLeave={handleDrag} 
              onDrop={handleDrop} 
              className="relative z-10 flex flex-col items-center justify-center"
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="application/pdf" 
                onChange={handleFileInputChange} 
                className="hidden" 
              />

              {/* Drag & Drop Zone Container */}
              <div 
                onClick={onButtonClick}
                className={`w-full rounded-[28px] border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-350 shadow-sm ${
                  dragActive 
                    ? 'border-emerald-500 bg-mint/30 scale-[1.01]' 
                    : 'border-sage/30 bg-white/90 hover:border-sage hover:bg-mint/10'
                }`}
              >
                {/* Mascot Image Container with laser scan lines */}
                <div className="relative mx-auto my-4 flex h-48 w-48 items-center justify-center rounded-[24px] bg-gradient-to-br from-mint/45 to-palegreen/25 border border-sage/20 p-4 shadow-sm overflow-hidden">
                  
                  {/* Ready for the customized Lottie Animation file */}
                  <DotLottieReact
                    src="https://lottie.host/6a4ec771-4884-44f7-b1eb-1912245f3edc/5FJYAEhIst.lottie"
                    loop
                    autoplay
                    className="h-40 w-40 object-contain z-10"
                  />
                  
                  {/* Laser Scanning Line */}
                  {loading && (
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }} 
                      transition={{ 
                        duration: 2.2, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }} 
                      className="absolute left-0 right-0 h-1.5 bg-emerald-500 shadow-[0_0_15px_#10b981,0_0_8px_#10b981] z-20"
                    />
                  )}

                  {/* Scanning Overlay Grid Pattern */}
                  {loading && (
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-emerald-50/15 to-emerald-500/5 animate-pulse" />
                  )}
                </div>

                {file ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-4 inline-flex items-center gap-2.5 rounded-full bg-palegreen border border-sage/40 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-sm"
                  >
                    📄 {file.name} ({Math.round(file.size / 1024)} KB)
                  </motion.div>
                ) : (
                  <div className="mt-4 text-xs font-semibold text-slate-500">
                    <span className="text-emerald-800 font-extrabold underline">Click to upload</span> or drag & drop your study PDF here
                    <p className="mt-1 text-[10px] text-slate-400">PDF documents only (max 10MB)</p>
                  </div>
                )}
              </div>

              {/* Action Trigger Button */}
              {file && (
                <motion.button 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  type="submit" 
                  disabled={loading} 
                  className="mt-6 w-full sm:w-auto rounded-full bg-slate-900 px-10 py-4 text-xs font-bold text-white shadow-lg transition duration-200 hover:bg-slate-950 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: '300ms' }} />
                      Analyzing PDF...
                    </>
                  ) : (
                    '🚀 Start Summarizing!'
                  )}
                </motion.button>
              )}
            </form>
          </div>

          {/* Interactive Results Display Card */}
          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="rounded-[32px] border border-sage/20 bg-white/70 backdrop-blur-md p-6 sm:p-8 shadow-soft relative z-10"
              >
                {/* Result Section Tabs Header */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-sage/15 pb-4 mb-6 gap-4">
                  <div className="flex rounded-full bg-slate-100 border border-sage/20 p-1 shadow-inner relative w-full sm:w-auto">
                    <button 
                      onClick={() => setActiveTab('summary')}
                      className={`flex-1 sm:flex-initial rounded-full px-5 py-2 text-xs font-bold transition duration-300 ${activeTab === 'summary' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Summary
                    </button>
                    <button 
                      onClick={() => setActiveTab('highlights')}
                      className={`flex-1 sm:flex-initial rounded-full px-5 py-2 text-xs font-bold transition duration-300 ${activeTab === 'highlights' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Key Takeaways
                    </button>
                    <button 
                      onClick={() => setActiveTab('questions')}
                      className={`flex-1 sm:flex-initial rounded-full px-5 py-2 text-xs font-bold transition duration-300 ${activeTab === 'questions' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Viva Prep
                    </button>
                  </div>

                  {/* Copy Button */}
                  <button 
                    onClick={handleCopy}
                    className="rounded-full border border-sage/35 bg-white px-5 py-2 text-xs font-bold text-slate-800 transition duration-300 hover:bg-mint/35 hover:text-emerald-950 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>{copied ? '✔ Copied!' : '📋 Copy Tab'}</span>
                  </button>
                </div>

                {/* Tab Contents */}
                <div className="min-h-[220px]">
                  {activeTab === 'summary' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl select-none">📝</span>
                        <h2 className="text-base font-extrabold text-slate-950 tracking-tight">Executive Summary</h2>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line bg-white rounded-2xl border border-sage/15 p-5 shadow-sm">
                        {result.summary}
                      </p>
                    </motion.div>
                  )}

                  {activeTab === 'highlights' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl select-none">📌</span>
                        <h2 className="text-base font-extrabold text-slate-950 tracking-tight">Key Takeaways</h2>
                      </div>
                      
                      <div className="bg-white rounded-2xl border border-sage/15 p-5 shadow-sm">
                        {result.highlights && result.highlights.length > 0 ? (
                          <ul className="space-y-3.5">
                            {result.highlights.map((point, idx) => (
                              <motion.li 
                                key={idx} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.08 }}
                                className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed font-semibold"
                              >
                                <span className="text-emerald-600 mt-1 select-none font-bold">✔</span>
                                <span>{cleanText(point)}</span>
                              </motion.li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs font-semibold text-slate-500 italic">No key points extracted from this document.</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'questions' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl select-none">❓</span>
                        <h2 className="text-base font-extrabold text-slate-950 tracking-tight">Viva Preparation Questions</h2>
                      </div>

                      <div className="bg-white rounded-2xl border border-sage/15 p-5 shadow-sm">
                        {result.questions && result.questions.length > 0 ? (
                          <ul className="space-y-3.5">
                            {result.questions.map((item, idx) => (
                              <motion.li 
                                key={idx}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.08 }}
                                className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed font-semibold"
                              >
                                <span className="text-sage mt-1 select-none font-extrabold">▶</span>
                                <span>{cleanText(item)}</span>
                              </motion.li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs font-semibold text-slate-500 italic">No viva prep questions generated.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Customization Settings & Process Guide (To enrich overall content) */}
        <div className="space-y-6">
          
          {/* Summary Preferences Card */}
          <div className="rounded-[32px] border border-sage/20 bg-white/70 backdrop-blur-md p-6 shadow-soft card-3d">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Summary Preferences
            </h3>
            
            <div className="mt-6 space-y-5">
              {/* Length Selection */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Summary Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => setSummaryLength('bullet')}
                    className={`rounded-2xl border p-3 text-center text-xs font-bold transition duration-200 ${
                      summaryLength === 'bullet' 
                        ? 'border-emerald-600 bg-mint/35 text-slate-950 shadow-sm' 
                        : 'border-sage/10 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Quick Bullets
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSummaryLength('detailed')}
                    className={`rounded-2xl border p-3 text-center text-xs font-bold transition duration-200 ${
                      summaryLength === 'detailed' 
                        ? 'border-emerald-600 bg-mint/35 text-slate-950 shadow-sm' 
                        : 'border-sage/10 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Deep Study Guide
                  </button>
                </div>
              </div>

              {/* Focus Toggle */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Curriculum Target</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => setFocusArea('exam')}
                    className={`rounded-2xl border p-3 text-center text-xs font-bold transition duration-200 ${
                      focusArea === 'exam' 
                        ? 'border-emerald-600 bg-mint/35 text-slate-950 shadow-sm' 
                        : 'border-sage/10 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Mumbai MU focus
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFocusArea('general')}
                    className={`rounded-2xl border p-3 text-center text-xs font-bold transition duration-200 ${
                      focusArea === 'general' 
                        ? 'border-emerald-600 bg-mint/35 text-slate-950 shadow-sm' 
                        : 'border-sage/10 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    General Textbook
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Process Timeline Card */}
          <div className="rounded-[32px] border border-sage/20 bg-white/70 backdrop-blur-md p-6 shadow-soft card-3d">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              How it works
            </h3>
            
            <div className="mt-6 space-y-5">
              <div className="flex gap-4">
                <div className="flex h-7 w-7 select-none shrink-0 items-center justify-center rounded-full bg-mint/60 border border-sage/35 text-[10px] font-black text-slate-900">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">Drag & Upload Notes</h4>
                  <p className="mt-1 text-[10px] font-semibold text-slate-500 leading-normal">
                    Submit your lecture slides, textbook sections, or review sheets in PDF format.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-7 w-7 select-none shrink-0 items-center justify-center rounded-full bg-mint/60 border border-sage/35 text-[10px] font-black text-slate-900">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">Set Preferences</h4>
                  <p className="mt-1 text-[10px] font-semibold text-slate-500 leading-normal">
                    Select target curriculum alignment (e.g. Mumbai University syllabus focus).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-7 w-7 select-none shrink-0 items-center justify-center rounded-full bg-mint/60 border border-sage/35 text-[10px] font-black text-slate-900">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">Generate Study Aids</h4>
                  <p className="mt-1 text-[10px] font-semibold text-slate-500 leading-normal">
                    Get condensed summaries, key takeaways, and relevant oral viva questions.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
};

export default PDFSummaryPage;
