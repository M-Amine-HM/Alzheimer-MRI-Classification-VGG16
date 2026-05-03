import { motion } from 'framer-motion';
import { CLASSES } from '../classInfo';

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function ClassesSection() {
  return (
    <section id="classes" className="scroll-mt-24 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45 }}
          className="mb-10 text-center md:text-left"
        >
          <h2 className="text-2xl font-bold text-white md:text-3xl">Alzheimer&apos;s Stages</h2>
          <p className="mt-2 text-white/60">Understanding the 4 classification stages</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {CLASSES.map((c) => (
            <motion.article
              key={c.key}
              variants={item}
              whileHover={{
                y: -6,
                boxShadow: `0 16px 48px -16px ${c.color}77`,
              }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-shadow duration-300"
              style={{
                borderTopWidth: '4px',
                borderTopColor: c.color,
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  boxShadow: `inset 0 0 60px -20px ${c.color}44`,
                }}
              />
              <div className="relative">
                <div className="text-4xl">{c.icon}</div>
                <h3 className="mt-3 text-lg font-bold text-white">{c.key}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{c.short}</p>
                <span className="mt-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/75">
                  {c.datasetCount.toLocaleString()} images in dataset
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
