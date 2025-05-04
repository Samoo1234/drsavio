import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/Layout';
import { Database } from '../../types/database.types';
import { Edit, Trash2, Plus, Eye, Glasses, Shield, BarChart } from 'lucide-react';

type Service = Database['public']['Tables']['services']['Row'];
type ServiceInsert = Database['public']['Tables']['services']['Insert'];

const iconOptions = [
  { id: 'eye', name: 'Olho', component: <Eye className="h-5 w-5" /> },
  { id: 'glasses', name: 'Óculos', component: <Glasses className="h-5 w-5" /> },
  { id: 'shield', name: 'Escudo', component: <Shield className="h-5 w-5" /> },
  { id: 'bar-chart', name: 'Gráfico', component: <BarChart className="h-5 w-5" /> },
];

const ServicesAdmin = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceInsert>({
    title: '',
    description: '',
    icon: 'eye',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: 'eye',
    });
    setEditingService(null);
    setIsCreating(false);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.description) {
        setFormError('Preencha todos os campos obrigatórios.');
        return;
      }

      if (editingService) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update({
            title: formData.title,
            description: formData.description,
            icon: formData.icon,
          })
          .eq('id', editingService.id);

        if (error) throw error;
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert([formData]);

        if (error) throw error;
      }

      // Refresh services list
      await fetchServices();
      resetForm();
    } catch (error: any) {
      console.error('Error saving service:', error);
      setFormError(error.message || 'Ocorreu um erro ao salvar o serviço. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
    
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh services list
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Erro ao excluir o serviço. Tente novamente.');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Serviços</h1>
          <p className="text-gray-600 mt-1">Gerencie os serviços exibidos no site.</p>
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
              Novo serviço
            </>
          )}
        </button>
      </div>
      
      {isCreating && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingService ? 'Editar serviço' : 'Adicionar novo serviço'}
          </h2>
          
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {formError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
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
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Descrição <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label htmlFor="icon" className="block text-gray-700 font-medium mb-2">
                Ícone <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {iconOptions.map((icon) => (
                  <div 
                    key={icon.id}
                    onClick={() => setFormData(prev => ({ ...prev, icon: icon.id }))}
                    className={`flex items-center p-3 border rounded-md cursor-pointer ${
                      formData.icon === icon.id 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="mr-3">{icon.component}</div>
                    <span>{icon.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors disabled:bg-blue-300"
              >
                {isSubmitting ? 'Salvando...' : editingService ? 'Atualizar serviço' : 'Adicionar serviço'}
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
          <h2 className="text-lg font-semibold text-gray-800">Lista de serviços</h2>
        </div>
        
        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Nenhum serviço cadastrado. Clique em "Novo serviço" para adicionar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ícone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="bg-blue-100 p-2 rounded-full inline-flex">
                        {iconOptions.find(i => i.id === service.icon)?.component || <Eye className="h-5 w-5 text-blue-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{service.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-md truncate">{service.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
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

export default ServicesAdmin;