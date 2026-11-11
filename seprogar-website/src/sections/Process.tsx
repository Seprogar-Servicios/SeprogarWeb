import { motion } from 'framer-motion';
import { ListOrdered, Wrench } from 'lucide-react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { getSectionIcon } from '../lib/sectionIcons';

export const Process = () => {
  const { content } = useSiteContent();
  const process = content.process;

  return (
    <section id="proceso" className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-surface/40 pointer-events-none" />
      <div className="absolute inset-0 mesh-grid opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10 md:mb-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center bg-gradient-to-r from-[#F37021] to-[#FF9E5E] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 shadow-brand">
              <ListOrdered className="w-3.5 h-3.5 mr-1.5" />
              {process.eyebrow}
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-foreground leading-tight">
              {process.headline}{' '}
              {process.highlight ? (
                <span className="text-gradient-brand">{process.highlight}</span>
              ) : null}
            </h2>
          </div>
          <p className="text-muted text-sm md:text-base max-w-md lg:text-right leading-relaxed">
            {process.subheadline}
          </p>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
          <div className="pointer-events-none absolute top-12 left-[10%] right-[10%] hidden xl:block h-px bg-gradient-to-r from-transparent via-[#F37021]/40 to-transparent" />
          {process.steps.map((step, index) => {
            const Icon = getSectionIcon(step.icon_key) ?? Wrench;
            return (
              <motion.article
                key={`${step.title}-${index}`}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="relative rounded-3xl border border-theme bg-surface px-5 py-6 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 hover:border-[#F37021]/35"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F37021] to-[#FF9E5E] text-white shadow-brand">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold tracking-wide text-[#F37021]">
                    PASO {index + 1}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
