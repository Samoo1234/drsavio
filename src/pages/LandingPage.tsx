import { useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Services from '../components/landing/Services';
import About from '../components/landing/About';
import Testimonials from '../components/landing/Testimonials';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  useEffect(() => {
    document.title = 'Dr. Sávio do Carmo - Oftalmologia de Excelência';
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;