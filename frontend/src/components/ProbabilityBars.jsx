import { motion } from 'framer-motion';
import { CLASSES } from '../classInfo';

export default function ProbabilityBars({ probabilities, predictedClass }) {
  const ordered = [...CLASSES]
    .map((c) => ({
      ...c,
      p: probabilities[c.key] ?? 0,
    }))
    .sort((a, b) => b.p - a.p);

  return (
    <section id="probabilities" className="scroll-mt-24 px-4 py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-xl font-bold text-white md:text-2xl"
        >
          All Class Probabilities
        </motion.h3>
        <div className="flex flex-col gap-5">
          {ordered.map((row, i) => {
            const isPred = row.key === predictedClass;
            const pct = Math.round(row.p * 1000) / 10;
            return (
              <motion.div
                key={row.key}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className={`rounded-xl border bg-white/5 p-4 backdrop-blur-md ${
                  isPred ? 'border-white/25 shadow-[0_0_24px_-8px_rgba(255,255,255,0.25)]' : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full shadow-[0_0_12px_currentColor]"
                      style={{ backgroundColor: row.color, color: row.color }}
                    />
                    <span
                      className={`truncate text-sm ${isPred ? 'font-bold text-white' : 'font-medium text-white/80'}`}
                    >
                      {row.key}
                    </span>
                  </div>
                  <span className={`shrink-0 text-sm tabular-nums ${isPred ? 'font-bold text-white' : 'text-white/65'}`}>
                    {pct}%
                  </span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-black/40">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: row.color,
                      boxShadow: isPred ? `0 0 16px ${row.color}88` : undefined,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.05 + i * 0.05 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
