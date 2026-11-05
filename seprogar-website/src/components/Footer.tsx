import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, MessageCircle, ArrowUp, Phone, Mail, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEspecialidadesPublicas } from '../lib/api/especialidades';
import type { Especialidad } from '../types/database';
import { useHasEquipo } from '../hooks/useHasEquipo';

export const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [servicios, setServicios] = useState<Especialidad[]>([]);
  const { hasEquipo } = useHasEquipo();

  useEffect(() => {
    const checkScroll = () => {
      setShowScroll(window.pageYOffset > 400);
    };

    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  useEffect(() => {
    void fetchEspecialidadesPublicas()
      .then(setServicios)
      .catch(() => setServicios([]));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#000336] to-[#000a4d] text-white pt-20 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#F37021] rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-[#F37021] rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -left-4 -top-4 w-16 h-16 bg-[#F37021]/20 rounded-full" />
            <div className="flex items-center space-x-3 mb-6 relative z-10">
              <img src="/img/Seprogar-Logo-03.png" alt="SEPROGAR" className="h-10 w-auto" />
            </div>
            <p className="text-gray-300 mb-8 text-sm leading-relaxed">
              Soluciones técnicas profesionales en plomería, gas y electricidad. Calidad, seguridad
              y un trato claro en cada trabajo.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Facebook, label: 'Facebook', url: '#' },
                { icon: Instagram, label: 'Instagram', url: '#' },
                {
                  icon: MessageCircle,
                  label: 'WhatsApp',
                  url: 'https://wa.me/5491128484962',
                },
                { icon: Linkedin, label: 'LinkedIn', url: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="w-10 h-10 bg-white/5 hover:bg-[#F37021] backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 hover:-translate-y-1"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -left-4 -top-4 w-12 h-12 bg-[#F37021]/20 rounded-full" />
            <h3 className="text-lg font-semibold mb-6 relative z-10">Enlaces rápidos</h3>
            <ul className="space-y-3">
              {[
                { href: '/#inicio', label: 'Inicio' },
                { href: '/#servicios', label: 'Servicios' },
                { href: '/#proceso', label: 'Cómo trabajamos' },
                { href: '/#nosotros', label: 'Nosotros' },
                ...(hasEquipo ? [{ href: '/#equipo', label: 'Equipo' }] : []),
                { href: '/#zonas', label: 'Zonas' },
                { href: '/#faq', label: 'Preguntas frecuentes' },
                { href: '/#contacto', label: 'Contacto' },
              ].map((link) => (
                <li key={link.href} className="group">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-[#F37021] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors flex-1 py-1.5 group-hover:translate-x-2 transition-transform"
                    >
                      {link.label}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -left-4 -top-4 w-12 h-12 bg-[#F37021]/20 rounded-full" />
            <h3 className="text-lg font-semibold mb-6 relative z-10">Nuestros Servicios</h3>
            <ul className="space-y-3">
              {servicios.length > 0
                ? servicios.map((service) => (
                    <li key={service.id} className="flex items-start group">
                      <div className="w-1.5 h-1.5 bg-[#F37021] rounded-full mt-2 mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Link
                        to={`/servicios/${service.slug}`}
                        className="text-gray-300 group-hover:text-white transition-colors flex-1 py-1.5 group-hover:translate-x-2 transition-transform"
                      >
                        {service.nombre}
                      </Link>
                    </li>
                  ))
                : ['Plomería', 'Gas', 'Electricidad'].map((label) => (
                    <li key={label} className="text-gray-300 py-1.5">
                      {label}
                    </li>
                  ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute -left-4 -top-4 w-12 h-12 bg-[#F37021]/20 rounded-full" />
            <h3 className="text-lg font-semibold mb-6 relative z-10">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="w-8 h-8 bg-[#F37021]/10 rounded-lg flex items-center justify-center mt-0.5 mr-3 flex-shrink-0 group-hover:bg-[#F37021] transition-colors">
                  <MapPin className="w-4 h-4 text-[#F37021] group-hover:text-white transition-colors" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  Buenos Aires, Argentina
                </span>
              </li>
              <li className="flex items-center group">
                <div className="w-8 h-8 bg-[#F37021]/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-[#F37021] transition-colors">
                  <Phone className="w-4 h-4 text-[#F37021] group-hover:text-white transition-colors" />
                </div>
                <a href="tel:+5491128484962" className="text-gray-300 hover:text-white transition-colors">
                  +54 9 11 2848-4962
                </a>
              </li>
              <li className="flex items-center group">
                <div className="w-8 h-8 bg-[#F37021]/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-[#F37021] transition-colors">
                  <Mail className="w-4 h-4 text-[#F37021] group-hover:text-white transition-colors" />
                </div>
                <a
                  href="mailto:contacto@seprogar.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  contacto@seprogar.com
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} SEPROGAR. Todos los derechos reservados.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 bg-[#F37021] text-white p-3 rounded-full shadow-lg hover:bg-[#e05f12] transition-all duration-300 ${
              showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            aria-label="Volver arriba"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
