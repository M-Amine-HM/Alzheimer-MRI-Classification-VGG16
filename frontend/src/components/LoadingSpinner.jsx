import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-card/95 p-10 text-center shadow-glow backdrop-blur-md"
        initial={{ scale: 0.94, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22 }}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center text-4xl">
          <span className="animate-pulse-brain select-none">🧠</span>
        </div>
        <h3 className="mt-6 text-xl font-bold text-white">Analyzing MRI Scan...</h3>
        <p className="mt-2 text-sm text-white/55">Running VGG16 inference · Please wait</p>
        <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full w-1/3 rounded-full bg-accent"
            animate={{ x: ['-120%', '320%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
