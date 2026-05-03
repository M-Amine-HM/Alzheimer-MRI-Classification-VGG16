import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Disclaimer() {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35 }}
          className="border-b border-amber-400/35 bg-amber-500/20 text-amber-50"
        >
          <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-4 text-sm leading-relaxed md:text-base">
            <span className="mt-0.5 shrink-0 text-lg" aria-hidden>
              ⚠️
            </span>
            <p className="flex-1 font-medium text-amber-50">
              This application is for educational and research purposes only. It is not intended for
              clinical use, medical diagnosis, or treatment. Results must not replace professional
              medical advice.
            </p>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="shrink-0 rounded-lg px-2 py-1 text-lg leading-none text-amber-100/80 transition hover:bg-amber-600/25 hover:text-white"
              aria-label="Dismiss disclaimer"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
