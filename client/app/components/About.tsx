'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About FoodFinder
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing the way people discover and order food through 
            the power of artificial intelligence and computer vision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              We believe that discovering great food should be as simple as taking a picture. 
              Our platform uses advanced AI technology to recognize dishes from photos and 
              connect you with local restaurants that serve them.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Whether you're craving something specific or exploring new culinary experiences, 
              FoodFinder makes it easy to satisfy your hunger with just a few taps.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { number: '10K+', label: 'Dishes Recognized' },
                { number: '500+', label: 'Restaurant Partners' },
                { number: '50K+', label: 'Happy Users' },
                { number: '95%', label: 'Accuracy Rate' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-blue-50 rounded-lg"
                >
                  <div className="text-2xl font-bold text-blue-600">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl p-8 text-white h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🍕</div>
                <h4 className="text-2xl font-bold mb-2">See Food, Find Food</h4>
                <p>Instant restaurant matching</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;