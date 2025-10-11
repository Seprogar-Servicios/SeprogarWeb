import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Hero } from './sections/Hero';
import { Services } from './sections/Services';
import { WhyUs } from './sections/WhyUs';
import { Gallery } from './sections/Gallery';
import { Contact } from './sections/Contact';
import { Footer } from './components/Footer';

import './App.css';

function App() {
  // Smooth scroll para los enlaces internos
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isAnchor = target.closest('a[href^="#"]');
      
      if (isAnchor) {
        e.preventDefault();
        const href = (isAnchor as HTMLAnchorElement).getAttribute('href');
        
        if (href && href !== '#') {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        <AnimatePresence>
        <Hero key="hero" />
        <Services key="services" />
        <WhyUs key="whyus" />
        <Gallery key="gallery" />
        <Contact key="contact" />
      </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;