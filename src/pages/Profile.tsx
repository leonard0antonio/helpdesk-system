import { useState, useContext, useRef } from 'react';
import { Camera, Save, User as UserIcon, Mail, Shield, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

export function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profileImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Referência oculta para o input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lida com a seleção da imagem no computador
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus('idle');
    setMessage('');
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Cria uma URL temporária para mostrar o preview na tela antes de enviar
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Cancela a seleção e volta para a foto atual
  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(user?.profileImage || null);
    setStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Envia a imagem para a API (Upload para o Cloudinary)
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setStatus('idle');

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
      
      // Atualiza o contexto (muda a foto na Sidebar automaticamente)
      updateUser({ ...user!, profileImage: updatedUser.profileImage });
      
      setStatus('success');
      setMessage('Imagem atualizada com sucesso!');
      setSelectedFile(null); 
    } catch (error) {
      console.error('Erro no upload:', error);
      setStatus('error');
      setMessage('Erro ao atualizar a imagem. O arquivo pode ser muito grande.');
    } finally {
      setIsUploading(false);
    }
  };

  // Traduz a Role do usuário para exibição
  const getRoleLabel = (role?: string) => {
    if (role === 'ADMIN') return 'Administrador do Sistema';
    if (role === 'TECH') return 'Técnico Especialista';
    return 'Cliente';
  };

  return (
    <div className="max-w-3xl mx-auto mt-4 animate-fade-in-up">
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Cabeçalho */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
              <UserIcon size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-xs text-gray-500 mt-0.5">Gerencie suas informações pessoais e foto de avatar</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 flex flex-col md:flex-row gap-12">
          
          {/* LADO ESQUERDO: Foto e Upload */}
          <div className="flex flex-col items-center">
            <div 
              className="relative group cursor-pointer mb-4" 
              onClick={() => fileInputRef.current?.click()}
            >
              {/* Avatar Area */}
              <div className={`w-40 h-40 rounded-full border-4 ${selectedFile ? 'border-brand-blue border-dashed' : 'border-gray-100'} overflow-hidden bg-gray-50 flex items-center justify-center relative shadow-inner transition-all duration-300`}>
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold text-gray-400 bg-gradient-to-br from-gray-200 to-gray-300 w-full h-full flex items-center justify-center text-transparent bg-clip-text">
                    {user?.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
                
                {/* Overlay Escuro no Hover */}
                <div className="absolute inset-0 bg-brand-dark/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                  <Camera className="text-white mb-2" size={32} />
                  <span className="text-white text-xs font-semibold uppercase tracking-wider">Alterar foto</span>
                </div>
              </div>
            </div>

            {/* Input file invisível */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/jpeg, image/png, image/webp" 
              className="hidden" 
            />

            {/* Status Messages */}
            {status === 'success' && (
              <div className="flex items-center gap-1.5 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full animate-fade-in-up">
                <CheckCircle2 size={16} /> Atualizado
              </div>
            )}
            
            {status === 'error' && (
              <div className="flex flex-col items-center text-center max-w-[200px] animate-fade-in-up">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-full mb-2">
                  <XCircle size={16} /> Falha no upload
                </div>
                <span className="text-xs text-gray-500 leading-tight">{message}</span>
              </div>
            )}

            {/* Botões de Ação de Upload */}
            {selectedFile && (
              <div className="mt-6 flex flex-col w-full gap-2 animate-fade-in-up">
                <button 
                  onClick={handleUpload} 
                  disabled={isUploading}
                  className="flex items-center justify-center gap-2 bg-brand-blue text-white px-4 py-2.5 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-70 w-full"
                >
                  {isUploading ? (
                    <><Loader2 size={18} className="animate-spin" /> Enviando...</>
                  ) : (
                    <><Save size={18} /> Salvar Foto</>
                  )}
                </button>
                <button 
                  onClick={handleCancel} 
                  disabled={isUploading}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-800 py-2 disabled:opacity-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {/* LADO DIREITO: Dados do Usuário */}
          <div className="flex-1 space-y-6">
            <div className="pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Informações Pessoais</h2>
              <p className="text-sm text-gray-500">Seus dados cadastrados na plataforma.</p>
            </div>

            <div className="space-y-5">
              {/* Campo Nome */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome Completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={user?.name} 
                    disabled 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 cursor-not-allowed" 
                  />
                </div>
              </div>
              
              {/* Campo E-mail */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Endereço de E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    value={user?.email} 
                    disabled 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 cursor-not-allowed" 
                  />
                </div>
              </div>
              
              {/* Campo Permissão */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nível de Acesso</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield size={18} className="text-brand-blue" />
                  </div>
                  <input 
                    type="text" 
                    value={getRoleLabel(user?.role)} 
                    disabled 
                    className="w-full pl-10 pr-4 py-2.5 bg-blue-50/50 border border-blue-100 rounded-xl text-sm font-bold text-brand-blue cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}