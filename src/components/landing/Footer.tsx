import { useState, useEffect } from 'react';
import { Eye, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';

type ContactInfo = Database['public']['Tables']['contact_info']['Row'];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_info')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) throw error;
        setContactInfo(data);
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };

    fetchContactInfo();
  }, []);
  
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <div className="flex items-center mb-4">
              <Eye className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">Dr. Sávio do Carmo</span>
            </div>
            <p className="text-gray-300 mb-4">
              Cuidados oftalmológicos de excelência com tecnologia avançada e tratamento humanizado.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-300 hover:text-blue-400 transition-colors">Início</a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-blue-400 transition-colors">Serviços</a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors">Sobre</a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-300 hover:text-blue-400 transition-colors">Depoimentos</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors">Contato</a>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Exames de vista</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Cirurgia de catarata</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Tratamento de glaucoma</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Oftalmopediatria</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Cirurgia refrativa</a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <address className="not-italic text-gray-300 space-y-2">
              {contactInfo?.address.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
              <p className="mt-4">{contactInfo?.phone1}</p>
              {contactInfo?.phone2 && <p>{contactInfo.phone2}</p>}
              <p>{contactInfo?.email}</p>
              <p className="mt-4">{contactInfo?.business_hours}</p>
              <p>{contactInfo?.saturday_hours}</p>
            </address>
          </div>
        </div>
        
        <hr className="border-gray-700 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Clínica Oftalmológica Dr. Sávio do Carmo. Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a 
              href="/admin/login" 
              className="text-gray-400 hover:text-blue-400 transition-colors"
              title="Área administrativa"
            >
              <Lock className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;