import { useEffect, useState, useContext } from 'react';
import { Users, Trash2, Mail, Calendar } from 'lucide-react';
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

  // Exclui um cliente (e seus chamados em cascata)
  const handleDeleteClient = async (id: string, name: string) => {
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir o cliente ${name}? ATENÇÃO: Todos os chamados vinculados a ele serão excluídos permanentemente.`);
    
    if (confirmDelete) {
      try {
        await api.delete(`/admin/clients/${id}`);
        fetchClients(); // Recarrega a lista
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        alert('Erro ao excluir o cliente.');
      }
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

  // Proteção de Rota Visual
  if (user?.role !== 'ADMIN') {
    return <div className="p-6 text-red-600 font-medium">Acesso negado. Apenas administradores podem acessar esta área.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
      
      {/* Cabeçalho */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-white">
        <Users size={24} className="text-brand-blue" />
        <h1 className="text-xl font-bold text-brand-blue">Gestão de Clientes</h1>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-gray-500">Carregando lista de clientes...</div>
      ) : (
        <>
          {/* ========================================== */}
          {/* VISÃO DESKTOP (Tabela) */}
          {/* ========================================== */}
          <div className="hidden md:block overflow-x-auto p-6">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">E-mail</th>
                  <th className="px-4 py-3 font-medium">Data de Cadastro</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">Nenhum cliente cadastrado no sistema.</td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {client.profileImage ? (
                            <img src={client.profileImage} alt={client.name} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center text-xs font-bold border border-blue-200">
                              {getInitials(client.name)}
                            </div>
                          )}
                          <span className="font-semibold text-gray-800">{client.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-500">
                        {client.email}
                      </td>
                      <td className="px-4 py-4 text-gray-500">
                        {formatDate(client.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button 
                          className="p-2 text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-md transition-colors border border-gray-200"
                          title="Excluir Cliente e seus Chamados"
                          onClick={() => handleDeleteClient(client.id, client.name)}
                        >
                          <Trash2 size={16} />
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
            {clients.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                Nenhum cliente cadastrado.
              </div>
            ) : (
              clients.map((client) => (
                <div key={client.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    {client.profileImage ? (
                      <img src={client.profileImage} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center text-sm font-bold">
                        {getInitials(client.name)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-800 text-sm leading-tight">
                        {client.name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Mail size={12} /> {client.email}
                      </div>
                    </div>
                  </div>
                  
                  <hr className="border-gray-100" />
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} /> Cadastrado em {formatDate(client.createdAt)}
                    </div>
                    <button 
                      className="p-1.5 text-gray-400 hover:text-red-500 bg-gray-50 rounded-md border border-gray-100"
                      onClick={() => handleDeleteClient(client.id, client.name)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}