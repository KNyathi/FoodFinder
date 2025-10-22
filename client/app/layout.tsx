import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Montserrat",
  display: "swap",
});


export const metadata: Metadata = {
  title: 'YedaFinder - Discover Amazing Food',
  description: 'Find food by taking pictures and discover local restaurants',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={` ${montserrat.variable} bg-black`}>{children}</body>
    </html>
  )
}