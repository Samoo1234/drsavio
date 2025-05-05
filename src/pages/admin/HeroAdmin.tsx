import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/Layout';
import { Database } from '../../types/database.types';
import { Save } from 'lucide-react';

type HeroContent = Database['public']['Tables']['hero_content']['Row'];
type HeroContentInsert = Database['public']['Tables']['hero_content']['Insert'];

const HeroAdmin = () => {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<HeroContentInsert>({
    title: '',
    subtitle: '',
    image_url: '',
    cta_text: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        throw error;
      }
      
      if (data) {
        setHeroContent(data);
        setFormData({
          title: data.title,
          subtitle: data.subtitle,
          image_url: data.image_url,
          cta_text: data.cta_text,
        });
      } else {
        // Set default values
        setFormData({
          title: 'Cuidados oftalmológicos de excelência',
          subtitle: 'Tratamentos modernos e atendimento humanizado para a saúde dos seus olhos',
          image_url: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
          cta_text: 'Agende sua consulta',
        });
      }
    } catch (error) {
      console.error('Error fetching hero content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSaveSuccess(false);
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.subtitle || !formData.image_url || !formData.cta_text) {
        setFormError('Preencha todos os campos obrigatórios.');
        setIsSubmitting(false);
        return;
      }

      if (heroContent) {
        // Update existing hero content
        const { error } = await supabase
          .from('hero_content')
          .update({
            title: formData.title,
            subtitle: formData.subtitle,
            image_url: formData.image_url,
            cta_text: formData.cta_text,
          })
          .eq('id', heroContent.id);

        if (error) throw error;
      } else {
        // Create new hero content
        const { error } = await supabase
          .from('hero_content')
          .insert([formData]);

        if (error) throw error;
      }

      // Refresh hero content
      await fetchHeroContent();
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error saving hero content:', error);
      setFormError(error.message || 'Ocorreu um erro ao salvar o banner. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Banner Principal</h1>
        <p className="text-gray-600 mt-1">Edite as informações exibidas no banner principal do site.</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Configurações do banner</h2>
          </div>
          
          <div className="p-6">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                {formError}
              </div>
            )}
            
            {saveSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                Banner atualizado com sucesso!
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="cta_text" className="block text-gray-700 font-medium mb-2">
                    Texto do botão <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="cta_text"
                    name="cta_text"
                    value={formData.cta_text}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="subtitle" className="block text-gray-700 font-medium mb-2">
                  Subtítulo <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label htmlFor="image_url" className="block text-gray-700 font-medium mb-2">
                  URL da imagem de fundo <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://exemplo.com/imagem.jpg"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use uma imagem de alta qualidade, com dimensões ideais de pelo menos 1920x1080 pixels.
                </p>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Prévia da imagem</h3>
                {formData.image_url ? (
                  <div className="relative">
                    <img 
                      src={formData.image_url} 
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/800x400?text=Imagem+não+encontrada';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-800/50 rounded-md"></div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h3 className="text-xl font-bold">{formData.title}</h3>
                      <p className="text-sm">{formData.subtitle}</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Nenhuma imagem fornecida</p>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors disabled:bg-blue-300 flex items-center"
              >
                <Save className="h-5 w-5 mr-2" />
                {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default HeroAdmin;