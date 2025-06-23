import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/Layout';
import { ClipboardList, MessageSquare, Image, User, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    services: 0,
    testimonials: 0,
    heroContent: 0,
    aboutContent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch services count
        const { count: servicesCount, error: servicesError } = await supabase
          .from('services')
          .select('*', { count: 'exact', head: true });
        
        // Fetch testimonials count
        const { count: testimonialsCount, error: testimonialsError } = await supabase
          .from('testimonials')
          .select('*', { count: 'exact', head: true });
        
        // Fetch hero content count
        const { count: heroCount, error: heroError } = await supabase
          .from('hero_content')
          .select('*', { count: 'exact', head: true });
        
        // Fetch about content count
        const { count: aboutCount, error: aboutError } = await supabase
          .from('about')
          .select('*', { count: 'exact', head: true });
        
        if (servicesError || testimonialsError || heroError || aboutError) {
          console.error('Error fetching counts:', { 
            servicesError, 
            testimonialsError, 
            heroError, 
            aboutError 
          });
        } else {
          setCounts({
            services: servicesCount || 0,
            testimonials: testimonialsCount || 0,
            heroContent: heroCount || 0,
            aboutContent: aboutCount || 0,
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bem-vindo ao painel administrativo.</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <ClipboardList className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-800">Serviços</h2>
                  <p className="text-2xl font-bold text-gray-700">{counts.services}</p>
                </div>
              </div>
              <Link 
                to="/admin/services" 
                className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                Gerenciar serviços
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-800">Depoimentos</h2>
                  <p className="text-2xl font-bold text-gray-700">{counts.testimonials}</p>
                </div>
              </div>
              <Link 
                to="/admin/testimonials" 
                className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                Gerenciar depoimentos
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Image className="h-6 w-6 text-purple-500" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-800">Banner</h2>
                  <p className="text-2xl font-bold text-gray-700">{counts.heroContent}</p>
                </div>
              </div>
              <Link 
                to="/admin/hero" 
                className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                Editar banner
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-800">Sobre</h2>
                  <p className="text-2xl font-bold text-gray-700">{counts.aboutContent}</p>
                </div>
              </div>
              <Link 
                to="/admin/about" 
                className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                Editar sobre
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Ações rápidas</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                to="/"
                target="_blank"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="h-6 w-6 text-blue-500 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-800">Visualizar site</h3>
                  <p className="text-sm text-gray-600">Abra o site em uma nova aba</p>
                </div>
              </Link>
              
              <div 
                className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => alert('Esta funcionalidade será implementada em breve.')}
              >
                <Image className="h-6 w-6 text-green-500 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-800">Gerenciar galeria</h3>
                  <p className="text-sm text-gray-600">Adicione ou remova imagens</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Dashboard;