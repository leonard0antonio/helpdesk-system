import { useEffect, useState, useContext } from "react";
import { Edit, Eye, Clock, AlertCircle, CheckCircle, Plus, X, Play, CheckSquare, Trash2, XCircle } from "lucide-react";
import { api } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";

interface Service {
  id: string;
  name: string;
  price: string;
}
interface Tech {
  id: string;
  name: string;
}
interface Ticket {
  id: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  totalValue: string;
  updatedAt: string;
  client: { name: string };
  tech: { name: string } | null;
  services: { service: { name: string } }[];
}

export function Tickets() {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados Comuns
  const [availableServices, setAvailableServices] = useState<Service[]>([]);

  // Estados - Modal do CLIENTE (Novo Chamado)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [availableTechs, setAvailableTechs] = useState<Tech[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedTechId, setSelectedTechId] = useState("");

  // Estados - Modal de Detalhes (Visualização do Olho)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState<Ticket | null>(null);

  // Função para abrir o modal com os dados do chamado clicado
  const handleOpenDetails = (ticket: Ticket) => {
    setSelectedTicketDetails(ticket);
    setIsDetailsModalOpen(true);
  };

  // Estados - Modal do TÉCNICO (Adicionar Serviço Extra)
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState("");
  const [extraServiceId, setExtraServiceId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/tickets");
      setTickets(response.data);
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ==========================================
  // FUNÇÕES DO TÉCNICO
  // ==========================================

  // Atualiza o status do chamado (OPEN -> IN_PROGRESS -> CLOSED)
  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      await api.patch(`/tickets/${ticketId}/status`, { status: newStatus });
      fetchTickets(); // Recarrega para atualizar a tela
    } catch (error) {
      alert("Erro ao atualizar o status do chamado.");
    }
  };

  // Abre modal para adicionar serviço extra
  const handleOpenTechModal = async (ticketId: string) => {
    setActiveTicketId(ticketId);
    setIsTechModalOpen(true);
    try {
      const res = await api.get("/services");
      setAvailableServices(res.data);
    } catch (error) {
      alert("Erro ao carregar serviços.");
    }
  };

  // Salva o serviço extra no chamado
  const handleAddExtraService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extraServiceId) return;
    setIsSubmitting(true);
    try {
      await api.post(`/tickets/${activeTicketId}/services`, {
        serviceId: extraServiceId,
      });
      setIsTechModalOpen(false);
      setExtraServiceId("");
      fetchTickets();
    } catch (error) {
      alert("Erro ao adicionar serviço.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // FUNÇÕES DO CLIENTE
  // ==========================================
  const handleOpenClientModal = async () => {
    setIsClientModalOpen(true);
    try {
      const [servicesRes, techsRes] = await Promise.all([
        api.get("/services"),
        api.get("/techs"),
      ]);
      setAvailableServices(servicesRes.data);
      setAvailableTechs(techsRes.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar dados.");
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/tickets", {
        techId: selectedTechId,
        serviceIds: selectedServiceIds,
      });
      setIsClientModalOpen(false);
      setSelectedServiceIds([]);
      setSelectedTechId("");
      fetchTickets();
    } catch (error) {
      alert("Erro ao criar chamado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este chamado? O técnico ainda não iniciou o atendimento.")) {
      try {
        await api.delete(`/tickets/${id}`);
        fetchTickets(); // Recarrega a lista
      } catch (error) {
        alert("Erro ao excluir o chamado.");
      }
    }
  };

  // Cliente cancela chamado Em Atendimento
  const handleCancelTicket = async (id: string) => {
    if (window.confirm("O técnico já está trabalhando neste chamado. Tem certeza que deseja solicitar o cancelamento?")) {
      try {
        await api.patch(`/tickets/${id}/cancel`);
        fetchTickets(); // Recarrega a lista
      } catch (error) {
        alert("Erro ao cancelar o chamado.");
      }
    }
  };

  // ==========================================
  // HELPERS VISUAIS E RENDERS DE BOTÕES
  // ==========================================
  const formatCurrency = (val: string | number) =>
    Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const getStatusBadge = (status: string) => {
    const styles: any = {
      OPEN: "bg-pink-100 text-pink-600 border-pink-200",
      IN_PROGRESS: "bg-blue-100 text-brand-blue border-blue-200",
      CLOSED: "bg-green-100 text-green-600 border-green-200",
      CANCELED: "bg-red-100 text-red-600 border-red-200",
    };
    const labels: any = {
      OPEN: "Aberto",
      IN_PROGRESS: "Em atendimento",
      CLOSED: "Encerrado",
      CANCELED: "Cancelado",  
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // Componente que decide quais botões mostrar na tabela/card dependendo de quem está logado e do status
  const ActionButtons = ({ ticket }: { ticket: Ticket }) => {
    
    // VISÃO DO TÉCNICO
    if (user?.role === "TECH" && ticket.status !== "CLOSED" && ticket.status !== "CANCELED") {
      return (
        <div className="flex gap-2 justify-end">
          <button onClick={() => handleOpenDetails(ticket)} className="p-2 text-gray-400 hover:text-brand-blue bg-gray-50 rounded-md border border-gray-200" title="Ver detalhes">
            <Eye size={16} />
          </button>
          {ticket.status === "OPEN" && (
            <button onClick={() => handleUpdateStatus(ticket.id, "IN_PROGRESS")} className="flex items-center gap-1 bg-brand-dark text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-800 transition-colors">
              <Play size={14} /> Iniciar
            </button>
          )}
          {ticket.status === "IN_PROGRESS" && (
            <>
              <button onClick={() => handleOpenTechModal(ticket.id)} className="flex items-center gap-1 bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-200 transition-colors" title="Adicionar serviço extra">
                <Plus size={14} /> Serviço
              </button>
              <button onClick={() => handleUpdateStatus(ticket.id, "CLOSED")} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-green-700 transition-colors">
                <CheckSquare size={14} /> Encerrar
              </button>
            </>
          )}
        </div>
      );
    }

    // VISÃO DO CLIENTE (Com os novos botões)
    if (user?.role === "CLIENT") {
      return (
        <div className="flex gap-2 justify-end">
          <button onClick={() => handleOpenDetails(ticket)} className="p-2 text-gray-400 hover:text-brand-blue bg-gray-50 rounded-md border border-gray-200" title="Ver detalhes">
            <Eye size={16} />
          </button>
          
          {ticket.status === "OPEN" && (
            <button onClick={() => handleDeleteTicket(ticket.id)} className="p-2 text-red-400 hover:text-red-600 bg-red-50 rounded-md border border-red-200" title="Excluir Chamado">
              <Trash2 size={16} />
            </button>
          )}

          {ticket.status === "IN_PROGRESS" && (
            <button onClick={() => handleCancelTicket(ticket.id)} className="p-2 text-orange-400 hover:text-orange-600 bg-orange-50 rounded-md border border-orange-200" title="Solicitar Cancelamento">
              <XCircle size={16} />
            </button>
          )}
        </div>
      );
    }
    
    // VISÃO PADRÃO (Admin ou Ticket Encerrado/Cancelado)
    return (
      <button onClick={() => handleOpenDetails(ticket)} className="p-2 text-gray-400 hover:text-brand-blue bg-gray-50 rounded-md border border-gray-200" title="Ver detalhes">
        <Eye size={16} />
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px]">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-xl font-bold text-brand-blue">
          {user?.role === "CLIENT" ? "Meus chamados" : "Lista de Chamados"}
        </h1>
        {user?.role === "CLIENT" && (
          <button
            onClick={handleOpenClientModal}
            className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-blue-800 text-sm font-medium"
          >
            <Plus size={18} /> Criar chamado
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-gray-500">
          Carregando chamados...
        </div>
      ) : (
        <>
          {/* Tabela Desktop */}
          <div className="hidden md:block overflow-x-auto p-6">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Serviço Principal</th>
                  <th className="px-4 py-3">Valor Total</th>
                  <th className="px-4 py-3">Envolvidos</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-mono text-xs text-gray-500">
                      {t.id.substring(0, 6).toUpperCase()}
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-800">
                      {t.services[0]?.service.name}
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-900">
                      {formatCurrency(t.totalValue)}
                    </td>
                    <td className="px-4 py-4 text-xs">
                      <div className="text-gray-800">
                        <span className="font-semibold">C:</span>{" "}
                        {t.client.name}
                      </div>
                      <div className="text-gray-500">
                        <span className="font-semibold">T:</span>{" "}
                        {t.tech?.name || "Pendente"}
                      </div>
                    </td>
                    <td className="px-4 py-4 flex justify-center">
                      {getStatusBadge(t.status)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <ActionButtons ticket={t} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards Mobile */}
          <div className="md:hidden p-4 space-y-4 bg-gray-50">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-3"
              >
                <div className="flex justify-between">
                  <span className="font-mono text-xs text-gray-400">
                    ID: {t.id.substring(0, 6).toUpperCase()}
                  </span>
                  {getStatusBadge(t.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800 text-sm max-w-[70%]">
                    {t.services[0]?.service.name}
                  </span>
                  <span className="font-bold">
                    {formatCurrency(t.totalValue)}
                  </span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Téc: {t.tech?.name || "Pendente"}
                  </span>
                  <ActionButtons ticket={t} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- MODAL DO TÉCNICO: ADICIONAR SERVIÇO --- */}
      {isTechModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-brand-blue">
                Adicionar Serviço Extra
              </h2>
              <button onClick={() => setIsTechModalOpen(false)}>
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleAddExtraService} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                  Selecione o Serviço
                </label>
                <select
                  value={extraServiceId}
                  onChange={(e) => setExtraServiceId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:border-brand-blue outline-none text-sm"
                  required
                >
                  <option value="">Escolha um serviço...</option>
                  {availableServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - {formatCurrency(s.price)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !extraServiceId}
                className="w-full py-2 bg-brand-blue text-white font-bold rounded hover:bg-blue-800 disabled:opacity-50"
              >
                {isSubmitting ? "Adicionando..." : "Confirmar Adição"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL NOVO CHAMADO (CLIENTE) --- */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-brand-blue">
                Novo Chamado
              </h2>
              <button
                onClick={() => setIsClientModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleCreateTicket}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {/* Passo 1: Seleção de Serviços */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  1. Selecione os Serviços
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableServices.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setSelectedServiceIds((prev) =>
                          prev.includes(s.id)
                            ? prev.filter((id) => id !== s.id)
                            : [...prev, s.id],
                        );
                      }}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                        selectedServiceIds.includes(s.id)
                          ? "border-brand-blue bg-blue-50"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-800">
                          {s.name}
                        </span>
                        <span className="text-xs font-bold text-brand-blue">
                          {Number(s.price).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Passo 2: Escolha do Técnico */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  2. Atribuir Técnico
                </label>
                <select
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-gray-100 focus:border-brand-blue outline-none text-sm"
                  required
                >
                  <option value="">Selecione um técnico disponível...</option>
                  {availableTechs.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resumo de Valores */}
              <div className="bg-brand-blue text-white p-6 rounded-2xl flex justify-between items-center shadow-lg shadow-blue-200">
                <div>
                  <p className="text-xs uppercase opacity-80 font-bold">
                    Total do Chamado
                  </p>
                  <p className="text-3xl font-black">
                    {availableServices
                      .filter((s) => selectedServiceIds.includes(s.id))
                      .reduce((acc, curr) => acc + Number(curr.price), 0)
                      .toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs">
                    {selectedServiceIds.length} serviço(s) selecionado(s)
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="flex-1 py-3 border-2 border-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "Processando..." : "Confirmar Chamado"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE DETALHES DO CHAMADO (VISUALIZAÇÃO) --- */}
      {isDetailsModalOpen && selectedTicketDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-brand-blue">Detalhes do Chamado</h2>
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Status e ID */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  ID do sistema: <span className="font-mono text-gray-800 font-bold">{selectedTicketDetails.id.toUpperCase()}</span>
                </span>
                {getStatusBadge(selectedTicketDetails.status)}
              </div>
              
              <hr className="border-gray-100" />
              
              {/* Envolvidos */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Solicitado por</p>
                  <p className="font-semibold text-gray-800">{selectedTicketDetails.client.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Atendido por</p>
                  <p className="font-semibold text-gray-800">{selectedTicketDetails.tech?.name || 'Aguardando técnico'}</p>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Lista de Serviços */}
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Serviços Inclusos neste Chamado</p>
                <ul className="space-y-2 max-h-32 overflow-y-auto pr-2">
                  {selectedTicketDetails.services.map((s, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-md border border-gray-100 text-gray-700 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-blue"></div>
                      {s.service.name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Valor Total */}
              <div className="bg-brand-blue text-white p-4 rounded-xl flex justify-between items-center mt-2 shadow-md">
                <span className="text-xs uppercase opacity-80 font-bold tracking-wider">Custo Total</span>
                <span className="text-2xl font-black">{formatCurrency(selectedTicketDetails.totalValue)}</span>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}