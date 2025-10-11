import { motion } from 'framer-motion';
import { Wrench, Phone, ChevronRight } from 'lucide-react';

export const Hero = () => {
  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000336] to-[#0F4C81] text-white pt-20 overflow-hidden"
    >
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
            opacity: 0.15
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#000336]/95 via-[#000336]/80 to-[#0F4C81]/95"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <motion.div 
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm px-6 py-2.5 rounded-full mb-8 border border-white/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Wrench className="mr-2 text-[#F37021]" size={18} />
              <span className="font-medium tracking-wide">Servicios profesionales</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Soluciones técnicas <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F37021] to-[#FF9E5E]">para tu hogar</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Expertos en instalaciones y mantenimiento de gas, plomería y electricidad. Soluciones rápidas, eficientes y con garantía de satisfacción.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <a 
                href="#servicios"
                className="group relative overflow-hidden bg-gradient-to-r from-[#F37021] to-[#FF9E5E] hover:from-[#FF9E5E] hover:to-[#F37021] text-white px-8 py-4 rounded-full font-medium flex items-center justify-center transition-all duration-500 hover:shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center">
                  Nuestros servicios
                  <ChevronRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
              
              <a 
                href="#contacto"
                className="group relative overflow-hidden bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-medium flex items-center justify-center transition-all duration-500 border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/10 transform hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center">
                  <Phone className="mr-2" size={18} />
                  Solicitar presupuesto
                </span>
                <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
            </motion.div>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              { number: '5+', label: 'Años de experiencia' },
              { number: '500+', label: 'Clientes satisfechos' },
              { number: '24/7', label: 'Servicio de emergencia' },
              { number: '100%', label: 'Garantía de trabajo' },
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-white/5"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F37021] to-[#FF9E5E] mb-3">{stat.number}</div>
                <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator removed */}
    </section>
  );
};
