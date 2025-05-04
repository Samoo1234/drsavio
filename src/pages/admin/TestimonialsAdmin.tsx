import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/Layout';
import { Database } from '../../types/database.types';
import { Edit, Trash2, Plus, Star } from 'lucide-react';

type Testimonial = Database['public']['Tables']['testimonials']['Row'];
type TestimonialInsert = Database['public']['Tables']['testimonials']['Insert'];

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<TestimonialInsert>({
    name: '',
    testimonial: '',
    rating: 5,
    avatar_url: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'rating' ? parseInt(value, 10) : value 
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      testimonial: '',
      rating: 5,
      avatar_url: '',
    });
    setEditingTestimonial(null);
    setIsCreating(false);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      if (!formData.name || !formData.testimonial) {
        setFormError('Preencha todos os campos obrigatórios.');
        setIsSubmitting(false);
        return;
      }

      if (editingTestimonial) {
        // Update existing testimonial
        const { error } = await supabase
          .from('testimonials')
          .update({
            name: formData.name,
            testimonial: formData.testimonial,
            rating: formData.rating,
            avatar_url: formData.avatar_url,
          })
          .eq('id', editingTestimonial.id);

        if (error) throw error;
      } else {
        // Create new testimonial
        const { error } = await supabase
          .from('testimonials')
          .insert([formData]);

        if (error) throw error;
      }

      // Refresh testimonials list
      await fetchTestimonials();
      resetForm();
    } catch (error: any) {
      console.error('Error saving testimonial:', error);
      setFormError(error.message || 'Ocorreu um erro ao salvar o depoimento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      testimonial: testimonial.testimonial,
      rating: testimonial.rating,
      avatar_url: testimonial.avatar_url || '',
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este depoimento?')) return;
    
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh testimonials list
      await fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Erro ao excluir o depoimento. Tente novamente.');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Depoimentos</h1>
          <p className="text-gray-600 mt-1">Gerencie os depoimentos exibidos no site.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          {isCreating ? (
            'Cancelar'
          ) : (
            <>
              <Plus className="h-5 w-5 mr-1" />
              Novo depoimento
            </>
          )}
        </button>
      </div>
      
      {isCreating && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingTestimonial ? 'Editar depoimento' : 'Adicionar novo depoimento'}
          </h2>
          
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {formError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="testimonial" className="block text-gray-700 font-medium mb-2">
                Depoimento <span className="text-red-500">*</span>
              </label>
              <textarea
                id="testimonial"
                name="testimonial"
                value={formData.testimonial}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label htmlFor="rating" className="block text-gray-700 font-medium mb-2">
                Avaliação <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`h-6 w-6 ${
                        star <= formData.rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  </button>
                ))}
                <span className="ml-2 text-gray-600">{formData.rating} de 5</span>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="avatar_url" className="block text-gray-700 font-medium mb-2">
                URL da Foto (opcional)
              </label>
              <input
                type="url"
                id="avatar_url"
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://exemplo.com/imagem.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                Deixe em branco para usar um avatar gerado automaticamente.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors disabled:bg-blue-300"
              >
                {isSubmitting ? 'Salvando...' : editingTestimonial ? 'Atualizar depoimento' : 'Adicionar depoimento'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Lista de depoimentos</h2>
        </div>
        
        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Nenhum depoimento cadastrado. Clique em "Novo depoimento" para adicionar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Depoimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avaliação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={testimonial.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=3B82F6&color=fff`} 
                            alt={testimonial.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-md truncate">{testimonial.testimonial}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex">
                        {[...Array(5)].map((_, index) => (
                          <Star 
                            key={index}
                            className={`h-4 w-4 ${
                              index < testimonial.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(testimonial.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(testimonial)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TestimonialsAdmin;