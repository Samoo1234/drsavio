import { useState, useEffect } from 'react';
import { Menu, X, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };
  
  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Eye 
              className={`h-8 w-8 ${scrolled ? 'text-blue-500' : 'text-blue-500'}`} 
            />
            <span 
              className={`ml-2 text-xl font-bold ${
                scrolled ? 'text-gray-800' : 'text-gray-800'
              }`}
            >
              Dr. Sávio do Carmo
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#home" 
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-gray-700 hover:text-blue-500' : 'text-gray-800 hover:text-blue-600'
              }`}
            >
              Início
            </a>
            <a 
              href="#services" 
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-gray-700 hover:text-blue-500' : 'text-gray-800 hover:text-blue-600'
              }`}
            >
              Serviços
            </a>
            <a 
              href="#about" 
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-gray-700 hover:text-blue-500' : 'text-gray-800 hover:text-blue-600'
              }`}
            >
              Sobre
            </a>
            <a 
              href="#testimonials" 
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-gray-700 hover:text-blue-500' : 'text-gray-800 hover:text-blue-600'
              }`}
            >
              Depoimentos
            </a>
            <a 
              href="#contact" 
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-gray-700 hover:text-blue-500' : 'text-gray-800 hover:text-blue-600'
              }`}
            >
              Contato
            </a>
            <button 
              onClick={scrollToContact}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Agende sua consulta
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-800 hover:text-blue-500 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          className="md:hidden bg-white"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 pt-2 pb-4 space-y-3">
            <a 
              href="#home" 
              className="block text-gray-700 hover:text-blue-500 font-medium"
              onClick={toggleMenu}
            >
              Início
            </a>
            <a 
              href="#services" 
              className="block text-gray-700 hover:text-blue-500 font-medium"
              onClick={toggleMenu}
            >
              Serviços
            </a>
            <a 
              href="#about" 
              className="block text-gray-700 hover:text-blue-500 font-medium"
              onClick={toggleMenu}
            >
              Sobre
            </a>
            <a 
              href="#testimonials" 
              className="block text-gray-700 hover:text-blue-500 font-medium"
              onClick={toggleMenu}
            >
              Depoimentos
            </a>
            <a 
              href="#contact" 
              className="block text-gray-700 hover:text-blue-500 font-medium"
              onClick={toggleMenu}
            >
              Contato
            </a>
            <button 
              onClick={scrollToContact}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Agende sua consulta
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;