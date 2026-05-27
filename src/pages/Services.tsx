import { useEffect, useState, useContext } from 'react';
import { Edit, Trash2, Plus, Wrench, Search, AlertTriangle, X, Loader2, Tag, FileText, DollarSign } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');

  // Estados do Modal de Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados do Modal de Exclusão
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
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
      // Converte ponto para vírgula para edição no padrão BR
      setPrice(service.price.toString().replace('.', ','));
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
    setIsSaving(true);
    
    // Converte o preço com vírgula para número (ex: 150,00 -> 150.00)
    const formattedPrice = Number(price.replace(',', '.'));

    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}`, {
          name,
          description,
          price: formattedPrice
        });
      } else {
        await api.post('/services', {
          name,
          description,
          price: formattedPrice
        });
      }
      
      handleCloseModal();
      fetchServices();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      alert('Ocorreu um erro ao salvar o serviço. Verifique os dados.');
    } finally {
      setIsSaving(false);
    }
  };

  // Executa a desativação (Soft Delete)
  const executeDelete = async () => {
    if (!serviceToDelete) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/services/${serviceToDelete.id}`);
      fetchServices();
      setServiceToDelete(null);
    } catch (error) {
      console.error('Erro ao desativar serviço:', error);
      alert('Erro ao desativar o serviço.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtra os serviços baseados na barra de busca
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Proteção Visual para não-admins
  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Acesso Negado</h2>
        <p className="text-gray-500 mt-2">Apenas administradores podem acessar o catálogo de serviços.</p>
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
            <Wrench size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Catálogo de Serviços</h1>
            <p className="text-xs text-gray-500 mt-0.5">{services.length} serviços disponíveis</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Buscar serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all outline-none"
            />
          </div>

          {/* Botão Novo */}
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 text-sm font-bold bg-brand-dark text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus size={16} /> Novo Serviço
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* CONTEÚDO PRINCIPAL (Tabela ou Cards) */}
      {/* ========================================== */}
      <div className="flex-1 bg-gray-50/30">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-brand-blue">
            <Loader2 size={32} className="animate-spin mb-4" />
            <span className="text-sm font-medium text-gray-500">Carregando serviços...</span>
          </div>
        ) : (
          <>
            {/* VISÃO DESKTOP (Tabela) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Nome do Serviço</th>
                    <th className="px-6 py-4 font-semibold">Descrição</th>
                    <th className="px-6 py-4 font-semibold">Valor Base</th>
                    <th className="px-6 py-4 text-right font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-gray-500">
                        {searchTerm ? 'Nenhum serviço encontrado para esta busca.' : 'Nenhum serviço cadastrado.'}
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((service) => (
                      <tr key={service.id} className="border-b border-gray-100 bg-white hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {service.name}
                        </td>
                        <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={service.description}>
                          {service.description || <span className="text-gray-300 italic">Sem descrição</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold bg-green-50 text-green-700 border border-green-200/50">
                            {formatCurrency(service.price)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleOpenModal(service)}
                              className="p-2 text-gray-400 hover:text-brand-blue bg-white hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 shadow-sm"
                              title="Editar Serviço"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => setServiceToDelete(service)}
                              className="p-2 text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-lg transition-colors border border-gray-200 shadow-sm"
                              title="Desativar Serviço"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* VISÃO MOBILE (Cards) */}
            <div className="md:hidden p-4 space-y-4">
              {filteredServices.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
                  {searchTerm ? 'Nenhum serviço encontrado.' : 'Nenhum serviço cadastrado.'}
                </div>
              ) : (
                filteredServices.map((service) => (
                  <div key={service.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-gray-900 leading-tight pr-2">
                        {service.name}
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 whitespace-nowrap">
                        {formatCurrency(service.price)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                       {service.description || <span className="text-gray-300 italic">Sem descrição.</span>}
                    </div>
                    
                    <hr className="border-gray-100 my-1" />
                    
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(service)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Edit size={14} /> Editar
                      </button>
                      <button 
                        onClick={() => setServiceToDelete(service)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">
                {editingService ? 'Editar Serviço' : 'Novo Serviço'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 bg-white p-1.5 rounded-full shadow-sm">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveService} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Nome do Serviço</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Ex: Formatação de Computador"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Descrição</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText size={18} className="text-gray-400" />
                  </div>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Detalhes sobre o serviço..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all outline-none resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Valor Base (R$)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={18} className="text-green-500" />
                  </div>
                  <input 
                    type="text" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="150,00"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue hover:bg-blue-800 rounded-xl transition-all shadow-sm disabled:opacity-70"
                >
                  {isSaving ? <><Loader2 size={16} className="animate-spin" /> Salvando...</> : (editingService ? 'Salvar Alterações' : 'Cadastrar Serviço')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {/* ========================================== */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            
            <div className="p-6 pb-0 flex justify-between items-start">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
                <AlertTriangle size={24} />
              </div>
              <button 
                onClick={() => setServiceToDelete(null)}
                className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
                disabled={isDeleting}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 pt-2">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Desativar serviço?</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Tem certeza que deseja desativar o serviço <strong className="text-gray-800">{serviceToDelete.name}</strong>? 
                Ele deixará de aparecer para os clientes na abertura de novos chamados, mas o histórico antigo será preservado.
              </p>
            </div>

            <div className="p-6 pt-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
              <button 
                onClick={() => setServiceToDelete(null)}
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
                  <><Loader2 size={16} className="animate-spin" /> Desativando...</>
                ) : (
                  <><Trash2 size={16} /> Sim, desativar</>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}