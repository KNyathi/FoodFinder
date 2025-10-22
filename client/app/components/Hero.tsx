'use client';

import { motion } from 'framer-motion';
import { Camera, Search, MapPin } from 'lucide-react';
import { useLanguage } from "../context/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();

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

  return (
    <section id="home" className="min-h-screen font-Montserrat flex items-center justify-center bg-black relative overflow-hidden" style={{ paddingTop: '0px' }}>
      <div className="max-w-7xl mx-auto mt-[150px] px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6"
        >
          {t('Discover Food')}
          <span className="block text-transparent bg-clip-text bg-orangeCustom">
            {t('Through Your Lens')}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-white mb-12 max-w-3xl mx-auto"
        >
          {t('Take a picture of any food and instantly find restaurants near you that serve it. Order directly through our platform and satisfy your cravings.')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            onClick={handleScanClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orangeCustom text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 hover:bg-white hover:text-black transition-colors shadow-lg shadow-orangeCustom/25"
          >
            <Camera size={24} />
            {t('Scan Food Now')}
          </motion.button>

          <motion.button
            onClick={handleBrowseRestaurants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 hover:border-orangeCustom hover:text-orangeCustom hover:bg-white transition-colors"
          >
            <Search size={24} />
            {t('Browse Restaurants')}
          </motion.button>
        </motion.div>

        {/* Feature Icons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            { icon: Camera, title: t('Take Photo'), desc: t('Snap a picture of any food') },
            { icon: Search, title: t('AI Search'), desc: t('Our AI finds matching dishes') },
            { icon: MapPin, title: t('Discover Places'), desc: t('Find restaurants nearby') },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 text-white"
            >
              <item.icon className="w-12 h-12 text-orangeCustom mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;