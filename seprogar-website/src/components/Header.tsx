import { useState, useEffect, type MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Phone,
  Home,
  Wrench,
  Users,
  UserRound,
  MessageSquare,
  ListOrdered,
  MapPin,
  CircleHelp,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { useHasEquipo } from '../hooks/useHasEquipo';
import { scrollToSection } from '../lib/scroll';
import { useSiteContent } from '../contexts/SiteContentContext';
import { whatsappLink } from '../lib/fallbackContent';

const navLinks = [
  { href: '#inicio', label: 'Inicio', icon: Home },
  { href: '#servicios', label: 'Servicios', icon: Wrench },
  { href: '#proceso', label: 'Proceso', icon: ListOrdered },
  { href: '#nosotros', label: 'Nosotros', icon: Users },
  { href: '#equipo', label: 'Equipo', icon: UserRound },
  { href: '#zonas', label: 'Zonas', icon: MapPin },
  { href: '#faq', label: 'FAQ', icon: CircleHelp },
  { href: '#contacto', label: 'Contacto', icon: MessageSquare },
] as const;

function sectionHref(hash: string, pathname: string) {
  return pathname === '/' ? hash : `/${hash}`;
}

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const { isDark } = useTheme();
  const { hasEquipo } = useHasEquipo();
  const { content } = useSiteContent();
  const presupuestoHref = whatsappLink(
    content.settings.whatsapp,
    'Hola Seprogar, quiero solicitar un presupuesto',
  );
  const onHome = location.pathname === '/';
  /** Solo en home + dark + tope: nav transparente sobre hero oscuro. */
  const overDarkHero = onHome && !isScrolled && isDark;
  /** Wordmark con azul oscuro: invertirlo siempre en dark (home scrolleada, especialidades, etc.). */
  const invertLogo = isDark;
  /** En páginas internas (o dark fuera del hero) conviene barra sólida, no degradé blanco. */
  const solidChrome = !onHome || isScrolled || (isDark && !overDarkHero);
  const visibleLinks = navLinks.filter((link) => link.href !== '#equipo' || hasEquipo);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (!onHome) return;

      const sections = document.querySelectorAll('section[id]');
      let currentActiveSection = '';

      sections.forEach((section) => {
        const element = section as HTMLElement;
        const sectionTop = element.offsetTop - 120;
        const sectionHeight = element.offsetHeight;
        const sectionId = element.getAttribute('id');

        if (sectionId && window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          currentActiveSection = `#${sectionId}`;
        }
      });

      setActiveSection((prev) => (currentActiveSection !== prev ? currentActiveSection : prev));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [onHome]);

  const isActive = (href: string) => activeSection === href;

  const linkIdle = overDarkHero
    ? 'text-white/90 hover:text-white'
    : 'text-foreground/80 hover:text-[#F37021]';

  /** Fuerza scroll aunque el hash de la URL ya sea el mismo (p. ej. #inicio). */
  function handleSectionClick(event: MouseEvent<HTMLAnchorElement>, hash: string) {
    if (location.pathname !== '/') return;
    event.preventDefault();
    scrollToSection(hash);
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', `/${hash}`);
    }
    setIsMenuOpen(false);
  }

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-500 ${
        solidChrome
          ? 'bg-surface/90 backdrop-blur-xl shadow-[0_10px_40px_-20px_rgba(0,0,0,0.35)] border-b border-theme py-2'
          : overDarkHero
            ? 'bg-gradient-to-b from-black/35 to-transparent py-4'
            : 'bg-gradient-to-b from-white/70 to-transparent backdrop-blur-[2px] py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center gap-3">
          <Link
            to="/#inicio"
            className="flex items-center gap-2.5 shrink-0"
            onClick={(e) => handleSectionClick(e, '#inicio')}
          >
            <img
              src="/img/Seprogar-Logo-02.png"
              alt="Seprogar"
              className="h-9 w-auto sm:h-10 object-contain"
            />
            <img
              src="/img/Seprogar-Logo-03.png"
              alt="SEPROGAR"
              className={`h-7 sm:h-8 w-auto object-contain transition-all ${
                invertLogo ? 'brightness-0 invert' : ''
              }`}
            />
          </Link>

          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {visibleLinks.map(({ href, label, icon: Icon }) => (
              <div key={href} className="relative">
                <Link
                  to={sectionHref(href, location.pathname)}
                  onClick={(e) => handleSectionClick(e, href)}
                  className={`flex items-center px-2.5 py-2 text-sm font-semibold transition-colors ${
                    isActive(href) ? 'text-[#F37021]' : linkIdle
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1.5 opacity-80 hidden xl:inline" />
                  {label}
                </Link>
                {isActive(href) ? (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#F37021] rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  />
                ) : null}
              </div>
            ))}
            <ThemeToggle lightOnDark={overDarkHero} />
            <a
              href={presupuestoHref}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 bg-gradient-to-r from-[#F37021] to-[#FF9E5E] text-white px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 shadow-brand hover:brightness-105 transition"
            >
              <Phone size={15} />
              <span>Presupuesto</span>
            </a>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle lightOnDark={overDarkHero} />
            <button
              type="button"
              className={`p-2 rounded-full transition-colors ${
                overDarkHero ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-black/5'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menú de navegación"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="mt-3 rounded-2xl border border-theme bg-surface/95 backdrop-blur-xl p-3 space-y-1 shadow-xl">
                {visibleLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    to={sectionHref(href, location.pathname)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                      isActive(href)
                        ? 'bg-[#F37021]/12 text-[#F37021] font-semibold'
                        : 'text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                    onClick={(e) => handleSectionClick(e, href)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {label}
                  </Link>
                ))}
                <a
                  href={presupuestoHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center mt-2 bg-gradient-to-r from-[#F37021] to-[#FF9E5E] text-white px-6 py-3 rounded-full font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Phone size={18} className="mr-2" />
                  Solicitar presupuesto
                </a>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
};
