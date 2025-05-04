import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/Layout';
import { Database } from '../../types/database.types';
import { Save } from 'lucide-react';

type AboutContent = Database['public']['Tables']['about']['Row'];
type AboutContentInsert = Database['public']['Tables']['about']['Insert'];

const AboutAdmin = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<AboutContentInsert>({
    title: '',
    content: '',
    image_url: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        throw error;
      }
      
      if (data) {
        setAboutContent(data);
        setFormData({
          title: data.title,
          content: data.content,
          image_url: data.image_url,
        });
      } else {
        // Set default values
        setFormData({
          title: 'Dr. Sávio do Carmo',
          content: 'Com mais de 15 anos de experiência na área de Oftalmologia, Dr. Sávio do Carmo é especialista em tratamentos avançados para diversas patologias oculares. Formado pela Universidade Federal do Rio de Janeiro (UFRJ), com residência no Hospital Oftalmológico de São Paulo e diversos cursos de especialização no Brasil e exterior.\n\nO Dr. Sávio do Carmo possui vasta experiência em cirurgias de catarata, glaucoma e procedimentos refrativo. Seu compromisso é oferecer o melhor tratamento personalizado, combinando tecnologia de ponta com atendimento humanizado para garantir a saúde ocular e qualidade de vida de seus pacientes.',
          image_url: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
        });
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
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
      if (!formData.title || !formData.content || !formData.image_url) {
        setFormError('Preencha todos os campos obrigatórios.');
        setIsSubmitting(false);
        return;
      }

      if (aboutContent) {
        // Update existing about content
        const { error } = await supabase
          .from('about')
          .update({
            title: formData.title,
            content: formData.content,
            image_url: formData.image_url,
          })
          .eq('id', aboutContent.id);

        if (error) throw error;
      } else {
        // Create new about content
        const { error } = await supabase
          .from('about')
          .insert([formData]);

        if (error) throw error;
      }

      // Refresh about content
      await fetchAboutContent();
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error saving about content:', error);
      setFormError(error.message || 'Ocorreu um erro ao salvar as informações. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Sobre</h1>
        <p className="text-gray-600 mt-1">Edite as informações exibidas na seção "Sobre" do site.</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Informações do médico</h2>
          </div>
          
          <div className="p-6">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                {formError}
              </div>
            )}
            
            {saveSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                Informações atualizadas com sucesso!
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                  Nome do médico <span className="text-red-500">*</span>
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
              
              <div className="mb-6">
                <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
                  Biografia <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Use uma linha em branco para criar parágrafos separados.
                </p>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label htmlFor="image_url" className="block text-gray-700 font-medium mb-2">
                  URL da foto do médico <span className="text-red-500">*</span>
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
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Prévia da foto</h3>
                {formData.image_url ? (
                  <img 
                    src={formData.image_url} 
                    alt={formData.title}
                    className="w-full max-h-80 object-cover rounded-md" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x500?text=Imagem+não+encontrada';
                    }}
                  />
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

export default AboutAdmin;