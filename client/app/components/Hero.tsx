'use client';

import { motion } from 'framer-motion';
import { Camera, Search, MapPin } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen font-Montserrat flex items-center justify-center bg-black relative overflow-hidden" style={{ paddingTop: '0px' }}>



      <div className="max-w-7xl mx-auto mt-[150px] px-4 sm:px-6 lg:px-8 text-center relative z-10">


        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6"
        >
          Discover Food
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-black to-orangeCustom">
            Through Your Lens
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-white mb-12 max-w-3xl mx-auto"
        >
          Take a picture of any food and instantly find restaurants near you that serve it.
          Order directly through our platform and satisfy your cravings.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Camera size={24} />
            Scan Food Now
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 hover:border-blue-500 hover:text-blue-600 transition-colors bg-white/50 backdrop-blur-sm"
          >
            <Search size={24} />
            Browse Restaurants
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
            { icon: Camera, title: 'Take Photo', desc: 'Snap a picture of any food' },
            { icon: Search, title: 'AI Search', desc: 'Our AI finds matching dishes' },
            { icon: MapPin, title: 'Discover Places', desc: 'Find restaurants nearby' },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50"
            >
              <item.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;