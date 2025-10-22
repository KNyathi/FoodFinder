'use client';

import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Camera } from 'lucide-react';
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const footerSections = [
    {
      title: t('Product'),
      links: [
        { name: t('Food Scanner'), href: '#scanner' },
        { name: t('Restaurants'), href: '#restaurants' },
        { name: t('Mobile App'), href: '#app' },
      ],
    },
    {
      title: t('Company'),
      links: [
        { name: t('About Us'), href: '#about' },
        { name: t('Careers'), href: '#careers' },
        { name: t('Press'), href: '#press' },
        { name: t('Contact'), href: '#contact' },
      ],
    },
    {
      title: t('Support'),
      links: [
        { name: t('Help Center'), href: '#help' },
        { name: t('Privacy Policy'), href: '#privacy' },
        { name: t('Terms of Service'), href: '#terms' },
        { name: t('FAQ'), href: '#faq' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <footer className="bg-black text-white font-Montserrat">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-6">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-orangeCustom"
              >
                <Camera className="w-5 h-5 text-black" />
              </motion.div>
              <span className="text-2xl font-bold text-white">
                {t('Yeda')}<span className="text-orangeCustom">{t('Finder')}</span>
              </span>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              {t('Discover amazing food through your camera. Find local restaurants, order your favorite dishes, and satisfy your cravings with just a snap.')}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-5 h-5 text-orangeCustom" />
                <span>hello@yedafinder.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-5 h-5 text-orangeCustom" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-5 h-5 text-orangeCustom" />
                <span>{t('123 Food Street, Taste City')}</span>
              </div>
            </div>
          </motion.div>

          {/* Links Sections */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-6 text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.button
                      onClick={() => handleLinkClick(link.href)}
                      whileHover={{ x: 5, color: '#f97316' }}
                      className="text-gray-300 hover:text-orangeCustom transition-colors duration-300 text-left w-full"
                    >
                      {link.name}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="mb-6 lg:mb-0">
              <h3 className="text-xl font-semibold mb-2 text-white">
                {t('Stay Updated with Food Trends')}
              </h3>
              <p className="text-gray-300">
                {t('Get the latest food discoveries and restaurant updates')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder={t('Enter your email')}
                className="px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-orangeCustom focus:ring-1 focus:ring-orangeCustom w-full sm:w-64"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orangeCustom text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-all duration-300 whitespace-nowrap shadow-lg shadow-orangeCustom/25"
              >
                {t('Subscribe')}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-gray-400 mb-4 md:mb-0"
            >
              <p>
                &copy; {currentYear} {t('YedaFinder. All rights reserved.')}
              </p>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex space-x-4"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-300 hover:bg-orangeCustom hover:text-white transition-all duration-300 border border-white/20"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>

            {/* Additional Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex space-x-6 mt-4 md:mt-0"
            >
              <motion.button
                onClick={() => handleLinkClick('#privacy')}
                whileHover={{ color: '#f97316' }}
                className="text-gray-400 hover:text-orangeCustom transition-colors duration-300"
              >
                {t('Privacy Policy')}
              </motion.button>
              <motion.button
                onClick={() => handleLinkClick('#terms')}
                whileHover={{ color: '#f97316' }}
                className="text-gray-400 hover:text-orangeCustom transition-colors duration-300"
              >
                {t('Terms of Service')}
              </motion.button>
              <motion.button
                onClick={() => handleLinkClick('#cookies')}
                whileHover={{ color: '#f97316' }}
                className="text-gray-400 hover:text-orangeCustom transition-colors duration-300"
              >
                {t('Cookies')}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile App Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white/5 backdrop-blur-sm py-6 border-t border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h4 className="text-lg font-semibold mb-2 text-white">{t('Get the YedaFinder App')}</h4>
              <p className="text-gray-300">{t('Scan food on the go with our mobile app')}</p>
            </div>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-orangeCustom transition-colors duration-300 border border-white/20"
              >
                <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-black font-bold text-xs">A</span>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-300">{t('Download on the')}</div>
                  <div className="text-sm font-semibold">{t('App Store')}</div>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-orangeCustom transition-colors duration-300 border border-white/20"
              >
                <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-black font-bold text-xs">P</span>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-300">{t('Get it on')}</div>
                  <div className="text-sm font-semibold">{t('Google Play')}</div>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="relative">
        <motion.div
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-4 left-1/4 w-2 h-2 bg-orangeCustom rounded-full"
        />
        <motion.div
          animate={{
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute -top-2 right-1/3 w-1 h-1 bg-orangeCustom rounded-full"
        />
      </div>
    </footer>
  );
};

export default Footer;