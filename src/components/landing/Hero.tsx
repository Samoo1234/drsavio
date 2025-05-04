import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';

type HeroContent = Database['public']['Tables']['hero_content']['Row'];

const Hero = () => {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_content')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) {
          console.error('Error fetching hero content:', error);
          // Set default content if DB fetch fails
          setHeroContent({
            id: 1,
            title: 'Cuidados oftalmológicos de excelência',
            subtitle: 'Tratamentos modernos e atendimento humanizado para a saúde dos seus olhos',
            image_url: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
            cta_text: 'Agende sua consulta',
            created_at: new Date().toISOString()
          });
        } else {
          setHeroContent(data);
        }
      } catch (error) {
        console.error('Error:', error);
        // Set default content if anything fails
        setHeroContent({
          id: 1,
          title: 'Cuidados oftalmológicos de excelência',
          subtitle: 'Tratamentos modernos e atendimento humanizado para a saúde dos seus olhos',
          image_url: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
          cta_text: 'Agende sua consulta',
          created_at: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroContent?.image_url || 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'})`,
          filter: 'brightness(0.85)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-800/50"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {heroContent?.title || 'Cuidados oftalmológicos de excelência'}
          </motion.h1>
          
          <motion.p 
            className="text-xl text-blue-50 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {heroContent?.subtitle || 'Tratamentos modernos e atendimento humanizado para a saúde dos seus olhos'}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <a 
              href="#contact" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-md inline-flex items-center transition-all duration-300 transform hover:scale-105"
            >
              {heroContent?.cta_text || 'Agende sua consulta'}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;