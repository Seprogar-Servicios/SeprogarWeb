import { motion } from 'framer-motion';
import { Phone, Sparkles, Camera, ShieldCheck } from 'lucide-react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { whatsappLink } from '../lib/fallbackContent';
import { safeImageUrl } from '../lib/safeUrl';
import { getSectionIcon } from '../lib/sectionIcons';

export const WhyUs = () => {
  const { content } = useSiteContent();
  const about = content.about;
  const photo = safeImageUrl(about.photo_url) || null;

  return (
    <section id="nosotros" className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-surface/70" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6 lg:items-stretch mb-5 md:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
            className="rounded-3xl border border-theme bg-surface-elevated p-6 md:p-8 flex flex-col justify-center"
          >
            <div className="inline-flex items-center bg-gradient-to-r from-[#F37021] to-[#FF9E5E] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 shadow-brand w-fit">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              {about.eyebrow}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-4 leading-tight">
              {about.headline}
            </h2>
            <p className="text-muted text-sm md:text-base leading-relaxed mb-4">{about.body_1}</p>
            <p className="text-muted text-sm md:text-base leading-relaxed mb-6">{about.body_2}</p>
            <a
              href={whatsappLink(content.settings.whatsapp, about.cta_message)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F37021] to-[#FF9E5E] px-5 py-3 text-sm font-semibold text-white shadow-brand hover:brightness-105 transition w-fit"
            >
              <Phone className="h-4 w-4" />
              {about.cta_label}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="relative overflow-hidden rounded-3xl border border-theme bg-surface min-h-[240px] md:min-h-full"
          >
            {photo ? (
              <img
                src={photo}
                alt="Equipo SEPROGAR"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#000336] via-[#0F4C81] to-[#000336] p-6 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(243,112,33,0.35),transparent_50%)]" />
                <div className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 border border-white/15 text-[#FF9E5E]">
                  <Camera className="h-6 w-6" />
                </div>
                <div className="relative z-10">
                  <p className="font-display text-lg font-bold text-white mb-1">
                    {about.photo_placeholder_title}
                  </p>
                  <p className="text-sm text-white/70 max-w-xs leading-relaxed">
                    {about.photo_placeholder_body}
                  </p>
                </div>
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#000336]/50 to-transparent" />
            <p className="absolute bottom-4 left-4 right-4 z-10 font-display text-sm font-semibold text-white drop-shadow">
              {about.photo_caption}
            </p>
          </motion.div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {about.highlights.map((item, index) => {
            const Icon = getSectionIcon(item.icon_key) ?? ShieldCheck;
            return (
              <motion.div
                key={`${item.title}-${index}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="flex gap-3 rounded-2xl border border-theme bg-surface p-4"
              >
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#000336] text-[#FF9E5E]">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground mb-0.5">{item.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
