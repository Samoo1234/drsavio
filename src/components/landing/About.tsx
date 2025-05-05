import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';

type AboutContent = Database['public']['Tables']['about']['Row'];
type Stat = Database['public']['Tables']['stats']['Row'];

const About = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        
        // Fetch about content
        const { data: aboutData, error: aboutError } = await supabase
          .from('about')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (aboutError && aboutError.code !== 'PGRST116') {
          throw aboutError;
        }

        // Fetch stats
        const { data: statsData, error: statsError } = await supabase
          .from('stats')
          .select('*')
          .order('id', { ascending: true });

        if (statsError) {
          throw statsError;
        }

        if (aboutData) {
          setAboutContent(aboutData);
        }

        setStats(statsData || []);
      } catch (error) {
        console.error('Error fetching content:', error);
        // Set default content if anything fails
        setAboutContent({
          id: 1,
          title: 'Dr. Sávio do Carmo',
          content: 'Com mais de 15 anos de experiência na área de Oftalmologia, Dr. Sávio do Carmo é especialista em tratamentos avançados para diversas patologias oculares. Formado pela Universidade Federal do Rio de Janeiro (UFRJ), com residência no Hospital Oftalmológico de São Paulo e diversos cursos de especialização no Brasil e exterior.\n\nO Dr. Sávio do Carmo possui vasta experiência em cirurgias de catarata, glaucoma e procedimentos refrativo. Seu compromisso é oferecer o melhor tratamento personalizado, combinando tecnologia de ponta com atendimento humanizado para garantir a saúde ocular e qualidade de vida de seus pacientes.',
          image_url: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
          created_at: new Date().toISOString()
        });
        setStats([
          { id: 1, title: 'Anos de experiência', value: '15+', created_at: new Date().toISOString() },
          { id: 2, title: 'Pacientes atendidos', value: '5000+', created_at: new Date().toISOString() },
          { id: 3, title: 'Cirurgias realizadas', value: '3000+', created_at: new Date().toISOString() }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image */}
          <motion.div 
            className="w-full lg:w-1/2 mb-10 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <img 
              src={aboutContent?.image_url || 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'} 
              alt="Dr. Sávio do Carmo" 
              className="rounded-lg shadow-lg w-full h-auto object-cover"
              style={{ maxHeight: '600px' }}
            />
          </motion.div>
          
          {/* Content */}
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {aboutContent?.title || 'Dr. Sávio do Carmo'}
            </h2>
            
            <div className="text-gray-600 space-y-4">
              {aboutContent?.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-lg">
                  {paragraph}
                </p>
              )) || (
                <>
                  <p className="text-lg">
                    Com mais de 15 anos de experiência na área de Oftalmologia, Dr. Sávio do Carmo é especialista em tratamentos avançados para diversas patologias oculares. Formado pela Universidade Federal do Rio de Janeiro (UFRJ), com residência no Hospital Oftalmológico de São Paulo e diversos cursos de especialização no Brasil e exterior.
                  </p>
                  <p className="text-lg">
                    O Dr. Sávio do Carmo possui vasta experiência em cirurgias de catarata, glaucoma e procedimentos refrativo. Seu compromisso é oferecer o melhor tratamento personalizado, combinando tecnologia de ponta com atendimento humanizado para garantir a saúde ocular e qualidade de vida de seus pacientes.
                  </p>
                </>
              )}
            </div>
            
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.id} className="bg-blue-50 p-4 rounded-lg text-center">
                  <span className="block text-3xl font-bold text-blue-600">{stat.value}</span>
                  <span className="text-sm text-gray-600">{stat.title}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;