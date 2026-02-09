import { useState, useEffect } from 'react';
import { Menu, X, Phone, Home, Wrench, Users, Briefcase, MessageSquare } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const navLinks = [
  { href: '#inicio', label: 'Inicio', icon: Home },
  { href: '#servicios', label: 'Servicios', icon: Wrench },
  { href: '#nosotros', label: 'Nosotros', icon: Users },
  { href: '#trabajos', label: 'Trabajos', icon: Briefcase },
  { href: '#contacto', label: 'Contacto', icon: MessageSquare },
] as const;

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Actualizar sección activa
      const sections = document.querySelectorAll('section[id]');
      let currentActiveSection = '';

      sections.forEach((section) => {
        const element = section as HTMLElement;
        const sectionTop = element.offsetTop - 120; // Offset más grande para header fijo
        const sectionHeight = element.offsetHeight;
        const sectionId = element.getAttribute('id');

        if (sectionId && window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          currentActiveSection = `#${sectionId}`;
        }
      });

      if (currentActiveSection !== activeSection) {
        setActiveSection(currentActiveSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Llamar una vez al cargar
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => activeSection === href;

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
          : 'bg-gradient-to-b from-black/10 to-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo con animación */}
          <motion.a 
            href="#inicio" 
            className="flex items-center space-x-3 group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <motion.img 
              src="/img/Seprogar-Logo-02.png"
              alt="Seprogar Icon"
              className="h-10 w-auto"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            />
            <motion.img 
              src="/img/Seprogar-Logo-03.png"
              alt="Seprogar"
              className="h-8 w-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <div key={href} className="relative group">
                <a
                  href={href}
                  className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive(href) 
                      ? 'text-[#F37021]' 
                      : 'text-gray-700 hover:text-[#F37021]'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {label}
                </a>
                {isActive(href) && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F37021]"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </div>
            ))}
            <motion.a
              href="https://wa.me/5491128484962?text=Hola%20Seprogar,%20quiero%20solicitar%20un%20presupuesto"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#F37021] to-orange-500 text-white px-6 py-2.5 rounded-full font-medium flex items-center space-x-2 shadow-lg hover:shadow-orange-200 transition-all duration-300 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Phone size={16} className="animate-pulse" />
              <span>Solicitar presupuesto</span>
            </motion.a>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label="Menú de navegación"
          >
            {isMenuOpen ? (
              <X size={28} className="text-gray-700" />
            ) : (
              <Menu size={28} className="text-gray-700" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-6 space-y-3">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive(href)
                        ? 'bg-[#F37021]/10 text-[#F37021] font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {label}
                  </a>
                ))}
                <a
                  href="https://wa.me/5491128484962?text=Hola%20Seprogar,%20quiero%20solicitar%20un%20presupuesto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center mt-4 bg-gradient-to-r from-[#F37021] to-orange-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-orange-200 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Phone size={18} className="mr-2 animate-pulse" />
                  <span>Solicitar presupuesto</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
