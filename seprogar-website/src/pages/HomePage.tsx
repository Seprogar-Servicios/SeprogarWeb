import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { Hero } from '../sections/Hero';
import { Services } from '../sections/Services';
import { Process } from '../sections/Process';
import { WhyUs } from '../sections/WhyUs';
import { Team } from '../sections/Team';
import { Coverage } from '../sections/Coverage';
import { Faq } from '../sections/Faq';
import { Contact } from '../sections/Contact';
import { Footer } from '../components/Footer';
import { StickyWhatsApp } from '../components/StickyWhatsApp';
import { Seo } from '../components/seo/Seo';
import { localBusinessJsonLd } from '../components/seo/JsonLd';
import { SITE_DEFAULT_DESCRIPTION, SITE_DEFAULT_TITLE } from '../lib/seo';
import { hashFromHref, scrollToSection } from '../lib/scroll';
import { useSiteContent } from '../contexts/SiteContentContext';

export function HomePage() {
  const location = useLocation();
  const { content } = useSiteContent();

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  useEffect(() => {
    if (!location.hash) return;
    requestAnimationFrame(() => scrollToSection(location.hash));
  }, [location.hash, location.key]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (window.location.pathname !== '/') return;

      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== '/' && url.pathname !== '') return;

      const hash = hashFromHref(url.hash || anchor.getAttribute('href'));
      if (!hash) return;

      // Siempre scrollear, aunque el hash de la URL ya sea el mismo
      e.preventDefault();
      scrollToSection(hash);

      if (window.location.hash !== hash) {
        window.history.pushState(null, '', `/${hash}`);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={SITE_DEFAULT_TITLE}
        description={SITE_DEFAULT_DESCRIPTION}
        path="/"
        jsonLd={[localBusinessJsonLd(), faqJsonLd]}
      />
      <Header />
      <main className="flex-grow">
        <AnimatePresence>
          <Hero key="hero" />
          <Services key="services" />
          <Process key="process" />
          <WhyUs key="whyus" />
          <Team key="team" />
          <Coverage key="coverage" />
          <Faq key="faq" />
          <Contact key="contact" />
        </AnimatePresence>
      </main>
      <Footer />
      <StickyWhatsApp />
    </div>
  );
}
