import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone } from 'lucide-react';

const zones = [
  'CABA',
  'Zona Norte',
  'Zona Oeste',
  'Zona Sur',
  'GBA',
  'Consultá tu zona',
] as const;

export const Coverage = () => {
  return (
    <section id="zonas" className="relative py-14 md:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-surface/55" />
      <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#F37021]/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#0F4C81]/12 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65 }}
          >
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-[#F37021] to-[#FF9E5E] text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5 shadow-brand">
              <Navigation className="w-4 h-4 mr-2" />
              Cobertura
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-foreground mb-5">
              Zonas de <span className="text-gradient-brand">atención</span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-[#F37021] to-[#FF9E5E] rounded-full mb-5" />
            <p className="text-muted text-base md:text-lg leading-relaxed mb-6 max-w-xl">
              Atendemos CABA y Gran Buenos Aires. Si tu zona no aparece en la lista, escribinos igual:
              coordinamos según disponibilidad y urgencia.
            </p>
            <a
              href="https://wa.me/5491128484962?text=Hola%20Seprogar,%20quiero%20consultar%20si%20atienden%20en%20mi%20zona"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F37021] to-[#FF9E5E] px-6 py-3.5 font-semibold text-white shadow-brand hover:brightness-105 transition"
            >
              <Phone className="h-4 w-4" />
              Consultar mi zona
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="rounded-3xl border border-theme bg-surface p-6 md:p-8 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)]"
          >
            <div className="mb-5 flex items-center gap-2 text-foreground">
              <MapPin className="h-5 w-5 text-[#F37021]" />
              <h3 className="font-display text-lg font-bold">Principales áreas</h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {zones.map((zone, index) => (
                <motion.li
                  key={zone}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 rounded-2xl border border-theme bg-surface-elevated px-4 py-3"
                >
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#F37021] to-[#FF9E5E]" />
                  <span className="text-sm font-semibold text-foreground">{zone}</span>
                </motion.li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-muted leading-relaxed">
              La cobertura exacta puede variar según el tipo de servicio y la demanda del día.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
