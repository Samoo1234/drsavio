import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/Layout';
import { Upload, Image, Copy, Trash2, Check } from 'lucide-react';

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, unknown>;
}

const MediaAdmin = () => {
  const [images, setImages] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string>('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from('drsaviofotos')
        .list('', {
          limit: 100,
          offset: 0,
        });

      if (error) throw error;
      
      // Filtrar apenas imagens
      const imageFiles = data?.filter(file => 
        file.metadata?.mimetype?.startsWith('image/')
      ) || [];
      
      setImages(imageFiles);
    } catch (error: unknown) {
      console.error('Error fetching images:', error);
      setFormError('Erro ao carregar as imagens. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setFormError('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError('A imagem deve ter no máximo 5MB.');
      return;
    }

    setUploading(true);
    setFormError('');

    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('drsaviofotos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Atualizar lista de imagens
      await fetchImages();
      setSuccessMessage('Imagem enviada com sucesso!');
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error: any) {
      console.error('Error uploading file:', error);
      setFormError(error.message || 'Erro ao enviar a imagem. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from('drsaviofotos')
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    
    // Limpar indicador de copiado após 2 segundos
    setTimeout(() => {
      setCopiedUrl('');
    }, 2000);
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;

    try {
      const { error } = await supabase.storage
        .from('drsaviofotos')
        .remove([fileName]);

      if (error) throw error;

      // Atualizar lista de imagens
      await fetchImages();
      setSuccessMessage('Imagem excluída com sucesso!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error: any) {
      console.error('Error deleting image:', error);
      setFormError('Erro ao excluir a imagem. Tente novamente.');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Galeria de Imagens</h1>
          <p className="text-gray-600 mt-1">Gerencie as imagens utilizadas no site.</p>
        </div>
        <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors cursor-pointer">
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Enviando...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 mr-2" />
              Upload de Imagem
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {formError}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Suas Imagens</h2>
          <p className="text-sm text-gray-600">Clique em "Copiar URL" para usar nos formulários</p>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Image className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma imagem encontrada.</p>
            <p className="text-sm">Faça upload da primeira imagem para começar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {images.map((image) => {
              const publicUrl = getPublicUrl(image.name);
              const isCopied = copiedUrl === publicUrl;
              
              return (
                <div key={image.name} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={publicUrl}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 text-sm mb-2 truncate">
                      {image.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      {image.metadata && typeof image.metadata.size === 'number' 
                        ? (image.metadata.size / 1024).toFixed(1) + ' KB'
                        : 'Tamanho desconhecido'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(publicUrl)}
                        className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                          isCopied 
                            ? 'bg-green-500 text-white' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-4 w-4 inline mr-1" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 inline mr-1" />
                            Copiar URL
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(image.name)}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MediaAdmin; 