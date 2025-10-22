'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Languages, Menu, X } from 'lucide-react';
import { useLanguage } from "../context/LanguageContext";
import { Menu as Menu2, MenuItem, IconButton } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { supportedLanguages } from './Languages';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userLang, setUserLang, t } = useLanguage();

  const [anchorEl, setAnchorEl] = useState(null);
  const opened = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosed = (lang: any) => {
    if (lang) setUserLang(lang);
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Update active section based on scroll position
      const sections = ['home', 'about', 'scanner'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t('Home'), href: '#home', id: 'home' },
    { name: t('About Us'), href: '#about', id: 'about' },
    { name: t('Scan'), href: '#scanner', id: 'scanner' },
  ];

  const handleNavClick = (href: string) => {
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    setIsMobileMenuOpen(false); // Close mobile menu first

    // Use setTimeout to ensure the menu is closed before scrolling
    setTimeout(() => {
      if (element) {
        const offsetTop = element.offsetTop - 80; // Adjust for navbar height
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }, 100); // Small delay to ensure menu is closed
  };

  return (
    <motion.nav
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 h-15 text-[18px] font-Montserrat transition-all duration-500 ${
        isScrolled
          ? 'bg-black border-b border-white'
          : 'bg-black'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-5 cursor-pointer"
            onClick={() => handleNavClick('#home')}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-orangeCustom">
                <Camera className="w-5 h-5 text-black" />
              </div>
            </motion.div>
            <motion.span
              className="text-[30px] font-[400] bg-clip-text text-white"
              whileHover={{ scale: 1.05 }}
            >
              {t('Yeda')}<span className="font-[700] text-orangeCustom">
                {t('Finder')}
              </span>
            </motion.span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-[20px]">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-6 py-2 font-medium transition-all duration-300 flex items-center space-x-2 group ${
                  activeSection === item.id
                    ? 'text-orangeCustom'
                    : 'text-white hover:text-orangeCustom'
                }`}
              >
                <span>{item.name}</span>

                {/* Active indicator */}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute bottom-0 transform w-1/2 h-0.5 bg-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </motion.a>
            ))}
          </div>

          {/* Right side - Language selector and mobile menu button */}
          <div className="flex items-center space-x-4">
            {/* Language Selector - Desktop */}
            <motion.div 
              className="hidden md:block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton 
                onClick={handleClick}
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <Languages />
              </IconButton>
              <Menu2
                anchorEl={anchorEl}
                open={opened}
                onClose={() => handleClosed(null)}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "8px",
                    minWidth: "150px",
                  },
                }}
              >
                {supportedLanguages.map((lang) => (
                  <MenuItem
                    key={lang.code}
                    onClick={() => handleClosed(lang.code)}
                    selected={userLang === lang.code}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "black",
                        color: "white"
                      },
                      "&:hover": {
                        backgroundColor: "#475569",
                      },
                    }}
                  >
                    {t(lang.name)}
                  </MenuItem>
                ))}
              </Menu2>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/20 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className={`w-full text-left flex items-center space-x-3 px-4 py-4 rounded-lg font-medium transition-all duration-300 text-[18px] ${
                    activeSection === item.id
                      ? 'bg-orangeCustom/20 text-orangeCustom border-l-4 border-orangeCustom'
                      : 'text-white hover:text-orangeCustom hover:bg-white/10'
                  }`}
                >
                  <span>{item.name}</span>
                </motion.button>
              ))}

              {/* Language Selector - Mobile */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="px-4 py-4"
              >
                <button
                  onClick={handleClick}
                  className="w-full text-left flex items-center px-4  py-4 rounded-lg font-medium transition-all duration-300 text-[18px] text-white hover:text-orangeCustom hover:bg-white/10"
                >
                  {t('Language')}
                </button>
                <Menu2
                  anchorEl={anchorEl}
                  open={opened}
                  onClose={() => handleClosed(null)}
                  sx={{
                    "& .MuiPaper-root": {
                      backgroundColor: "white",
                      color: "black",
                      borderRadius: "8px",
                      minWidth: "150px",
                    },
                  }}
                >
                  {supportedLanguages.map((lang) => (
                    <MenuItem
                      key={lang.code}
                      onClick={() => handleClosed(lang.code)}
                      selected={userLang === lang.code}
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "black",
                          color: "white"
                        },
                        "&:hover": {
                          backgroundColor: "#475569",
                        },
                      }}
                    >
                      {t(lang.name)}
                    </MenuItem>
                  ))}
                </Menu2>
              </motion.div>

              {/* Mobile CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavClick('#scanner')}
                className="w-full bg-orangeCustom hover:bg-orange-600 text-white px-4 py-4 rounded-lg font-semibold text-[18px] transition-all duration-300 flex items-center justify-center space-x-2 mt-4 shadow-lg shadow-orangeCustom/25"
              >
                <Camera className="w-5 h-5" />
                <span>{t('Start Scanning')}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrolling Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-orangeCustom"
        initial={{ scaleX: 0 }}
        animate={{
          scaleX: isScrolled ? (window.scrollY / (document.body.scrollHeight - window.innerHeight)) : 0
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.nav>
  );
};

export default Navbar;