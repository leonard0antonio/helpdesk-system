import { useEffect, useState, useContext } from 'react';
import { Users, Trash2, Mail, Calendar, Search, AlertTriangle, X, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

interface Client {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt: string;
}

export function Clients() {
  const { user } = useContext(AuthContext);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para o Modal de Exclusão Seguro
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Busca os clientes na API
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      alert('Erro ao carregar a lista de clientes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Executa a exclusão de fato
  const executeDelete = async () => {
    if (!clientToDelete) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/admin/clients/${clientToDelete.id}`);
      fetchClients(); // Recarrega a lista
      setClientToDelete(null); // Fecha o modal
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('Erro ao excluir o cliente.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Renderiza a sigla do avatar
  const getInitials = (name?: string) => {
    if (!name) return '--';
    const parts = name.split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Formata a data de cadastro
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Filtra os clientes baseados na barra de busca
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Proteção de Rota Visual
  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Acesso Negado</h2>
        <p className="text-gray-500 mt-2">Apenas administradores podem acessar esta área.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col relative animate-fade-in-up">
      
      {/* ========================================== */}
      {/* CABEÇALHO E BARRA DE BUSCA */}
      {/* ========================================== */}
      <div className="p-6 border-b border-gray-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Gestão de Clientes</h1>
            <p className="text-xs text-gray-500 mt-0.5">Total de {clients.length} clientes cadastrados</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all outline-none"
          />
        </div>
      </div>

      {/* ========================================== */}
      {/* CONTEÚDO PRINCIPAL (Tabela ou Cards) */}
      {/* ========================================== */}
      <div className="flex-1 bg-gray-50/30">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-brand-blue">
            <Loader2 size={32} className="animate-spin mb-4" />
            <span className="text-sm font-medium text-gray-500">Carregando carteira de clientes...</span>
          </div>
        ) : (
          <>
            {/* VISÃO DESKTOP (Tabela) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Cliente</th>
                    <th className="px-6 py-4 font-semibold">E-mail</th>
                    <th className="px-6 py-4 font-semibold">Data de Cadastro</th>
                    <th className="px-6 py-4 text-right font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-gray-500">
                        {searchTerm ? 'Nenhum cliente encontrado para esta busca.' : 'Nenhum cliente cadastrado no sistema.'}
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <tr key={client.id} className="border-b border-gray-100 bg-white hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {client.profileImage ? (
                              <img src={client.profileImage} alt={client.name} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                {getInitials(client.name)}
                              </div>
                            )}
                            <span className="font-semibold text-gray-900">{client.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {client.email}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-gray-400" />
                            {formatDate(client.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            className="p-2 text-gray-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-lg transition-colors border border-transparent group-hover:border-red-100 shadow-sm opacity-0 group-hover:opacity-100"
                            title="Excluir Cliente"
                            onClick={() => setClientToDelete(client)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* VISÃO MOBILE (Cards) */}
            <div className="md:hidden p-4 space-y-4">
              {filteredClients.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
                  {searchTerm ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado.'}
                </div>
              ) : (
                filteredClients.map((client) => (
                  <div key={client.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      {client.profileImage ? (
                        <img src={client.profileImage} alt={client.name} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                          {getInitials(client.name)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-gray-900 leading-tight">
                          {client.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Mail size={12} /> {client.email}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center border border-gray-100">
                      <div className="text-xs text-gray-600 flex items-center gap-1.5 font-medium">
                        <Calendar size={14} className="text-gray-400" /> 
                        {formatDate(client.createdAt)}
                      </div>
                      <button 
                        className="p-2 text-red-500 bg-white hover:bg-red-50 rounded-md border border-red-100 shadow-sm transition-colors"
                        onClick={() => setClientToDelete(client)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO (SaaS Premium) */}
      {/* ========================================== */}
      {clientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            
            {/* Header do Modal */}
            <div className="p-6 pb-0 flex justify-between items-start">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
                <AlertTriangle size={24} />
              </div>
              <button 
                onClick={() => setClientToDelete(null)}
                className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
                disabled={isDeleting}
              >
                <X size={20} />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-6 pt-2">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Excluir cliente?</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Você está prestes a excluir a conta de <strong className="text-gray-800">{clientToDelete.name}</strong>. 
                Isso também apagará permanentemente <strong>todos os chamados</strong> vinculados a este cliente. Esta ação não pode ser desfeita.
              </p>
            </div>

            {/* Rodapé / Ações */}
            <div className="p-6 pt-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
              <button 
                onClick={() => setClientToDelete(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={executeDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm disabled:opacity-70"
              >
                {isDeleting ? (
                  <><Loader2 size={16} className="animate-spin" /> Excluindo...</>
                ) : (
                  <><Trash2 size={16} /> Sim, excluir cliente</>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}