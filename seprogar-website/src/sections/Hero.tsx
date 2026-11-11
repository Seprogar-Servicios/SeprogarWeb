import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Wrench, Phone, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useSiteContent } from '../contexts/SiteContentContext';
import { DEFAULT_HERO_BACKGROUND, whatsappLink } from '../lib/fallbackContent';
import { getSectionIcon } from '../lib/sectionIcons';

export const Hero = () => {
  const { isDark } = useTheme();
  const { content } = useSiteContent();
  const hero = content.hero;
  const words = hero.rotating_words.length ? hero.rotating_words : ['hogar'];
  const [wordIndex, setWordIndex] = useState(0);
  const bgImage = hero.background_image_url.trim() || DEFAULT_HERO_BACKGROUND;

  useEffect(() => {
    setWordIndex(0);
    const id = window.setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [words.length, words.join('|')]);

  const currentWord = words[wordIndex % words.length];

  return (
    <section
      id="inicio"
      className={`relative min-h-[92svh] md:min-h-[100svh] flex items-center justify-center pt-24 pb-12 md:pb-14 overflow-hidden transition-colors duration-500 ${
        isDark ? 'text-white' : 'text-[#000336]'
      }`}
    >
      <div className="absolute inset-0 transition-opacity duration-500">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${bgImage}')` }}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: [0.22, 1, 0.36, 1] }}
        />
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#000336]/94 via-[#000336]/88 to-[#0F4C81]/90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(243,112,33,0.34),transparent_52%)]" />
            <div className="absolute -bottom-24 left-1/2 h-48 w-[80%] -translate-x-1/2 rounded-full bg-[#F37021]/25 blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#fff7f0]/92 via-[#f3f7fc]/88 to-[#e7eef8]/90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(243,112,33,0.2),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(15,76,129,0.12),transparent_45%)]" />
            <div className="absolute inset-0 mesh-grid opacity-30" />
          </>
        )}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--page-bg)] to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-10"
          >
            <motion.img
              src="/img/Seprogar-Logo-03.png"
              alt="SEPROGAR"
              className={`mx-auto mb-8 h-12 md:h-14 w-auto drop-shadow-lg ${
                isDark ? 'brightness-0 invert' : ''
              }`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            />

            <motion.div
              className={`inline-flex items-center justify-center backdrop-blur-md px-5 py-2 rounded-full mb-7 border ${
                isDark
                  ? 'bg-white/10 border-white/15 text-white'
                  : 'bg-white/80 border-[#F37021]/20 text-[#000336] shadow-sm'
              }`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.45 }}
            >
              <Wrench className="mr-2 text-[#F37021]" size={16} />
              <span className="text-sm font-semibold tracking-wide">{hero.eyebrow}</span>
            </motion.div>

            <motion.h1
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.08]"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.55 }}
            >
              <span className={isDark ? 'text-white' : 'text-[#000336]'}>{hero.headline_line1}</span>
              <span className="mt-2 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
                <span className={isDark ? 'text-white' : 'text-[#000336]'}>{hero.headline_prefix}</span>
                <span className="relative inline-flex min-w-[7.5ch] md:min-w-[9ch] justify-center pb-[0.22em] align-baseline">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentWord}
                      initial={{ y: '40%', opacity: 0, filter: 'blur(4px)' }}
                      animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                      exit={{ y: '-35%', opacity: 0, filter: 'blur(4px)' }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="relative z-10 inline-block pb-[0.08em] text-gradient-brand"
                      aria-live="polite"
                    >
                      {currentWord}
                    </motion.span>
                  </AnimatePresence>
                  <span
                    className={`pointer-events-none absolute left-0 right-0 bottom-0 h-[0.12em] rounded-full bg-gradient-to-r from-[#F37021] to-[#FF9E5E] ${
                      isDark ? 'opacity-80' : 'opacity-90'
                    }`}
                    aria-hidden
                  />
                </span>
              </span>
            </motion.h1>

            <motion.p
              className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${
                isDark ? 'text-slate-200/90' : 'text-slate-600'
              }`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.55 }}
            >
              {hero.subheadline}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.55 }}
            >
              <a
                href={hero.primary_cta_href || '#servicios'}
                className="group relative overflow-hidden bg-gradient-to-r from-[#F37021] to-[#FF9E5E] text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center shadow-brand transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center">
                  {hero.primary_cta_label}
                  <ChevronRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>

              <a
                href={whatsappLink(content.settings.whatsapp, hero.secondary_cta_message)}
                target="_blank"
                rel="noopener noreferrer"
                className={`group px-8 py-4 rounded-full font-semibold flex items-center justify-center border transition-all duration-300 hover:-translate-y-0.5 ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/18 backdrop-blur-md text-white border-white/25'
                    : 'bg-white hover:bg-[#fff7f0] text-[#000336] border-[#000336]/12 shadow-md'
                }`}
              >
                <Phone className="mr-2" size={18} />
                {hero.secondary_cta_label}
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-10 md:mt-14"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            {hero.stats.map((stat, index) => {
              const Icon = getSectionIcon(stat.icon_key);
              return (
                <motion.div
                  key={`${stat.value}-${stat.label}`}
                  className={`text-center p-5 md:p-6 rounded-2xl border backdrop-blur-md transition-colors ${
                    isDark
                      ? 'border-white/10 bg-white/5 hover:bg-white/10'
                      : 'border-white/80 bg-white/70 hover:bg-white shadow-sm'
                  }`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * index }}
                  whileHover={{ y: -4 }}
                >
                  {Icon ? (
                    <Icon className="mx-auto mb-2 h-5 w-5 text-[#F37021]" />
                  ) : (
                    <div className="mx-auto mb-2 h-5" />
                  )}
                  <div className="font-display text-3xl md:text-4xl font-bold text-gradient-brand mb-1">
                    {stat.value}
                  </div>
                  <div
                    className={`text-xs md:text-sm font-medium ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
