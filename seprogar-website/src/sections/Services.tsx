import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Droplets, Zap, CheckCircle, ArrowRight, Wind, Brush } from 'lucide-react';
import type { ServiceCardProps } from '../types';

const services: ServiceCardProps[] = [
  {
    icon: <Droplets className="w-8 h-8" />,
    title: 'Plomería',
    description: 'Soluciones integrales para tus necesidades de fontanería',
    items: [
      'Reparación de fugas',
      'Instalaciones sanitarias',
      'Destapaciones',
      'Mantenimiento preventivo',
      'Atención de emergencias 24/7'
    ],
    gradient: 'from-blue-600 to-blue-800'
  },
  {
    icon: <Wrench className="w-8 h-8" />,
    title: 'Gas',
    description: 'Instalaciones seguras y certificadas',
    items: [
      'Instalaciones de gas natural y envasado',
      'Detección de fugas',
      'Mantenimiento de instalaciones',
      'Habilitación de instalaciones',
      'Certificaciones'
    ],
    gradient: 'from-orange-500 to-amber-500'
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Electricidad',
    description: 'Soluciones eléctricas profesionales',
    items: [
      'Instalaciones eléctricas',
      'Reparación de cortocircuitos',
      'Actualización de tableros',
      'Instalación de luminarias',
      'Mantenimiento industrial'
    ],
    gradient: 'from-yellow-400 to-yellow-600'
  },
  {
    icon: <Wind className="w-8 h-8" />,
    title: 'Aires Acondicionados',
    description: 'Instalación y mantenimiento de sistemas de climatización',
    items: [
      'Instalación de equipos split',
      'Mantenimiento preventivo',
      'Recarga de gas refrigerante',
      'Reparación de fugas',
      'Asesoramiento técnico'
    ],
    gradient: 'from-blue-700 to-blue-900'
  },
  {
    icon: <Brush className="w-8 h-8" />,
    title: 'Pintura General',
    description: 'Servicios profesionales de pintura para interiores y exteriores',
    items: [
      'Pintura de interiores',
      'Pintura de exteriores',
      'Preparación de superficies',
      'Reparación de paredes',
      'Asesoramiento de colores'
    ],
    gradient: 'from-purple-500 to-purple-700'
  }
];

export const Services = () => {
  return (
    <section id="servicios" className="relative py-24 bg-gradient-to-br from-white to-slate-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-3 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAzMzYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-[#F37021] to-[#FF9E5E] text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Wrench className="w-4 h-4 mr-2" />
            <span>Servicios Profesionales</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nuestros <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F37021] to-[#FF9E5E]">Servicios</span>
          </h2>
          
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#F37021] to-[#FF9E5E] rounded-full mx-auto mb-6"></div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Soluciones integrales y profesionales para todas tus necesidades técnicas, con la más alta calidad y garantía de satisfacción.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          <AnimatePresence>
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ y: -10 }}
                className="group relative h-full"
              >
                <div className="absolute inset-0.5 bg-gradient-to-br from-white to-gray-50 rounded-2xl group-hover:opacity-0 transition-opacity duration-300 z-0"></div>
                <div className="relative z-10 h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 group-hover:shadow-2xl transition-all duration-500 flex flex-col">
                  <div className={`h-2 bg-gradient-to-r ${service.gradient}`}></div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {service.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    
                    <div className="flex-1">
                      <ul className="space-y-3 mb-8">
                        {service.items.map((item, i) => (
                          <motion.li 
                            key={i} 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + (i * 0.05) }}
                          >
                            <CheckCircle className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 text-${service.gradient.split(' ')[1].replace('to-', '')}`} />
                            <span className="text-gray-700">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    
                    <motion.div 
                      className="mt-auto pt-6 border-t border-gray-100"
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <a 
                        href="https://wa.me/5491128484962?text=Hola%20Seprogar,%20quiero%20solicitar%20un%20servicio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center font-medium text-gray-900 hover:text-[#F37021] transition-colors group"
                      >
                        <span className="mr-2">Solicitar servicio</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
