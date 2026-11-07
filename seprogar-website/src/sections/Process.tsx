import { motion } from 'framer-motion';
import { ListOrdered, Wrench } from 'lucide-react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { getSectionIcon } from '../lib/sectionIcons';

export const Process = () => {
  const { content } = useSiteContent();
  const process = content.process;

  return (
    <section id="proceso" className="relative py-14 md:py-16 overflow-hidden">
      <div className="absolute inset-0 mesh-grid opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 md:mb-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center bg-gradient-to-r from-[#F37021] to-[#FF9E5E] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 shadow-brand">
              <ListOrdered className="w-3.5 h-3.5 mr-1.5" />
              {process.eyebrow}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground">
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

        <div className="relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
          <div className="pointer-events-none absolute top-10 left-[12%] right-[12%] hidden xl:block h-px bg-gradient-to-r from-transparent via-[#F37021]/35 to-transparent" />
          {process.steps.map((step, index) => {
            const Icon = getSectionIcon(step.icon_key) ?? Wrench;
            return (
              <motion.article
                key={`${step.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="relative rounded-2xl border border-theme bg-surface px-4 py-5 md:px-5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#F37021] to-[#FF9E5E] text-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold tracking-wide text-[#F37021]">
                    PASO {index + 1}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-1.5">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
