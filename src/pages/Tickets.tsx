import { useEffect, useState, useContext } from "react";
import {
  Eye,
  Play,
  CheckSquare,
  Trash2,
  XCircle,
  Plus,
  X,
  Search,
  Ticket as TicketIcon,
  Loader2,
  User,
  Wrench,
  FileText,
} from "lucide-react";
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
  status: "OPEN" | "IN_PROGRESS" | "CLOSED" | "CANCELED";
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
  const [searchTerm, setSearchTerm] = useState("");

  // Estados Comuns
  const [availableServices, setAvailableServices] = useState<Service[]>([]);

  // Estados - Modal do CLIENTE (Novo Chamado)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [availableTechs, setAvailableTechs] = useState<Tech[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedTechId, setSelectedTechId] = useState("");

  // Estados - Modal de Detalhes (Visualização)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] =
    useState<Ticket | null>(null);

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
  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      await api.patch(`/tickets/${ticketId}/status`, { status: newStatus });
      fetchTickets();
    } catch (error) {
      alert("Erro ao atualizar o status do chamado.");
    }
  };

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
    if (selectedServiceIds.length === 0) {
      alert("Selecione pelo menos um serviço.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/tickets", {
        techId: selectedTechId === "" ? null : selectedTechId, 
        serviceIds: selectedServiceIds,
      });
      
      setIsClientModalOpen(false);
      setSelectedServiceIds([]);
      setSelectedTechId("");
      fetchTickets();
    } catch (error: any) {
      console.error("Erro exato do backend:", error.response?.data);
      alert("Erro ao criar chamado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir este chamado permanentemente?"
      )
    ) {
      try {
        await api.delete(`/tickets/${id}`);
        fetchTickets();
      } catch (error) {
        alert("Erro ao excluir o chamado.");
      }
    }
  };

  const handleCancelTicket = async (id: string) => {
    if (
      window.confirm(
        "O técnico já está trabalhando neste chamado. Deseja solicitar o cancelamento?"
      )
    ) {
      try {
        await api.patch(`/tickets/${id}/cancel`);
        fetchTickets();
      } catch (error) {
        alert("Erro ao cancelar o chamado.");
      }
    }
  };

  // ==========================================
  // HELPERS VISUAIS E RENDERS DE BOTÕES
  // ==========================================
  const handleOpenDetails = (ticket: Ticket) => {
    setSelectedTicketDetails(ticket);
    setIsDetailsModalOpen(true);
  };

  const formatCurrency = (val: string | number) =>
    Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const getStatusBadge = (status: string) => {
    const styles: any = {
      OPEN: "bg-amber-50 text-amber-600 border-amber-200",
      IN_PROGRESS: "bg-blue-50 text-brand-blue border-blue-200",
      CLOSED: "bg-green-50 text-green-600 border-green-200",
      CANCELED: "bg-red-50 text-red-600 border-red-200",
    };
    const labels: any = {
      OPEN: "Aberto",
      IN_PROGRESS: "Em atendimento",
      CLOSED: "Encerrado",
      CANCELED: "Cancelado",
    };
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ActionButtons = ({ ticket }: { ticket: Ticket }) => {
    // TÉCNICO
    if (
      user?.role === "TECH" &&
      ticket.status !== "CLOSED" &&
      ticket.status !== "CANCELED"
    ) {
      return (
        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleOpenDetails(ticket)}
            className="p-2 text-gray-400 hover:text-brand-blue bg-white hover:bg-blue-50 rounded-lg border border-gray-200 shadow-sm transition-colors"
            title="Ver detalhes"
          >
            <Eye size={16} />
          </button>
          {ticket.status === "OPEN" && (
            <button
              onClick={() => handleUpdateStatus(ticket.id, "IN_PROGRESS")}
              className="flex items-center gap-1.5 bg-brand-dark text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm"
            >
              <Play size={14} /> Iniciar
            </button>
          )}
          {ticket.status === "IN_PROGRESS" && (
            <>
              <button
                onClick={() => handleOpenTechModal(ticket.id)}
                className="flex items-center gap-1.5 bg-white text-brand-blue border border-brand-blue px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm"
                title="Adicionar serviço extra"
              >
                <Plus size={14} /> Serviço
              </button>
              <button
                onClick={() => handleUpdateStatus(ticket.id, "CLOSED")}
                className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors shadow-sm"
              >
                <CheckSquare size={14} /> Encerrar
              </button>
            </>
          )}
        </div>
      );
    }

    // CLIENTE
    if (user?.role === "CLIENT") {
      return (
        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleOpenDetails(ticket)}
            className="p-2 text-gray-400 hover:text-brand-blue bg-white hover:bg-blue-50 rounded-lg border border-gray-200 shadow-sm transition-colors"
            title="Ver detalhes"
          >
            <Eye size={16} />
          </button>
          {ticket.status === "OPEN" && (
            <button
              onClick={() => handleDeleteTicket(ticket.id)}
              className="p-2 text-red-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-lg border border-red-100 shadow-sm transition-colors"
              title="Excluir Chamado"
            >
              <Trash2 size={16} />
            </button>
          )}
          {ticket.status === "IN_PROGRESS" && (
            <button
              onClick={() => handleCancelTicket(ticket.id)}
              className="p-2 text-orange-400 hover:text-orange-600 bg-white hover:bg-orange-50 rounded-lg border border-orange-100 shadow-sm transition-colors"
              title="Solicitar Cancelamento"
            >
              <XCircle size={16} />
            </button>
          )}
        </div>
      );
    }

    // ADMIN ou ENCERRADO
    return (
      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => handleOpenDetails(ticket)}
          className="p-2 text-gray-400 hover:text-brand-blue bg-white hover:bg-blue-50 rounded-lg border border-gray-200 shadow-sm transition-colors"
          title="Ver detalhes"
        >
          <Eye size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col relative animate-fade-in-up">
      {/* CABEÇALHO E BARRA DE BUSCA */}
      <div className="p-6 border-b border-gray-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
            <TicketIcon size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {user?.role === "CLIENT" ? "Meus Chamados" : "Gestão de Chamados"}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {filteredTickets.length} chamados registrados
            </p>
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
              placeholder="Buscar por ID ou Cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all outline-none"
            />
          </div>

          {user?.role === "CLIENT" && (
            <button
              onClick={handleOpenClientModal}
              className="flex items-center justify-center gap-2 text-sm font-bold bg-brand-dark text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
            >
              <Plus size={16} /> Novo Chamado
            </button>
          )}
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 bg-gray-50/30">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-brand-blue">
            <Loader2 size={32} className="animate-spin mb-4" />
            <span className="text-sm font-medium text-gray-500">
              Carregando chamados...
            </span>
          </div>
        ) : (
          <>
            {/* Tabela Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">
                      Serviço Principal
                    </th>
                    <th className="px-6 py-4 font-semibold">Valor Total</th>
                    <th className="px-6 py-4 font-semibold">Envolvidos</th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-gray-500"
                      >
                        {searchTerm
                          ? "Nenhum chamado encontrado."
                          : "Nenhum chamado registrado."}
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-gray-100 bg-white hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">
                          #{t.id.substring(0, 6).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {t.services[0]?.service.name || "Múltiplos Serviços"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-green-700">
                            {formatCurrency(t.totalValue)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <div className="flex items-center gap-1.5 text-gray-800 mb-1">
                            <User size={12} className="text-gray-400" />{" "}
                            <span className="font-medium truncate max-w-[120px]">
                              {t.client.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Wrench size={12} className="text-gray-400" />{" "}
                            <span className="truncate max-w-[120px]">
                              {t.tech?.name || (
                                <span className="italic">Pendente</span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 flex justify-center">
                          {getStatusBadge(t.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ActionButtons ticket={t} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Cards Mobile */}
            <div className="md:hidden p-4 space-y-4">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
                  {searchTerm
                    ? "Nenhum chamado encontrado."
                    : "Nenhum chamado registrado."}
                </div>
              ) : (
                filteredTickets.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 relative group"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        #{t.id.substring(0, 6).toUpperCase()}
                      </span>
                      {getStatusBadge(t.status)}
                    </div>

                    <div className="font-bold text-gray-900 text-lg leading-tight">
                      {t.services[0]?.service.name || "Múltiplos Serviços"}
                    </div>

                    <div className="font-black text-green-600 text-lg">
                      {formatCurrency(t.totalValue)}
                    </div>

                    <div className="flex flex-col gap-1 text-xs mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex justify-between text-gray-600">
                        <span className="font-medium">Cliente:</span>{" "}
                        <span>{t.client.name}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span className="font-medium">Técnico:</span>{" "}
                        <span>{t.tech?.name || "Aguardando..."}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex justify-end">
                      <ActionButtons ticket={t} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* ========================================== */}
      {/* MODAIS */}
      {/* ========================================== */}

      {/* --- MODAL DO TÉCNICO: ADICIONAR SERVIÇO --- */}
      {isTechModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-900 text-lg">
                Adicionar Serviço Extra
              </h2>
              <button
                onClick={() => setIsTechModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 bg-white p-1.5 rounded-full shadow-sm"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddExtraService} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Selecione o Serviço Adicional
                </label>
                <select
                  value={extraServiceId}
                  onChange={(e) => setExtraServiceId(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none text-sm cursor-pointer"
                  required
                >
                  <option value="" disabled>
                    Escolha um serviço da lista...
                  </option>
                  {availableServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {formatCurrency(s.price)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsTechModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !extraServiceId}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-brand-blue rounded-xl hover:bg-blue-800 transition-all shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />{" "}
                      Adicionando...
                    </>
                  ) : (
                    "Confirmar Adição"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL NOVO CHAMADO (CLIENTE) --- */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10 shadow-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                  <Plus size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    Novo Chamado
                  </h2>
                  <p className="text-xs text-gray-500">
                    Configure os serviços e atribua um técnico.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsClientModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 👇 MUDANÇA 1: Adicionado min-h-0 para habilitar a rolagem interna corretamente */}
            <form
              onSubmit={handleCreateTicket}
              className="flex-1 min-h-0 overflow-y-auto p-6 space-y-8 bg-gray-50/50"
            >
              {/* Passo 1 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
                  <span className="w-6 h-6 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs">
                    1
                  </span>
                  Selecione os Serviços Necessários
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableServices.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setSelectedServiceIds((prev) =>
                          prev.includes(s.id)
                            ? prev.filter((id) => id !== s.id)
                            : [...prev, s.id]
                        );
                      }}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all group ${
                        selectedServiceIds.includes(s.id)
                          ? "border-brand-blue bg-blue-50/50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-brand-blue/50 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={`text-sm font-bold ${
                            selectedServiceIds.includes(s.id)
                              ? "text-brand-blue"
                              : "text-gray-700"
                          }`}
                        >
                          {s.name}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            selectedServiceIds.includes(s.id)
                              ? "bg-brand-blue border-brand-blue text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedServiceIds.includes(s.id) && (
                            <CheckSquare size={12} />
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-black text-gray-900">
                        {formatCurrency(s.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Passo 2 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
                  <span className="w-6 h-6 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  Atribuir Técnico (Opcional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Wrench size={18} className="text-gray-400" />
                  </div>
                  <select
                    value={selectedTechId}
                    onChange={(e) => setSelectedTechId(e.target.value)}
                    className="w-full pl-10 p-3.5 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none text-sm text-gray-700 font-medium cursor-pointer appearance-none"
                  >
                    <option value="">
                      Deixar em aberto (Qualquer técnico assumirá)
                    </option>
                    {availableTechs.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>

            {/* 👇 MUDANÇA 2: Adicionado shrink-0 para o rodapé nunca ser esmagado */}
            <div className="shrink-0 p-6 bg-white border-t border-gray-100 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="bg-brand-dark text-white p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center shadow-lg shadow-gray-900/10 mb-4">
                <div className="text-center sm:text-left mb-2 sm:mb-0">
                  <p className="text-xs uppercase text-gray-400 font-bold tracking-wider mb-1">
                    Estimativa do Chamado
                  </p>
                  <p className="text-3xl font-black text-white">
                    {formatCurrency(
                      availableServices
                        .filter((s) => selectedServiceIds.includes(s.id))
                        .reduce((acc, curr) => acc + Number(curr.price), 0)
                    )}
                  </p>
                </div>
                <div className="text-sm font-medium bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                  {selectedServiceIds.length} serviço(s) selecionado(s)
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="flex-1 py-3.5 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={handleCreateTicket}
                  disabled={isSubmitting || selectedServiceIds.length === 0}
                  className="flex-[2] flex justify-center items-center gap-2 py-3.5 bg-brand-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-all shadow-md shadow-brand-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Abrindo
                      Chamado...
                    </>
                  ) : (
                    "Confirmar e Abrir Chamado"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}  

      {/* --- MODAL DE DETALHES DO CHAMADO (VISUALIZAÇÃO) --- */}
      {isDetailsModalOpen && selectedTicketDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-white">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Resumo do Chamado
                </h2>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    #{selectedTicketDetails.id.toUpperCase()}
                  </span>
                  {getStatusBadge(selectedTicketDetails.status)}
                </div>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 bg-gray-50/30">
              {/* Envolvidos */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={16} className="text-gray-400" />
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">
                      Cliente
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">
                    {selectedTicketDetails.client.name}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench size={16} className="text-gray-400" />
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">
                      Técnico
                    </p>
                  </div>
                  <p
                    className={`font-bold ${
                      selectedTicketDetails.tech
                        ? "text-gray-900"
                        : "text-amber-600 italic"
                    }`}
                  >
                    {selectedTicketDetails.tech?.name ||
                      "Aguardando atribuição"}
                  </p>
                </div>
              </div>

              {/* Lista de Serviços */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={18} className="text-gray-400" />
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                    Serviços Executados
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <ul className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                    {selectedTicketDetails.services.map((s, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 p-3.5 text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-brand-blue"></div>
                        {s.service.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Valor Total */}
              <div className="bg-brand-dark text-white p-5 rounded-xl flex justify-between items-center shadow-lg shadow-gray-900/10">
                <span className="text-sm uppercase font-bold tracking-wider text-gray-400">
                  Custo Total Final
                </span>
                <span className="text-3xl font-black text-green-400">
                  {formatCurrency(selectedTicketDetails.totalValue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}