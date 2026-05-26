import { useEffect, useState, useContext } from 'react';
import { Edit, Trash2, Plus, Wrench } from 'lucide-react';
import { api } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

// Tipagem do Serviço
interface Service {
  id: string;
  name: string;
  description: string;
  price: string | number;
  isActive: boolean;
}

export function Services() {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados do Modal e Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  // Campos do form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  // Busca os serviços na API
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      alert('Erro ao carregar a lista de serviços.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Helpers
  const formatCurrency = (value: string | number) => {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Abre o modal para Criar ou Editar
  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setName(service.name);
      setDescription(service.description || '');
      setPrice(service.price.toString());
    } else {
      setEditingService(null);
      setName('');
      setDescription('');
      setPrice('');
    }
    setIsModalOpen(true);
  };

  // Fecha e limpa o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setName('');
    setDescription('');
    setPrice('');
  };

  // Salva (Cria ou Atualiza) o serviço
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Converte o preço com vírgula para número (ex: 150,00 -> 150.00)
    const formattedPrice = Number(price.replace(',', '.'));

    try {
      if (editingService) {
        // Atualiza serviço existente
        await api.put(`/services/${editingService.id}`, {
          name,
          description,
          price: formattedPrice
        });
      } else {
        // Cria novo serviço
        await api.post('/services', {
          name,
          description,
          price: formattedPrice
        });
      }
      
      handleCloseModal();
      fetchServices(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      alert('Ocorreu um erro ao salvar o serviço. Verifique os dados.');
    }
  };

  // Desativa o serviço (Soft Delete)
  const handleDeleteService = async (id: string) => {
    const confirmDelete = window.confirm('Tem certeza que deseja desativar este serviço? Ele não aparecerá em novos chamados.');
    
    if (confirmDelete) {
      try {
        await api.delete(`/services/${id}`);
        fetchServices(); // Recarrega a lista
      } catch (error) {
        console.error('Erro ao desativar serviço:', error);
        alert('Erro ao desativar o serviço.');
      }
    }
  };

  // Trava de segurança no Frontend: Se não for admin, não deveria nem ver a tela (embora a Sidebar e a API já protejam isso)
  if (user?.role !== 'ADMIN') {
    return <div className="p-6 text-red-600 font-medium">Acesso negado. Apenas administradores podem gerenciar serviços.</div>;
  }

  return (
    <div className="relative">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white">
          <div className="flex items-center gap-2 text-xl font-bold text-brand-blue">
            <Wrench size={24} />
            <h1>Gestão de Serviços</h1>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 text-sm bg-brand-dark text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} /> Novo Serviço
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Carregando serviços...</div>
        ) : (
          <>
            {/* ========================================== */}
            {/* VISÃO DESKTOP (Tabela) */}
            {/* ========================================== */}
            <div className="hidden md:block overflow-x-auto p-6">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nome do Serviço</th>
                    <th className="px-4 py-3 font-medium">Descrição</th>
                    <th className="px-4 py-3 font-medium">Valor</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500">Nenhum serviço cadastrado.</td>
                    </tr>
                  ) : (
                    services.map((service) => (
                      <tr key={service.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 font-semibold text-gray-800">
                          {service.name}
                        </td>
                        <td className="px-4 py-4 text-gray-500 max-w-xs truncate" title={service.description}>
                          {service.description || '--'}
                        </td>
                        <td className="px-4 py-4 font-medium text-green-600">
                          {formatCurrency(service.price)}
                        </td>
                        <td className="px-4 py-4 text-right flex justify-end gap-2">
                          <button 
                            onClick={() => handleOpenModal(service)}
                            className="p-2 text-gray-400 hover:text-brand-blue bg-white hover:bg-blue-50 rounded-md transition-colors border border-gray-200"
                            title="Editar Serviço"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteService(service.id)}
                            className="p-2 text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-md transition-colors border border-gray-200"
                            title="Desativar Serviço"
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
              {services.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                  Nenhum serviço cadastrado.
                </div>
              ) : (
                services.map((service) => (
                  <div key={service.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-gray-800 text-sm leading-tight">
                        {service.name}
                      </div>
                      <div className="font-bold text-green-600 text-sm">
                        {formatCurrency(service.price)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                       {service.description || 'Sem descrição.'}
                    </div>
                    
                    <hr className="border-gray-100 my-2" />
                    
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(service)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        <Edit size={14} /> Editar
                      </button>
                      <button 
                        onClick={() => handleDeleteService(service.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                      >
                        <Trash2 size={14} /> Desativar
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
      {/* MODAL DE CRIAÇÃO / EDIÇÃO */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-brand-blue">
                {editingService ? 'Editar Serviço' : 'Novo Serviço'}
              </h2>
            </div>
            
            <form onSubmit={handleSaveService} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Nome do Serviço</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ex: Formatação de Computador"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Descrição</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Detalhes sobre o serviço..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand-blue focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Valor (R$)</label>
                <input 
                  type="text" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="150,00"
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
                  {editingService ? 'Salvar Alterações' : 'Cadastrar Serviço'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}