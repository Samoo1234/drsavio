import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';

type Testimonial = Database['public']['Tables']['testimonials']['Row'];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) {
          console.error('Error fetching testimonials:', error);
          // Set default testimonials if DB fetch fails
          setTestimonials([
            {
              id: 1,
              name: 'Mariana Santos',
              testimonial: 'Minha experiência com o Dr. Sávio foi excelente! Ele é muito atencioso, explica tudo detalhadamente e o tratamento que recebi para meu glaucoma está funcionando perfeitamente.',
              rating: 5,
              avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              created_at: new Date().toISOString()
            },
            {
              id: 2,
              name: 'Carlos Oliveira',
              testimonial: 'Realizei cirurgia de catarata com o Dr. Sávio e fiquei impressionado com a qualidade do atendimento e o resultado. Minha visão melhorou significativamente logo nos primeiros dias após o procedimento.',
              rating: 5,
              avatar_url: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              created_at: new Date().toISOString()
            },
            {
              id: 3,
              name: 'Isabela Martins',
              testimonial: 'Levo minha filha de 7 anos ao Dr. Sávio há 3 anos. Ele tem um jeito especial com crianças e consegue fazer os exames de forma tranquila. Recomendo a todos os pais!',
              rating: 5,
              avatar_url: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              created_at: new Date().toISOString()
            }
          ]);
        } else {
          setTestimonials(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
        // Set default testimonials if anything fails
        setTestimonials([
          {
            id: 1,
            name: 'Mariana Santos',
            testimonial: 'Minha experiência com o Dr. Sávio foi excelente! Ele é muito atencioso, explica tudo detalhadamente e o tratamento que recebi para meu glaucoma está funcionando perfeitamente.',
            rating: 5,
            avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            name: 'Carlos Oliveira',
            testimonial: 'Realizei cirurgia de catarata com o Dr. Sávio e fiquei impressionado com a qualidade do atendimento e o resultado. Minha visão melhorou significativamente logo nos primeiros dias após o procedimento.',
            rating: 5,
            avatar_url: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            created_at: new Date().toISOString()
          },
          {
            id: 3,
            name: 'Isabela Martins',
            testimonial: 'Levo minha filha de 7 anos ao Dr. Sávio há 3 anos. Ele tem um jeito especial com crianças e consegue fazer os exames de forma tranquila. Recomendo a todos os pais!',
            rating: 5,
            avatar_url: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            created_at: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section id="testimonials" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            O que nossos pacientes dizem
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Conheça os depoimentos de quem já passou por nossos cuidados
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=3B82F6&color=fff`} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{testimonial.name}</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.testimonial}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;