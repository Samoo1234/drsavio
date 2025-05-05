import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/Layout';
import { Database } from '../../types/database.types';
import { Save } from 'lucide-react';

type ContactInfo = Database['public']['Tables']['contact_info']['Row'];
type ContactInfoInsert = Database['public']['Tables']['contact_info']['Insert'];

const ContactInfoAdmin = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ContactInfoInsert>({
    address: '',
    phone1: '',
    phone2: '',
    email: '',
    business_hours: '',
    saturday_hours: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setContactInfo(data);
        setFormData({
          address: data.address,
          phone1: data.phone1,
          phone2: data.phone2,
          email: data.email,
          business_hours: data.business_hours,
          saturday_hours: data.saturday_hours,
        });
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
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
      if (!formData.address || !formData.phone1 || !formData.email || !formData.business_hours || !formData.saturday_hours) {
        setFormError('Preencha todos os campos obrigatórios.');
        setIsSubmitting(false);
        return;
      }

      if (contactInfo) {
        const { error } = await supabase
          .from('contact_info')
          .update(formData)
          .eq('id', contactInfo.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('contact_info')
          .insert([formData]);

        if (error) throw error;
      }

      await fetchContactInfo();
      setSaveSuccess(true);
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error saving contact info:', error);
      setFormError(error.message || 'Ocorreu um erro ao salvar as informações. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Informações de Contato</h1>
        <p className="text-gray-600 mt-1">Gerencie as informações de contato exibidas no site.</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Editar informações</h2>
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
                <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
                  Endereço completo <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="phone1" className="block text-gray-700 font-medium mb-2">
                    Telefone principal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="phone1"
                    name="phone1"
                    value={formData.phone1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone2" className="block text-gray-700 font-medium mb-2">
                    Telefone secundário
                  </label>
                  <input
                    type="text"
                    id="phone2"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="business_hours" className="block text-gray-700 font-medium mb-2">
                    Horário comercial <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="business_hours"
                    name="business_hours"
                    value={formData.business_hours}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="saturday_hours" className="block text-gray-700 font-medium mb-2">
                    Horário de sábado <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="saturday_hours"
                    name="saturday_hours"
                    value={formData.saturday_hours}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
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

export default ContactInfoAdmin;