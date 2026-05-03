import { motion } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';

const ACCEPT = 'image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png';

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadSection({
  selectedFile,
  previewUrl,
  onValidFile,
  onInvalidFile,
  onClear,
  onAnalyze,
  analyzeDisabled,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [dims, setDims] = useState(null);

  const validateAndSet = useCallback(
    (file) => {
      if (!file) return;
      const ok =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        /\.(jpe?g|png)$/i.test(file.name);
      if (!ok) {
        onInvalidFile('Please upload a JPG or PNG image.');
        return;
      }
      onValidFile(file);
    },
    [onValidFile, onInvalidFile]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    validateAndSet(f);
  };

  const onPick = (e) => {
    const f = e.target.files?.[0];
    validateAndSet(f);
    e.target.value = '';
  };

  const handlePreviewLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setDims({ w: naturalWidth, h: naturalHeight });
  };

  return (
    <section id="upload" className="scroll-mt-24 px-4 py-8 md:py-16">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center md:text-left"
        >
          <h2 className="text-2xl font-bold text-white md:text-3xl">Upload MRI Scan</h2>
          <p className="mt-2 text-white/60">Secure client-side preview · inference runs on your FastAPI server</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors md:px-10 ${
            dragOver
              ? 'border-accent bg-accent/10 shadow-[0_0_30px_-8px_rgba(43,151,199,0.7)]'
              : 'border-white/20 bg-white/[0.03] hover:border-white/35'
          } backdrop-blur-md`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={onPick}
          />

          {previewUrl ? (
            <div className="relative mx-auto max-h-[320px] max-w-md overflow-hidden rounded-xl border border-white/10 bg-black/40">
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="MRI preview"
                  className="mx-auto max-h-[280px] w-auto object-contain"
                  onLoad={handlePreviewLoad}
                />
                <div className="pointer-events-none absolute inset-0 medical-grid-bg opacity-60" />
              </div>
              {dims && (
                <p className="border-t border-white/10 bg-black/50 px-3 py-2 text-center text-xs text-white/55">
                  {dims.w} × {dims.h} px
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="text-5xl">🧠</div>
              <p className="mt-4 text-lg font-semibold text-white">Drag & drop your MRI image here</p>
              <p className="mt-2 text-sm text-white/55">or click to browse — JPG, JPEG, PNG supported</p>
            </>
          )}
        </motion.div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-white/55">
            {selectedFile ? (
              <>
                <span className="font-medium text-white/85">{selectedFile.name}</span>
                <span className="mx-2 text-white/35">·</span>
                <span>{formatBytes(selectedFile.size)}</span>
              </>
            ) : (
              <span>No file selected</span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              type="button"
              disabled={analyzeDisabled}
              onClick={(e) => {
                e.stopPropagation();
                onAnalyze();
              }}
              whileHover={analyzeDisabled ? {} : { scale: 1.02 }}
              whileTap={analyzeDisabled ? {} : { scale: 0.98 }}
              className="min-w-[160px] rounded-xl bg-accent px-8 py-3 text-sm font-bold text-white shadow-glow transition disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35 disabled:shadow-none"
            >
              Analyze MRI
            </motion.button>
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDims(null);
                onClear();
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/85 backdrop-blur-md hover:bg-white/10"
            >
              Clear
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
