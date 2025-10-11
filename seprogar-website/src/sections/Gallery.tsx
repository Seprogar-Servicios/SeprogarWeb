import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Zap, Wrench, Droplets } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

interface GalleryImage {
  id: number;
  src: string;
  title: string;
  category: 'plomeria' | 'gas' | 'electricidad';
  description?: string;
}

// Placeholder images - replace with your actual images
export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1600566752225-0d850a5a6229?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Instalación de gas profesional',
    category: 'gas',
    description: 'Instalación completa de sistema de gas natural con los más altos estándares de seguridad.'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1592409065737-a25380a8c0af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Reparación eléctrica integral',
    category: 'electricidad',
    description: 'Solución de problemas eléctricos y actualización de instalaciones obsoletas.'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Reforma de baño completo',
    category: 'plomeria',
    description: 'Renovación completa de baño con materiales de primera calidad y diseño moderno.'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1581094487229-6a7f8f19a2a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Mantenimiento industrial',
    category: 'electricidad',
    description: 'Servicio de mantenimiento preventivo y correctivo para instalaciones industriales.'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1631549916768-411a9d530d4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Instalación sanitaria',
    category: 'plomeria',
    description: 'Sistema de tuberías y desagües con materiales de larga duración.'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Revisión de instalaciones',
    category: 'gas',
    description: 'Inspección profesional de instalaciones de gas para garantizar su correcto funcionamiento.'
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Cableado estructurado',
    category: 'electricidad',
    description: 'Instalación de redes de datos y cableado estructurado para hogares y empresas.'
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Sistema de calefacción',
    category: 'gas',
    description: 'Instalación y mantenimiento de sistemas de calefacción a gas de alta eficiencia.'
  }
];

const categories = [
  { id: 'todos', name: 'Todos', icon: null },
  { id: 'plomeria', name: 'Plomería', icon: <Droplets className="w-4 h-4 mr-2" /> },
  { id: 'gas', name: 'Gas', icon: <Wrench className="w-4 h-4 mr-2" /> },
  { id: 'electricidad', name: 'Electricidad', icon: <Zap className="w-4 h-4 mr-2" /> },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'plomeria': return 'from-blue-500 to-cyan-500';
    case 'gas': return 'from-orange-500 to-amber-500';
    case 'electricidad': return 'from-yellow-400 to-yellow-600';
    default: return 'from-gray-500 to-gray-700';
  }
};

export const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const filteredImages = activeCategory === 'todos' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigate = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    }
    
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => navigate('next'),
    onSwipedRight: () => navigate('prev'),
    trackMouse: true
  });

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = galleryImages.map((image) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = image.src;
          img.onload = () => resolve(true);
          img.onerror = () => reject();
        });
      });

      try {
        await Promise.all(imagePromises);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading images', error);
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  if (isLoading) {
    return (
      <section id="trabajos" className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="trabajos" className="relative py-24 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAzMzYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-[#F37021] to-[#FF9E5E] text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <ImageIcon className="w-4 h-4 mr-2" />
            <span>Nuestro Trabajo</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Galería de <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F37021] to-[#FF9E5E]">Trabajos</span>
          </h2>
          
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#F37021] to-[#FF9E5E] rounded-full mx-auto mb-6"></div>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explora nuestra galería de trabajos realizados con profesionalismo y dedicación en cada proyecto.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-[#F37021] to-[#FF9E5E] text-white shadow-lg shadow-orange-500/20'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category.icon}
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-2xl shadow-xl cursor-pointer h-80"
                onClick={() => openLightbox(image)}
              >
                <div className="absolute inset-0">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2 bg-gradient-to-r ${getCategoryColor(image.category)} text-white`}>
                      {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">{image.title}</h3>
                    <p className="text-gray-200 text-sm line-clamp-2">{image.description}</p>
                  </div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transform scale-0 group-hover:scale-100 transition-transform duration-500">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View More Button */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.button 
            className="group relative overflow-hidden bg-gradient-to-r from-[#F37021] to-[#FF9E5E] hover:from-[#FF9E5E] hover:to-[#F37021] text-white px-8 py-3.5 rounded-full font-medium transition-all duration-500 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center">
              Ver más trabajos
              <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </motion.button>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            {...handlers}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-[#F37021] transition-colors z-20"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              aria-label="Cerrar"
            >
              <X className="w-8 h-8" />
            </button>

            <button 
              className="absolute left-6 text-white hover:text-[#F37021] transition-colors z-20 hidden md:block"
              onClick={(e) => {
                e.stopPropagation();
                navigate('prev');
              }}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <button 
              className="absolute right-6 text-white hover:text-[#F37021] transition-colors z-20 hidden md:block"
              onClick={(e) => {
                e.stopPropagation();
                navigate('next');
              }}
              aria-label="Siguiente"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            <div className="relative w-full max-w-6xl h-full flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex-1 flex items-center justify-center relative">
                <motion.img 
                  key={selectedImage.id}
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[80vh] object-contain"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <div className="mt-6 text-center text-white">
                <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
                <p className="text-gray-300 max-w-2xl mx-auto">{selectedImage.description}</p>
                <div className="mt-3 text-sm text-gray-400">
                  {currentIndex + 1} de {filteredImages.length}
                </div>
              </div>
            </div>

            {/* Mobile navigation */}
            <div className="md:hidden fixed bottom-6 left-0 right-0 flex justify-center gap-8 z-20">
              <button 
                className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('prev');
                }}
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('next');
                }}
                aria-label="Siguiente"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
