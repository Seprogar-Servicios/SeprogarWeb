import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import { useState } from 'react';

export const Contact = () => {
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
    
    const phoneNumber = '5491128484962'; 
    const message = `Hola, mi nombre es ${formData.name}.
      Les escribo desde el formulario de contacto de Seprogar para solicitar más información sobre sus servicios de construcción.

      📞 Teléfono: ${formData.phone || 'No proporcionado'}
      📧 Email: ${formData.email}

      Mensaje:
      ${formData.message}

      Quedo atento/a a su respuesta.
      Muchas gracias.`;

const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <section id="contacto" className="relative py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
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
          <span className="inline-block text-[#F37021] text-sm font-medium mb-3 px-3 py-1 bg-orange-50 rounded-full">
            Contacto
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-sans">
            Contácta<span className="text-[#F37021]">nos</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#F37021] to-orange-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
        Estamos listos para atenderte. Completa el formulario y nos pondremos en contacto contigo a la brevedad.
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
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full"
        >
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Envíanos un mensaje</h3>
          <p className="text-gray-500">Estamos aquí para responder cualquier pregunta que tengas.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre completo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F37021]/50 focus:border-[#F37021] transition-all duration-200"
                placeholder="Tu nombre completo"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F37021]/50 focus:border-[#F37021] transition-all duration-200"
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F37021]/50 focus:border-[#F37021] transition-all duration-200"
                  placeholder="Tu número de teléfono"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
            <div className="relative">
              <div className="absolute top-3 left-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F37021]/50 focus:border-[#F37021] transition-all duration-200 resize-none"
                placeholder="Cuéntanos cómo podemos ayudarte..."
                required
              ></textarea>
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#F37021] to-orange-500 text-white py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-orange-100 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg"
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
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300 flex-1">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Información de contacto</h3>
            <p className="text-gray-500">Estamos disponibles para atenderte en los siguientes canales</p>
          </div>
          
          <div className="space-y-6">
            {/* Dirección */}
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-gradient-to-br from-[#F37021]/10 to-orange-100 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-[#F37021]" />
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-gray-900 text-lg">Dirección</h4>
                <p className="text-gray-600 mt-1">Av. Siempreviva 742, Buenos Aires</p>
                <a href="#" className="inline-flex items-center text-[#F37021] hover:underline mt-2 text-sm font-medium">
                  Ver en el mapa
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Email */}
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
                <Mail className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-gray-900 text-lg">Correo electrónico</h4>
                <a href="mailto:contacto@seprogar.com" className="text-gray-600 hover:text-[#F37021] transition-colors duration-200 mt-1 block">contacto@seprogar.com</a>
                <p className="text-sm text-gray-500 mt-2">Respuesta en menos de 24 horas</p>
              </div>
            </div>
            
            {/* Teléfono */}
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl">
                <Phone className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-gray-900 text-lg">Teléfono</h4>
                <a href="tel:+5491128484962" className="text-gray-900 hover:text-[#F37021] transition-colors text-lg font-medium">
                  +54 9 11 2848-4962
                </a>
                <p className="text-sm text-gray-500 mt-1">Lun a Dom: 8:00 - 18:00</p>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-100">
            <h4 className="font-semibold text-gray-900 text-lg mb-4">Horario de atención</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="font-medium text-gray-900">Lunes - Domingos</p>
                <p className="text-gray-600">8:00 - 18:00</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="font-medium text-gray-900">Atención regular</p>
                <p className="text-gray-600">8:00 - 18:00</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl col-span-2">
                <p className="font-medium text-gray-900">Emergencias</p>
                <p className="text-gray-600">Atención 24/7</p>
              </div>
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
              <a 
                href="#" 
                className="bg-white/10 hover:bg-white/20 transition-all duration-300 p-4 rounded-xl flex items-center justify-center w-14 h-14"
                aria-label="Facebook"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              
              <a 
                href="#" 
                className="bg-white/10 hover:bg-white/20 transition-all duration-300 p-4 rounded-xl flex items-center justify-center w-14 h-14"
                aria-label="Instagram"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              
              <a 
                href="#" 
                className="bg-white/10 hover:bg-white/20 transition-all duration-300 p-4 rounded-xl flex items-center justify-center w-14 h-14"
                aria-label="WhatsApp"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.274-.1-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.01-.571-.01-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.63.714.226 1.365.195 1.88.121.574-.09 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345z" />
                  <path d="M20.31 3.45c-1.5-1.5-3.524-2.314-5.66-2.314-4.5 0-8.16 3.66-8.16 8.16 0 1.815.6 3.496 1.62 4.83L3.75 20.25l5.85-4.56a8.13 8.13 0 004.05 1.11c4.5 0 8.16-3.66 8.16-8.16 0-2.13-.81-4.14-2.3-5.64zm-1.41 9.99c0 3.39-2.76 6.15-6.15 6.15a6.14 6.14 0 01-3.27-.94l-.21-.12-2.34.61.63-2.28-.15-.24a6.13 6.13 0 01-.94-3.28c0-3.39 2.76-6.15 6.15-6.15 1.65 0 3.21.63 4.38 1.8 1.17 1.17 1.8 2.73 1.8 4.38z" />
                </svg>
              </a>
              
              <a 
                href="#" 
                className="bg-white/10 hover:bg-white/20 transition-all duration-300 p-4 rounded-xl flex items-center justify-center w-14 h-14"
                aria-label="LinkedIn"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
          
        </div>
      </motion.div>
    </div>
  </div>
</section>
);
}
