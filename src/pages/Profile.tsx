import { useState, useContext, useRef } from 'react';
import { Camera, Save, User as UserIcon } from 'lucide-react';
import { api } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

export function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profileImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Referência oculta para o input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lida com a seleção da imagem no computador
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Cria uma URL temporária para mostrar o preview na tela antes de enviar
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Envia a imagem para a API (Upload para o Cloudinary)
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setMessage('');

    // FormData é obrigatório para envio de arquivos 'multipart/form-data'
    const formData = new FormData();
    formData.append('avatar', selectedFile); 

    try {
      const response = await api.patch('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // A API devolve o usuário atualizado com a nova URL do Cloudinary
      const updatedUser = response.data.user;
      
      // Atualiza o contexto (isso muda a foto na Sidebar automaticamente)
      updateUser({ ...user!, profileImage: updatedUser.profileImage });
      
      setMessage('Imagem atualizada com sucesso!');
      setSelectedFile(null); // Limpa o estado de seleção
    } catch (error) {
      console.error('Erro no upload:', error);
      console.error("ERRO REAL DO UPLOAD:", error);
      setMessage('Erro ao atualizar a imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-2xl mx-auto mt-8">
      <div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
        <UserIcon size={24} className="text-brand-blue" />
        <h1 className="text-xl font-bold text-brand-blue">Meu Perfil</h1>
      </div>

      <div className="p-8 flex flex-col items-center">
        
        {message && (
          <div className={`mb-6 px-4 py-2 rounded-md text-sm font-medium ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="relative mb-8 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          {/* Avatar Area */}
          <div className="w-32 h-32 rounded-full border-4 border-gray-100 overflow-hidden bg-gray-100 flex items-center justify-center relative shadow-inner">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-gray-400">
                {user?.name.substring(0, 2).toUpperCase()}
              </span>
            )}
            
            {/* Overlay Escuro no Hover */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={32} />
            </div>
          </div>
          <p className="text-xs text-center mt-3 font-medium text-gray-500 hover:text-brand-blue">
            Clique para alterar a foto
          </p>

          {/* Input file invisível */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg, image/png, image/webp" 
            className="hidden" 
          />
        </div>

        {/* Dados do Usuário (Apenas leitura) */}
        <div className="w-full max-w-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">Nome</label>
            <input type="text" value={user?.name} disabled className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">E-mail</label>
            <input type="email" value={user?.email} disabled className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">Nível de Acesso</label>
            <input type="text" value={user?.role} disabled className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed" />
          </div>
        </div>

        {/* Botão de Salvar Upload */}
        {selectedFile && (
          <div className="mt-8 pt-6 border-t border-gray-100 w-full flex justify-center">
            <button 
              onClick={handleUpload} 
              disabled={isUploading}
              className="flex items-center gap-2 bg-brand-blue text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              {isUploading ? 'Enviando...' : 'Salvar Nova Foto'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}