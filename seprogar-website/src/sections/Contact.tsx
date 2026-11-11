import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { whatsappLink } from '../lib/fallbackContent';

export const Contact = () => {
  const { content } = useSiteContent();
  const settings = content.settings;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `Hola, mi nombre es ${formData.name}.
Les escribo desde el formulario de contacto de Seprogar para solicitar más información sobre sus servicios.

📞 Teléfono: ${formData.phone || 'No proporcionado'}
📧 Email: ${formData.email}

Mensaje:
${formData.message}

Quedo atento/a a su respuesta.
Muchas gracias.`;

    window.open(whatsappLink(settings.whatsapp, message), '_blank');

    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <section id="contacto" className="relative py-16 md:py-20 overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F37021]/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#000336]/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#F37021] text-sm font-medium mb-3 px-3 py-1 bg-orange-50 dark:bg-orange-500/10 rounded-full">
            Contacto
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Contácta<span className="text-gradient-brand">nos</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#F37021] to-orange-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-muted max-w-2xl mx-auto text-lg">
        Estamos listos para atenderte. Completá el formulario y te respondemos a la brevedad.
      </p>
    </motion.div>

    <div className="space-y-12">
      {/* Sección superior: Formulario e Información */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-surface p-8 rounded-3xl shadow-xl border border-theme hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full"
        >
        <div className="mb-8">
          <h3 className="font-display text-2xl font-bold text-foreground mb-2">Envianos un mensaje</h3>
          <p className="text-muted">Estamos para responder cualquier consulta.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-foreground">Nombre completo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-4 py-3 rounded-lg border border-theme bg-surface-elevated text-foreground placeholder:text-muted focus:ring-2 focus:ring-[#F37021]/50 focus:border-[#F37021] transition-all duration-200"
                placeholder="Tu nombre completo"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">Correo electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-4 py-3 rounded-lg border border-theme bg-surface-elevated text-foreground placeholder:text-muted focus:ring-2 focus:ring-[#F37021]/50 focus:border-[#F37021] transition-all duration-200"
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-sm font-medium text-foreground">Teléfono</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-4 py-3 rounded-lg border border-theme bg-surface-elevated text-foreground placeholder:text-muted focus:ring-2 focus:ring-[#F37021]/50 focus:border-[#F37021] transition-all duration-200"
                  placeholder="Tu número de teléfono"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <label htmlFor="message" className="block text-sm font-medium text-foreground">Mensaje</label>
            <div className="relative">
              <div className="absolute top-3 left-3">
                <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-4 py-3 rounded-lg border border-theme bg-surface-elevated text-foreground placeholder:text-muted focus:ring-2 focus:ring-[#F37021]/50 focus:border-[#F37021] transition-all duration-200 resize-none"
                placeholder="Cuéntanos cómo podemos ayudarte..."
                required
              ></textarea>
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#F37021] to-orange-500 text-white py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-[#F37021]/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg"
            >
              <Send size={20} className="transform -rotate-12" />
              Enviar mensaje
            </button>
          </div>
        </form>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col h-full"
        >
          <div className="bg-surface p-8 rounded-3xl shadow-xl border border-theme hover:shadow-2xl transition-shadow duration-300 flex-1">
          <div className="mb-8">
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">Información de contacto</h3>
            <p className="text-muted">Canales disponibles para atenderte</p>
          </div>
          
          <div className="space-y-6">
            {/* Dirección */}
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-[#F37021]/15 dark:bg-[#F37021]/20 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-[#F37021]" />
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-foreground text-lg">Dirección</h4>
                <p className="text-muted mt-1">{settings.address}</p>
                {settings.map_url ? (
                  <a
                    href={settings.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#F37021] hover:underline mt-2 text-sm font-medium"
                  >
                    Ver en el mapa
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                ) : null}
              </div>
            </div>
            
            {/* Email */}
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-500/10 dark:bg-blue-500/20 p-3 rounded-xl">
                <Mail className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-foreground text-lg">Correo electrónico</h4>
                <a href={`mailto:${settings.contact_email}`} className="text-muted hover:text-[#F37021] transition-colors duration-200 mt-1 block">
                  {settings.contact_email}
                </a>
                <p className="text-sm text-muted mt-2">Respuesta en menos de 24 horas</p>
              </div>
            </div>
            
            {/* Teléfono */}
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-green-500/10 dark:bg-green-500/20 p-3 rounded-xl">
                <Phone className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-foreground text-lg">Teléfono</h4>
                <a href={`tel:${settings.phone_tel}`} className="text-foreground hover:text-[#F37021] transition-colors text-lg font-medium">
                  {settings.phone_display}
                </a>
                <p className="text-sm text-muted mt-1">
                  {settings.hours[0] ? `${settings.hours[0].label}: ${settings.hours[0].value}` : null}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-theme">
            <h4 className="font-semibold text-foreground text-lg mb-4">Horario de atención</h4>
            <div className="grid grid-cols-2 gap-4">
              {settings.hours.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className={`bg-surface-elevated border border-theme p-4 rounded-xl ${
                    index === settings.hours.length - 1 && settings.hours.length % 2 === 1
                      ? 'col-span-2'
                      : ''
                  }`}
                >
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-muted">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          </div>
        </motion.div>
      </div>

      {/* Sección de Redes Sociales - Ahora ocupa todo el ancho */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-r from-[#000336] to-gray-900 p-8 rounded-2xl shadow-xl text-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Síguenos en redes</h3>
              <p className="text-gray-300">Mantente actualizado con nuestras últimas noticias y ofertas especiales</p>
            </div>
            
            <div className="flex space-x-4">
              {[
                {
                  label: 'Facebook',
                  href: settings.social_links.facebook || '#',
                  path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
                },
                {
                  label: 'Instagram',
                  href: settings.social_links.instagram || '#',
                  path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
                },
                {
                  label: 'WhatsApp',
                  href: whatsappLink(settings.whatsapp, 'Hola Seprogar'),
                  path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
                },
                {
                  label: 'LinkedIn',
                  href: settings.social_links.linkedin || '#',
                  path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 transition-all duration-300 p-4 rounded-xl flex items-center justify-center w-14 h-14"
                  aria-label={social.label}
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
        </div>
      </motion.div>
    </div>
  </div>
</section>
);
}
