import { motion } from 'framer-motion';
import { GITHUB_URL } from '../classInfo';

const pills = ['TensorFlow', 'VGG16', 'Transfer Learning', 'FastAPI', 'React'];

const statCards = [
  { label: '6,400 MRI Images' },
  { label: '4 Classes' },
  { label: 'VGG16 Architecture' },
  { label: 'Transfer Learning' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-cardalt/80 to-page px-4 pb-16 pt-28 md:pt-32">
      <div className="pointer-events-none absolute -right-24 top-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
        <motion.div
          className="max-w-xl flex-1"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <motion.span
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-accent backdrop-blur-md"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            🧠 Deep Learning · Medical AI
          </motion.span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Alzheimer&apos;s MRI Classification
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/65 md:text-lg">
            Upload a brain MRI scan and get instant AI-powered stage classification using VGG16
            Transfer Learning
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {pills.map((p, i) => (
              <motion.span
                key={p}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-md"
              >
                {p}
              </motion.span>
            ))}
          </div>
          <motion.a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/15 px-5 py-2.5 text-sm font-semibold text-accent shadow-glow backdrop-blur-md transition hover:bg-accent/25"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View on GitHub
            <span aria-hidden>↗</span>
          </motion.a>
        </motion.div>

        <motion.div
          className="relative flex flex-1 flex-col items-center justify-center gap-8 lg:max-w-md"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative flex h-56 w-56 items-center justify-center md:h-64 md:w-64">
            <motion.div
              className="absolute inset-0 rounded-full bg-accent/20 blur-2xl"
              animate={{ opacity: [0.35, 0.6, 0.35] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <svg
              viewBox="0 0 200 200"
              className="relative z-10 h-full w-full drop-shadow-[0_0_24px_rgba(43,151,199,0.35)]"
              aria-hidden
            >
              <defs>
                <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2B97C7" />
                  <stop offset="100%" stopColor="#1a5f7a" />
                </linearGradient>
              </defs>
              <motion.g
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ellipse cx="100" cy="110" rx="72" ry="82" fill="url(#brainGrad)" opacity="0.9" />
                <path
                  d="M100 38 C60 48 44 88 48 124 C52 154 72 172 100 176 C128 172 148 154 152 124 C156 88 140 48 100 38Z"
                  fill="none"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="2"
                />
                <path
                  d="M76 96 Q100 72 124 96 M68 118 Q100 102 132 118 M78 142 Q100 128 122 142"
                  fill="none"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </motion.g>
              <motion.rect
                x="36"
                y="168"
                width="128"
                height="8"
                rx="4"
                fill="rgba(43,151,199,0.25)"
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              />
            </svg>
          </div>

          <div className="grid w-full max-w-sm grid-cols-2 gap-3">
            {statCards.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xs font-semibold text-white/90 backdrop-blur-md md:text-sm"
              >
                {s.label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
