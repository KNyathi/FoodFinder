import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    localeDetection: false, // Disable automatic detection
  },
};

export default nextConfig;
