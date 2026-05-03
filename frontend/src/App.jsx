import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ClassesSection from './components/ClassesSection.jsx';
import Disclaimer from './components/Disclaimer.jsx';
import Hero from './components/Hero.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ProbabilityBars from './components/ProbabilityBars.jsx';
import ResultCard from './components/ResultCard.jsx';
import UploadSection from './components/UploadSection.jsx';
import { GITHUB_URL } from './classInfo.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

async function parseErrorDetail(res) {
  try {
    const body = await res.json();
    if (typeof body.detail === 'string') return body.detail;
    if (Array.isArray(body.detail)) {
      return body.detail.map((x) => x.msg || x).join(' ');
    }
  } catch {
    /* ignore */
  }
  return null;
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const handleValidFile = useCallback((file) => {
    setError(null);
    setResult(null);
    setSelectedFile(file);
  }, []);

  const handleInvalidFile = useCallback((message) => {
    setError(message);
  }, []);

  const handleClear = useCallback(() => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
  }, []);

  const handleAnalyzeAnother = useCallback(() => {
    setResult(null);
    setSelectedFile(null);
    setError(null);
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;
    setError(null);
    setResult(null);
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', selectedFile);
      const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) {
        const detail = await parseErrorDetail(res);
        const msg = detail || '';
        if (res.status === 400 && msg.toLowerCase().includes('unsupported')) {
          setError('Please upload a JPG or PNG image.');
        } else if (res.status === 400 && msg.toLowerCase().includes('corrupted')) {
          setError('Could not read this image. It may be corrupted.');
        } else if (res.status === 500 || res.status === 503) {
          setError(
            res.status === 503
              ? 'Server offline or model unavailable. Please run the backend and ensure model.h5 is present.'
              : 'Analysis failed. Please try again.'
          );
        } else {
          setError(msg || 'Analysis failed. Please try again.');
        }
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Server offline. Please run the backend.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  return (
    <div className="min-h-screen bg-page pb-16">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-page/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
          <a href="#" className="text-sm font-bold text-white md:text-base">
            🧠 Alzheimer&apos;s MRI Classifier
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/55 sm:inline">
              Research Project
            </span>
            <motion.a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/85 hover:bg-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.481 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z"
                />
              </svg>
            </motion.a>
          </div>
        </div>
      </header>

      <Hero />
      <Disclaimer />
      <ClassesSection />

      <AnimatePresence>
        {error && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="sticky top-16 z-40 mx-auto max-w-3xl px-4 pt-4"
          >
            <div className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-950/80 px-4 py-3 text-sm text-red-100 backdrop-blur-md">
              <span className="shrink-0" aria-hidden>
                ✕
              </span>
              <p className="flex-1">{error}</p>
              <button
                type="button"
                className="shrink-0 text-red-200/80 hover:text-white"
                onClick={() => setError(null)}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <UploadSection
        selectedFile={selectedFile}
        previewUrl={previewUrl}
        onValidFile={handleValidFile}
        onInvalidFile={handleInvalidFile}
        onClear={handleClear}
        onAnalyze={handleAnalyze}
        analyzeDisabled={!selectedFile || isLoading}
      />

      <AnimatePresence>{isLoading && <LoadingSpinner />}</AnimatePresence>

      <div ref={resultsRef}>
        {result && (
          <>
            <ResultCard result={result} onAnalyzeAnother={handleAnalyzeAnother} />
            <ProbabilityBars probabilities={result.probabilities} predictedClass={result.predicted_class} />
          </>
        )}
      </div>

      <footer className="mx-auto mt-12 max-w-6xl border-t border-white/10 px-4 pt-10 text-center text-sm text-white/45">
        <p>
          Built by Amine · Powered by VGG16 Transfer Learning ·{' '}
          <a href={GITHUB_URL} className="text-accent hover:underline" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </p>
        <p className="mt-2">⚠️ For research purposes only</p>
      </footer>
    </div>
  );
}
