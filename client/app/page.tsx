import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import FoodScanner from './components/FoodScanner';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <About />
      <FoodScanner />
       <Footer />
    </main>
  );
}