import { motion } from 'framer-motion';
import { getClassDef, RECOMMENDATIONS } from '../classInfo';

const STAGES = ['Non Demented', 'Very Mild Demented', 'Mild Demented', 'Moderate Demented'];

export default function ResultCard({ result, onAnalyzeAnother }) {
  const def = getClassDef(result.predicted_class);
  const expanded = def?.expanded ?? def?.short ?? '';
  const rec = RECOMMENDATIONS[result.predicted_class] ?? '';
  const confPct = Math.round(result.confidence * 1000) / 10;
  const markerPct = (result.severity_level / 3) * 100;

  return (
    <section id="results" className="scroll-mt-24 px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md"
        style={{
          borderColor: `${result.color}44`,
          boxShadow: `0 0 48px -12px ${result.color}55`,
        }}
      >
        <div
          className="border-b border-white/10 px-6 py-8 md:px-10 md:py-10"
          style={{
            background: `linear-gradient(135deg, ${result.color}22 0%, transparent 55%)`,
          }}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <span
                className="inline-block rounded-full px-4 py-1.5 text-sm font-bold text-white shadow-lg"
                style={{ backgroundColor: result.color }}
              >
                {result.predicted_class}
              </span>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight text-white md:text-6xl">{confPct}%</span>
              </div>
              <p className="mt-1 text-sm font-medium text-white/55">Confidence Score</p>
            </div>

            <div className="w-full md:max-w-sm md:pt-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/45">Severity indicator</p>
              <p className="mb-2 text-[11px] leading-snug text-white/35">
                Non → Very Mild → Mild → Moderate
              </p>
              <div className="relative pb-2 pt-2">
                <motion.div
                  className="absolute -top-1 z-10 h-0 w-0 border-x-[8px] border-b-[10px] border-x-transparent border-b-white drop-shadow-md"
                  style={{ left: `clamp(0px, calc(${markerPct}% - 8px), calc(100% - 16px))` }}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                />
                <div className="flex h-4 overflow-hidden rounded-full bg-black/50 ring-1 ring-white/10">
                  {STAGES.map((label, i) => (
                    <div
                      key={label}
                      title={label}
                      className="flex-1 border-r border-black/50 last:border-r-0"
                      style={{
                        backgroundColor:
                          i <= result.severity_level ? `${result.color}aa` : 'rgba(255,255,255,0.05)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-6 py-8 md:px-10 md:py-10">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-accent">About this stage</h4>
            <p className="mt-3 leading-relaxed text-white/75">{expanded}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="text-sm font-semibold text-white">{rec}</p>
            <p className="mt-3 text-sm leading-relaxed text-amber-200/90">
              ⚠️ Consult a qualified medical professional for proper diagnosis.
            </p>
          </div>
          <motion.button
            type="button"
            onClick={onAnalyzeAnother}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-xl border border-accent/40 bg-accent/15 py-3 text-sm font-bold text-accent backdrop-blur-md hover:bg-accent/25 md:w-auto md:px-10"
          >
            Analyze Another Image
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
