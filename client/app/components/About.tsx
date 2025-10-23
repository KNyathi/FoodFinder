'use client';

import { motion, Variants } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from "../context/LanguageContext";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });
  const { t } = useLanguage();

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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
        damping: 15,
        stiffness: 100
      }
    }
  };

  const slideInLeft: Variants = {
    hidden: { 
      opacity: 0, 
      x: -80,
      rotateY: 10
    },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 80
      }
    }
  };

  const slideInRight: Variants = {
    hidden: { 
      opacity: 0, 
      x: 80,
      rotateY: -10
    },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 80
      }
    }
  };

  const featureVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100
      }
    }
  };

  const statVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <section id="about" ref={ref} className="py-20 bg-black font-Montserrat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold text-white mb-4"
          >
            {t('About')} <motion.span 
              variants={itemVariants}
              className="text-orangeCustom"
            >
              {t('YedaFinder')}
            </motion.span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            {t("We're revolutionizing the way people discover and order food through the power of artificial intelligence and computer vision.")}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={slideInLeft}
          >
            <motion.h3
              variants={itemVariants}
              className="text-3xl font-bold text-white mb-6"
            >
              {t('Our')} <span className="text-orangeCustom">{t('Mission')}</span>
            </motion.h3>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-300 mb-6"
            >
              {t('We believe that discovering great food should be as simple as taking a picture. Our platform uses advanced AI technology to recognize dishes from photos and connect you with local restaurants that serve them.')}
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-300 mb-8"
            >
              {t("Whether you're craving something specific or exploring new culinary experiences, YedaFinder makes it easy to satisfy your hunger with just a few taps.")}
            </motion.p>
            
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { number: '10K+', label: t('Dishes Recognized') },
                { number: '500+', label: t('Restaurant Partners') },
                { number: '50K+', label: t('Happy Users') },
                { number: '95%', label: t('Accuracy Rate') },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                 
                  className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-orangeCustom/50 transition-all duration-300"
                >
                  <motion.div 
                    className="text-2xl font-bold text-orangeCustom"
                    whileHover={{ scale: 1.1 }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm text-gray-300 mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={slideInRight}
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
              <h4 className="text-2xl font-bold text-white mb-2">{t('See Food, Find Food')}</h4>
              <p className="text-orange-100">{t('Instant restaurant matching')}</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Additional Features Section */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              title: t("AI-Powered Recognition"),
              description: t("Advanced machine learning algorithms that identify dishes with 95% accuracy"),
              icon: "🤖"
            },
            {
              title: t("Real-Time Matching"),
              description: t("Instant connection with local restaurants serving your desired dishes"),
              icon: "⚡"
            },
            {
              title: t("Seamless Ordering"),
              description: t("Order directly through our platform with just a few taps"),
              icon: "📱"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
         
              className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center hover:border-orangeCustom/30 transition-all duration-300"
            >
              <motion.div
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 10,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
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