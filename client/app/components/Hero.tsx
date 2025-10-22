'use client';

import { motion, Variants } from 'framer-motion';
import { Camera, Search, MapPin } from 'lucide-react';
import { useLanguage } from "../context/LanguageContext";
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Hero = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  const handleScanClick = () => {
    const scannerSection = document.getElementById('scanner');
    if (scannerSection) {
      const offsetTop = scannerSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const handleBrowseRestaurants = () => {
    window.open('https://yandex.com/maps', '_blank');
  };

  // Animation variants with proper typing
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: 1.6
      }
    }
  };

  const featureVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      rotateX: 15
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        duration: 2
      }
    }
  };

  const gradientVariants: Variants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      rotate: -10 
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 50,
        duration: 1.2
      }
    }
  };

  return (
    <section 
      id="home" 
      ref={ref}
      className="min-h-screen font-Montserrat flex items-center justify-center bg-black relative overflow-hidden" 
      style={{ paddingTop: '0px' }}
    >
      {/* Animated background elements */}
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={gradientVariants}
        className="absolute inset-0 opacity-20"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orangeCustom/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto mt-[150px] px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            {t('Discover Food')}
            <motion.span 
              variants={itemVariants}
              className="block text-transparent bg-clip-text bg-orangeCustom"
            >
              {t('Through Your Lens')}
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-white mb-12 max-w-3xl mx-auto"
          >
            {t('Take a picture of any food and instantly find restaurants near you that serve it. Order directly through our platform and satisfy your cravings.')}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={handleScanClick}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(255, 107, 53, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-orangeCustom text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 hover:bg-white hover:text-black transition-colors shadow-lg shadow-orangeCustom/25 relative overflow-hidden"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Camera size={24} />
              </motion.div>
              {t('Scan Food Now')}
            </motion.button>

            <motion.button
              onClick={handleBrowseRestaurants}
              whileHover={{ 
                scale: 1.05,
                borderColor: "#ff6b35",
                color: "#ff6b35"
              }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 hover:bg-white transition-colors"
            >
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Search size={24} />
              </motion.div>
              {t('Browse Restaurants')}
            </motion.button>
          </motion.div>

          {/* Feature Icons */}
          <motion.div
            variants={containerVariants}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { icon: Camera, title: t('Take Photo'), desc: t('Snap a picture of any food') },
              { icon: Search, title: t('AI Search'), desc: t('Our AI finds matching dishes') },
              { icon: MapPin, title: t('Discover Places'), desc: t('Find restaurants nearby') },
            ].map((item, index) => (
              <motion.div
                key={item.title}
             
                className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 text-white hover:border-orangeCustom/50 hover:shadow-orangeCustom/10 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <item.icon className="w-12 h-12 text-orangeCustom mx-auto mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;