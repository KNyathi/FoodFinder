'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Camera, Upload, Search, X } from 'lucide-react';

const FoodScanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearchRestaurants = () => {
    // Open Yandex Maps for restaurant search
    window.open('https://yandex.com/maps', '_blank');
  };

  return (
    <section id="scanner" ref={ref} className="py-20 bg-black font-Montserrat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Scan Your <span className="text-orangeCustom">Food</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Take a picture or upload an image of any food, and we'll find restaurants 
            near you that serve it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Scanner Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
              {!selectedImage ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="border-2 border-dashed border-white/30 rounded-2xl p-12 text-center cursor-pointer group"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Camera className="w-16 h-16 text-orangeCustom mx-auto mb-4 group-hover:text-orange-400 transition-colors" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Upload Food Image
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-400">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {/* Animated scanning effect */}
                  <motion.div
                    animate={{ 
                      y: [-50, 50, -50],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-x-4 h-1 bg-orangeCustom rounded-full blur-sm"
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center relative"
                >
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Uploaded food"
                      className="w-full h-64 object-cover rounded-2xl mb-4 border-2 border-orangeCustom/50"
                    />
                    
                    {/* Scanning overlay animation */}
                    <motion.div
                      animate={{ y: [-64, 320] }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-x-0 h-8 bg-gradient-to-b from-orangeCustom/40 to-transparent rounded-full blur-sm"
                    />
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <motion.button
                      onClick={handleSearchRestaurants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-orangeCustom text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orangeCustom/25"
                    >
                      <Search size={20} />
                      Search Restaurants
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(null)}
                      className="border border-white/30 text-white px-6 py-3 rounded-full font-medium hover:border-orangeCustom hover:text-orangeCustom transition-colors"
                    >
                      <X size={20} />
                      Retake
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>

            
          </motion.div>

          {/* How It Works Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-white mb-6">
              How It <span className="text-orangeCustom">Works</span>
            </h3>
            
            {[
              {
                step: '1',
                title: 'Take a Picture',
                description: 'Snap a photo of any food you want to find',
                icon: '📸'
              },
              {
                step: '2',
                title: 'AI Recognition',
                description: 'Our AI identifies the dish and ingredients',
                icon: '🤖'
              },
              {
                step: '3',
                title: 'Find Restaurants',
                description: 'Discover local places that serve similar dishes',
                icon: '📍'
              },
              {
                step: '4',
                title: 'Order & Enjoy',
                description: 'Place your order and satisfy your cravings',
                icon: '🍽️'
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center gap-6 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-orangeCustom/30 transition-all duration-300 group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex-shrink-0 w-14 h-14 bg-orangeCustom text-white rounded-2xl flex items-center justify-center font-bold text-lg group-hover:bg-orange-600 transition-colors"
                >
                  {item.step}
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <h4 className="font-semibold text-white text-lg">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-gray-300">{item.description}</p>
                </div>
                
                {/* Animated line connector (except for last item) */}
                {index < 3 && (
                  <motion.div
                    animate={{ 
                      height: [0, 20, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                      ease: "easeInOut"
                    }}
                    className="absolute -bottom-6 left-8 w-0.5 h-6 bg-orangeCustom"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              title: "Fast Processing",
              description: "Get results in under 5 seconds",
              stat: "< 5s"
            },
            {
              title: "High Accuracy",
              description: "95% accurate food recognition",
              stat: "95%"
            },
            {
              title: "Wide Coverage",
              description: "Thousands of restaurants worldwide",
              stat: "10K+"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center"
            >
              <div className="text-3xl font-bold text-orangeCustom mb-2">{feature.stat}</div>
              <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FoodScanner;