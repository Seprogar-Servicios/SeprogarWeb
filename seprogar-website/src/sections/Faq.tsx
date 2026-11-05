import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, CircleHelp, MessageCircle } from 'lucide-react';

export const FAQ_ITEMS = [
  {
    question: '¿Qué servicios cubren?',
    answer:
      'Plomería, gas, electricidad, aires acondicionados y pintura, entre otros trabajos de instalación y mantenimiento. Si tu necesidad es puntual, escribinos y te decimos si podemos tomarlo.',
  },
  {
    question: '¿Atienden emergencias?',
    answer:
      'Sí. Para urgencias (fugas, cortes, fallas críticas) escribinos por WhatsApp con zona y una breve descripción. Priorizamos según gravedad y disponibilidad del equipo.',
  },
  {
    question: '¿En qué horarios trabajan?',
    answer:
      'Atención habitual de lunes a domingo en franja diurna. Fuera de ese horario se evalúan emergencias caso por caso.',
  },
  {
    question: '¿Cómo pido un presupuesto?',
    answer:
      'Por WhatsApp o desde el formulario de contacto. Con fotos y una descripción breve podemos orientarte mejor. Si hace falta visita técnica, te lo avisamos antes de coordinarla.',
  },
  {
    question: '¿La visita tiene costo?',
    answer:
      'La orientación inicial por mensaje es sin cargo. Si el caso requiere relevamiento en el lugar, te confirmamos condiciones antes de agendar.',
  },
  {
    question: '¿Trabajan con instalaciones de gas certificadas?',
    answer:
      'Realizamos instalaciones y trabajos relacionados con gas respetando la normativa vigente. Consultanos el tipo de instalación para confirmar documentación y requisitos.',
  },
  {
    question: '¿Llegan a mi zona?',
    answer:
      'Cubrimos CABA y Gran Buenos Aires (norte, oeste y sur). Si estás en el límite o en otra localidad, consultá igual: coordinamos según distancia y agenda.',
  },
  {
    question: '¿Qué necesito tener listo el día del trabajo?',
    answer:
      'Acceso al lugar, alguien que pueda autorizar la intervención y, si aplica, datos del medidor o tablero. Te indicamos lo específico al confirmar el turno.',
  },
] as const;

export const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-14 md:py-16 overflow-hidden">
      <div className="absolute inset-0 mesh-grid opacity-25 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-28"
          >
            <div className="inline-flex items-center bg-gradient-to-r from-[#F37021] to-[#FF9E5E] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 shadow-brand">
              <CircleHelp className="w-3.5 h-3.5 mr-1.5" />
              Antes de escribirnos
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-3">
              Preguntas <span className="text-gradient-brand">frecuentes</span>
            </h2>
            <p className="text-muted text-sm md:text-base leading-relaxed mb-5">
              Armamos esta guía con lo que más consultan: servicios, urgencias, zonas y cómo
              coordinar. Si tu caso es distinto, hablanos directo.
            </p>
            <div className="rounded-2xl border border-theme bg-surface p-5">
              <p className="font-display font-bold text-foreground mb-1">¿No encontrás tu duda?</p>
              <p className="text-sm text-muted mb-4 leading-relaxed">
                Mandanos un mensaje con tu zona y el problema. Te respondemos con la próxima acción
                concreta.
              </p>
              <a
                href="https://wa.me/5491128484962?text=Hola%20Seprogar,%20tengo%20una%20consulta"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F37021] to-[#FF9E5E] px-5 py-3 text-sm font-semibold text-white shadow-brand"
              >
                <MessageCircle className="h-4 w-4" />
                Consultar por WhatsApp
              </a>
            </div>
          </motion.div>

          <div className="grid gap-2.5 sm:grid-cols-1">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.03, 0.2) }}
                  className="rounded-2xl border border-theme bg-surface overflow-hidden"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left md:px-5"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className="font-display text-sm md:text-base font-semibold text-foreground">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#F37021] transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-4 pb-4 md:px-5 text-sm text-muted leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
