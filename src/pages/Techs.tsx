import { useEffect, useState, useContext } from 'react';
import { Plus, Users, Edit, Mail, Clock } from 'lucide-react';
import { api } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

// Tipagem do Técnico
interface Tech {
  id: string;
  name: string;
  email: string;
  availableHours: string[];
  profileImage?: string;
}

export function Techs() {
  const { user } = useContext(AuthContext);
  const [techs, setTechs] = useState<Tech[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Tech | null>(null); // Guarda o técnico que está sendo editado
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Senha provisória
  const [error, setError] = useState('');

  // Busca os técnicos na API
  const fetchTechs = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/techs');
      setTechs(response.data);
    } catch (error) {
      console.error('Erro ao buscar técnicos:', error);
      alert('Erro ao carregar a lista de técnicos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTechs();
  }, []);

  // Abre o modal para Criar OU Editar
  const handleOpenModal = (tech?: Tech) => {
    setError('');
    if (tech) {
      // MODO EDIÇÃO: Preenche os campos com os dados do técnico
      setEditingTech(tech);
      setName(tech.name);
      setEmail(tech.email);
      setPassword(''); // Deixa em branco. Só enviaremos se o admin quiser mudar.
    } else {
      // MODO CRIAÇÃO: Limpa os campos
      setEditingTech(null);
      setName('');
      setEmail('');
      setPassword('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTech(null);
  };

  // Salva (Cria ou Atualiza) o técnico
  const handleSaveTech = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (editingTech) {
        // Fluxo de EDIÇÃO (PUT)
        const updateData: any = { name, email };
        if (password) updateData.password = password; // Só envia a senha se foi preenchida

        await api.put(`/admin/techs/${editingTech.id}`, updateData);
      } else {
        // Fluxo de CRIAÇÃO (POST)
        await api.post('/admin/techs', { name, email, password });
      }
      
      handleCloseModal();
      fetchTechs(); // Recarrega a lista
    } catch (err: any) {
      console.error('Erro ao salvar técnico:', err);
      setError(err.response?.data?.error || 'Erro ao processar a requisição. Verifique os dados.');
    }
  };

  // Renderiza a sigla do avatar
  const getInitials = (name?: string) => {
    if (!name) return '--';
    const parts = name.split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Proteção de Rota Visual
  if (user?.role !== 'ADMIN') {
    return <div className="p-6 text-red-600 font-medium">Acesso negado. Apenas administradores podem gerenciar técnicos.</div>;
  }

  return (
    <div className="relative">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white">
          <div className="flex items-center gap-2 text-xl font-bold text-brand-blue">
            <Users size={24} />
            <h1>Técnicos</h1>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 text-sm bg-brand-dark text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} /> Novo Técnico
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Carregando equipe técnica...</div>
        ) : (
          <>
            {/* ========================================== */}
            {/* VISÃO DESKTOP (Tabela) */}
            {/* ========================================== */}
            <div className="hidden md:block overflow-x-auto p-6">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 font-medium">Técnico</th>
                    <th className="px-4 py-3 font-medium">E-mail</th>
                    <th className="px-4 py-3 font-medium">Disponibilidade Padrão</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {techs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500">Nenhum técnico cadastrado.</td>
                    </tr>
                  ) : (
                    techs.map((tech) => (
                      <tr key={tech.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {tech.profileImage ? (
                              <img src={tech.profileImage} alt={tech.name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                                {getInitials(tech.name)}
                              </div>
                            )}
                            <span className="font-semibold text-gray-800">{tech.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-500">
                          {tech.email}
                        </td>
                        <td className="px-4 py-4">
                           <div className="flex flex-wrap gap-1">
                             {tech.availableHours.length > 0 ? (
                               <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">
                                 Das {tech.availableHours[0]} às {tech.availableHours[tech.availableHours.length - 1]}
                               </span>
                             ) : (
                               <span className="text-gray-400">Não definida</span>
                             )}
                           </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button 
                            className="p-2 text-gray-400 hover:text-brand-blue bg-white hover:bg-blue-50 rounded-md transition-colors border border-gray-200"
                            title="Editar Técnico"
                            onClick={() => handleOpenModal(tech)}
                          >
                            <Edit size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ========================================== */}
            {/* VISÃO MOBILE (Cards) */}
            {/* ========================================== */}
            <div className="md:hidden p-4 space-y-4 bg-gray-50">
              {techs.map((tech) => (
                <div key={tech.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    {tech.profileImage ? (
                      <img src={tech.profileImage} alt={tech.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                        {getInitials(tech.name)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-800 text-sm leading-tight">
                        {tech.name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Mail size={12} /> {tech.email}
                      </div>
                    </div>
                  </div>
                  
                  <hr className="border-gray-100" />
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} /> 
                      {tech.availableHours.length > 0 ? (
                          `Das ${tech.availableHours[0]} às ${tech.availableHours[tech.availableHours.length - 1]}`
                        ) : 'Não definida'}
                    </div>
                    <button 
                      className="p-1.5 text-gray-400 hover:text-brand-blue bg-gray-50 rounded-md border border-gray-100"
                      onClick={() => handleOpenModal(tech)}
                    >
                      <Edit size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL DE CRIAÇÃO / EDIÇÃO */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-brand-blue">
                {editingTech ? 'Editar Técnico' : 'Novo Técnico'}
              </h2>
              {!editingTech && (
                <p className="text-xs text-gray-500 mt-1">Os horários de atendimento padrão (08h-18h) serão atribuídos automaticamente.</p>
              )}
            </div>
            
            <form onSubmit={handleSaveTech} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-md border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ex: Carlos Silva"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">E-mail</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tecnico@helpdesk.com"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  {editingTech ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha Provisória'}
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editingTech} // Senha é obrigatória só na criação
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-blue hover:bg-blue-800 rounded-md transition-colors"
                >
                  {editingTech ? 'Salvar Alterações' : 'Cadastrar Técnico'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}