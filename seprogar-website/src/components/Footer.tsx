import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, MessageCircle, ArrowUp, Phone, Mail, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#000336] to-[#000a4d] text-white pt-20 pb-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#F37021] rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-[#F37021] rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -left-4 -top-4 w-16 h-16 bg-[#F37021]/20 rounded-full"></div>
            <div className="flex items-center space-x-3 mb-6 relative z-10">
              <img 
                src="/img/Seprogar-Logo-03.png"
                alt="SEPROGAR"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-300 mb-8 text-sm leading-relaxed">
              Soluciones técnicas profesionales en plomería, gas y electricidad. Garantizamos calidad, seguridad y satisfacción en cada trabajo realizado.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Facebook, label: 'Facebook', url: '#' },
                { icon: Instagram, label: 'Instagram', url: '#' },
                { icon: MessageCircle, label: 'WhatsApp', url: '#' },
                { icon: Linkedin, label: 'LinkedIn', url: '#' }
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

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -left-4 -top-4 w-12 h-12 bg-[#F37021]/20 rounded-full"></div>
            <h3 className="text-lg font-semibold mb-6 relative z-10">Enlaces rápidos</h3>
            <ul className="space-y-3">
              {[
                { href: '#inicio', label: 'Inicio' },
                { href: '#servicios', label: 'Servicios' },
                { href: '#nosotros', label: 'Nosotros' },
                { href: '#trabajos', label: 'Trabajos' },
                { href: '#contacto', label: 'Contacto' },
              ].map((link, index) => (
                <li key={index} className="group">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-[#F37021] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <a 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-colors flex-1 py-1.5 group-hover:translate-x-2 transition-transform"
                    >
                      {link.label}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -left-4 -top-4 w-12 h-12 bg-[#F37021]/20 rounded-full"></div>
            <h3 className="text-lg font-semibold mb-6 relative z-10">Nuestros Servicios</h3>
            <ul className="space-y-3">
              {[
                'Instalaciones de plomería',
                'Reparación de fugas',
                'Instalaciones de gas',
                'Mantenimiento eléctrico',
                'Emergencias 24/7',
                'Certificaciones'
              ].map((service, index) => (
                <li key={index} className="flex items-start group">
                  <div className="w-1.5 h-1.5 bg-[#F37021] rounded-full mt-2 mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-gray-300 group-hover:text-white transition-colors flex-1 py-1.5 group-hover:translate-x-2 transition-transform">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute -left-4 -top-4 w-12 h-12 bg-[#F37021]/20 rounded-full"></div>
            <h3 className="text-lg font-semibold mb-6 relative z-10">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="w-8 h-8 bg-[#F37021]/10 rounded-lg flex items-center justify-center mt-0.5 mr-3 flex-shrink-0 group-hover:bg-[#F37021] transition-colors">
                  <MapPin className="w-4 h-4 text-[#F37021] group-hover:text-white transition-colors" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">Av. Siempre Viva 1234, Buenos Aires, Argentina</span>
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
                  <MessageCircle className="w-4 h-4 text-[#F37021] group-hover:text-white transition-colors" />
                </div>
                <a href="https://wa.me/5491128484962" className="text-gray-300 hover:text-white transition-colors">
                  +54 9 11 2848-4962
                </a>
              </li>
              <li className="flex items-center group">
                <div className="w-8 h-8 bg-[#F37021]/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-[#F37021] transition-colors">
                  <Mail className="w-4 h-4 text-[#F37021] group-hover:text-white transition-colors" />
                </div>
                <a href="mailto:info@seprogar.com" className="text-gray-300 hover:text-white transition-colors">
                  info@seprogar.com
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-16 pt-8 text-center relative">
          <div className="absolute left-1/2 -top-6 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-[#F37021] to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-10 h-10 bg-[#000a4d] rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-[#F37021] rounded-full"></div>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} SEPROGAR. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-gray-500">
            <a href="#" className="hover:text-[#F37021] transition-colors">Términos y condiciones</a>
            <span className="text-gray-600">•</span>
            <a href="#" className="hover:text-[#F37021] transition-colors">Política de privacidad</a>
            <span className="text-gray-600">•</span>
            <a href="#" className="hover:text-[#F37021] transition-colors">Aviso legal</a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        className={`fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-[#F37021] to-orange-500 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 z-40 ${
          showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        onClick={scrollToTop}
        initial={{ opacity: 0 }}
        animate={{ opacity: showScroll ? 1 : 0, y: showScroll ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        aria-label="Volver arriba"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
};

export default Footer;