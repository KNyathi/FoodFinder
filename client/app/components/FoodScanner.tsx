'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Camera, Upload, Search } from 'lucide-react';

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

  return (
    <section id="scanner" ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Scan Your Food
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take a picture or upload an image of any food, and we'll find restaurants 
            near you that serve it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              {!selectedImage ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Upload Food Image
                  </h3>
                  <p className="text-gray-500 mb-4">
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
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <img
                    src={selectedImage}
                    alt="Uploaded food"
                    className="w-full h-64 object-cover rounded-2xl mb-4"
                  />
                  <div className="flex gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2"
                    >
                      <Search size={20} />
                      Search Restaurants
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(null)}
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium"
                    >
                      Retake
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              How It Works
            </h3>
            
            {[
              {
                step: '1',
                title: 'Take a Picture',
                description: 'Snap a photo of any food you want to find'
              },
              {
                step: '2',
                title: 'AI Recognition',
                description: 'Our AI identifies the dish and ingredients'
              },
              {
                step: '3',
                title: 'Find Restaurants',
                description: 'Discover local places that serve similar dishes'
              },
              {
                step: '4',
                title: 'Order & Enjoy',
                description: 'Place your order and satisfy your cravings'
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ x: 10 }}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {item.title}
                  </h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FoodScanner;