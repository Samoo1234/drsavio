import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';
import { Eye, Glasses, Shield, BarChart } from 'lucide-react';

type Service = Database['public']['Tables']['services']['Row'];

const iconMap: Record<string, React.ReactNode> = {
  'eye': <Eye className="h-12 w-12 text-blue-500" />,
  'glasses': <Glasses className="h-12 w-12 text-blue-500" />,
  'shield': <Shield className="h-12 w-12 text-blue-500" />,
  'bar-chart': <BarChart className="h-12 w-12 text-blue-500" />,
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('id', { ascending: true });
        
        if (error) {
          console.error('Error fetching services:', error);
          // Set default services if DB fetch fails
          setServices([
            {
              id: 1,
              title: 'Exames de vista',
              description: 'Avaliação completa da saúde ocular e diagnóstico preciso utilizando equipamentos de última geração.',
              icon: 'eye',
              created_at: new Date().toISOString()
            },
            {
              id: 2,
              title: 'Tratamento de glaucoma',
              description: 'Acompanhamento especializado e tratamentos avançados para controle eficaz do glaucoma.',
              icon: 'shield',
              created_at: new Date().toISOString()
            },
            {
              id: 3,
              title: 'Cirurgia de catarata',
              description: 'Procedimentos cirúrgicos modernos com técnicas minimamente invasivas e rápida recuperação.',
              icon: 'glasses',
              created_at: new Date().toISOString()
            },
            {
              id: 4,
              title: 'Oftalmopediatria',
              description: 'Cuidados específicos para a saúde ocular de crianças em ambiente acolhedor e adaptado.',
              icon: 'bar-chart',
              created_at: new Date().toISOString()
            }
          ]);
        } else {
          setServices(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
        // Set default services if anything fails
        setServices([
          {
            id: 1,
            title: 'Exames de vista',
            description: 'Avaliação completa da saúde ocular e diagnóstico preciso utilizando equipamentos de última geração.',
            icon: 'eye',
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            title: 'Tratamento de glaucoma',
            description: 'Acompanhamento especializado e tratamentos avançados para controle eficaz do glaucoma.',
            icon: 'shield',
            created_at: new Date().toISOString()
          },
          {
            id: 3,
            title: 'Cirurgia de catarata',
            description: 'Procedimentos cirúrgicos modernos com técnicas minimamente invasivas e rápida recuperação.',
            icon: 'glasses',
            created_at: new Date().toISOString()
          },
          {
            id: 4,
            title: 'Oftalmopediatria',
            description: 'Cuidados específicos para a saúde ocular de crianças em ambiente acolhedor e adaptado.',
            icon: 'bar-chart',
            created_at: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section id="services" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Nossos Serviços
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Oferecemos tratamentos de alta qualidade para cuidar da saúde dos seus olhos
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="mb-4">
                {iconMap[service.icon] || <Eye className="h-12 w-12 text-blue-500" />}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;