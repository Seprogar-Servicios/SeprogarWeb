import { motion, AnimatePresence } from 'framer-motion';
import { Award, ShieldCheck, Clock3, CheckCircle, Phone, Users } from 'lucide-react';

const features = [
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Experiencia',
    description: 'Más de 10 años de experiencia en el rubro, garantizando trabajos de calidad y satisfacción del cliente.',
    gradient: 'from-purple-500 to-indigo-600'
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Seguridad',
    description: 'Técnicos certificados y habilitados, cumpliendo con todas las normas de seguridad vigentes.',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    icon: <Clock3 className="w-6 h-6" />,
    title: 'Rapidez',
    description: 'Servicio de emergencias 24/7. Llegamos a tiempo y solucionamos tu problema rápidamente.',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: 'Garantía',
    description: 'Todos nuestros trabajos cuentan con garantía escrita. Estamos seguros de nuestro servicio.',
    gradient: 'from-rose-500 to-pink-600'
  }
] as const;

export const WhyUs = () => {
  return (
    <section id="nosotros" className="relative py-24 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAzMzYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-[#F37021] to-[#FF9E5E] text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Users className="w-4 h-4 mr-2" />
            <span>Sobre Nosotros</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ¿Por qué elegir <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F37021] to-[#FF9E5E]">SEPROGAR</span>?
          </h2>
          
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#F37021] to-[#FF9E5E] rounded-full mx-auto mb-6"></div>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            En SEPROGAR nos enorgullece ofrecer soluciones técnicas integrales con los más altos estándares de calidad y profesionalismo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {features.map((feature, index) => (
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
                  <div className={`h-1.5 bg-gradient-to-r ${feature.gradient}`}></div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                      {feature.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{feature.title}</h3>
                    <p className="text-gray-600 text-center">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 relative rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#000336] to-[#0F4C81] opacity-95"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10"></div>
          
          <div className="relative z-10 p-8 md:p-12 lg:p-16 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
                ¿Necesitas ayuda con algún servicio?
              </h3>
              <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Nuestro equipo de expertos está listo para atender tus necesidades las 24 horas del día, los 7 días de la semana.
              </p>
              
              <motion.a
                href="#contacto"
                className="group inline-flex items-center justify-center bg-gradient-to-r from-[#F37021] to-[#FF9E5E] hover:from-[#FF9E5E] hover:to-[#F37021] text-white px-8 py-4 rounded-full font-medium transition-all duration-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Phone className="w-5 h-5 mr-2" />
                <span>Contáctanos ahora</span>
                <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
