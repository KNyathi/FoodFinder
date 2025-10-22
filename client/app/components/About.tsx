'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="py-20 bg-black font-Montserrat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-4">
            About <span className="text-orangeCustom">YedaFinder</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
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
            <h3 className="text-3xl font-bold text-white mb-6">
              Our <span className="text-orangeCustom">Mission</span>
            </h3>
            <p className="text-lg text-gray-300 mb-6">
              We believe that discovering great food should be as simple as taking a picture. 
              Our platform uses advanced AI technology to recognize dishes from photos and 
              connect you with local restaurants that serve them.
            </p>
            <p className="text-lg text-gray-300 mb-8">
              Whether you're craving something specific or exploring new culinary experiences, 
              YedaFinder makes it easy to satisfy your hunger with just a few taps.
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
                  className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
                >
                  <div className="text-2xl font-bold text-orangeCustom">{stat.number}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-96 flex items-center justify-center"
          >
            {/* 3D Animated Pizza Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Main Pizza Slice */}
              <motion.div
                animate={{
                  y: [-100, 100, -100],
                  rotateY: [0, 180, 360],
                  rotateX: [0, 15, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.5, 1]
                }}
                className="relative z-10"
              >
                {/* Pizza Slice */}
                <motion.div
                  animate={{
                    rotateZ: [0, -5, 5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-8xl"
                >
                  🍕
                </motion.div>
              </motion.div>

              {/* Floating Particles/Ingredients */}
              {[
                { emoji: "🍅", delay: 0, size: "text-2xl", x: -50, y: -30 },
                { emoji: "🧀", delay: 0.5, size: "text-xl", x: 60, y: -40 },
                { emoji: "🍄", delay: 1, size: "text-lg", x: -70, y: 50 },
                { emoji: "🫒", delay: 1.5, size: "text-lg", x: 80, y: 30 },
                { emoji: "🌿", delay: 2, size: "text-xl", x: -30, y: 60 },
              ].map((particle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: [0, particle.x, 0],
                    y: [0, particle.y, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: particle.delay,
                    ease: "easeInOut",
                  }}
                  className={`absolute ${particle.size} pointer-events-none`}
                >
                  {particle.emoji}
                </motion.div>
              ))}

              {/* Glow Effect */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-orangeCustom/20 rounded-full blur-xl"
              />

              {/* Orbital Rings */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute w-64 h-64 border border-orangeCustom/30 rounded-full"
              />
              <motion.div
                animate={{
                  rotate: [360, 0],
                  scale: [1.1, 1, 1.1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute w-80 h-80 border border-orangeCustom/20 rounded-full"
              />
            </div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute bottom-4 left-0 right-0 text-center"
            >
              <h4 className="text-2xl font-bold text-white mb-2">See Food, Find Food</h4>
              <p className="text-orange-100">Instant restaurant matching</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Additional Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              title: "AI-Powered Recognition",
              description: "Advanced machine learning algorithms that identify dishes with 95% accuracy",
              icon: "🤖"
            },
            {
              title: "Real-Time Matching",
              description: "Instant connection with local restaurants serving your desired dishes",
              icon: "⚡"
            },
            {
              title: "Seamless Ordering",
              description: "Order directly through our platform with just a few taps",
              icon: "📱"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="text-4xl mb-4"
              >
                {feature.icon}
              </motion.div>
              <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;