import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { whatsappLink } from '../lib/fallbackContent';

export function StickyWhatsApp() {
  const { content } = useSiteContent();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 380);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href={whatsappLink(content.settings.whatsapp, 'Hola Seprogar, quiero solicitar un presupuesto')}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed z-[60] bottom-20 right-5 md:bottom-8 md:right-24 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_-12px_rgba(18,140,126,0.65)] transition-all duration-300 hover:brightness-105 hover:-translate-y-0.5 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
      aria-label="Escribir por WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
