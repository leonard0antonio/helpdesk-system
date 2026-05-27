import { useContext, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Ticket, Users, LogOut, Wrench } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  // Lógica para sair do sistema
  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  // Define as rotas permitidas baseadas no papel (Role) do usuário
  const getNavItems = () => {
    const items = [
      {
        to: "/chamados", // <--- ALTERE ESTA LINHA AQUI
        icon: <Ticket size={20} />,
        label: user?.role === "CLIENT" ? "Meus chamados" : "Chamados",
      },
    ];

    if (user?.role === "ADMIN") {
      items.push({
        to: "/tecnicos",
        icon: <Users size={20} />,
        label: "Técnicos",
      });
      items.push({
        to: "/clientes",
        icon: <Users size={20} />,
        label: "Clientes",
      });
      items.push({
        to: "/servicos",
        icon: <Wrench size={20} />,
        label: "Serviços",
      });
    }

    return items;
  };

  return (
    <div className="flex h-screen bg-brand-light overflow-hidden">
      {/* === SIDEBAR (DESKTOP) === */}
      {/* Oculta no mobile (hidden), fixa no desktop (md:flex) */}
      <aside className="hidden md:flex flex-col w-64 bg-brand-dark text-white shadow-xl">
        {/* Topo da Sidebar: Logo e Tipo de Usuário */}
        <div className="p-6 flex flex-col items-center border-b border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-brand-blue border-2 border-white"></div>
            <span className="font-bold text-xl">HelpDesk</span>
          </div>
          <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">
            {user?.role}
          </span>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 p-4 space-y-2">
          {getNavItems().map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm ${
                  isActive
                    ? "bg-brand-blue text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Perfil do Usuário Logado e Logout (Rodapé da Sidebar) */}
        <div className="p-4 border-t border-gray-700 flex items-center justify-between">
          <NavLink
            to="/perfil"
            className="flex items-center gap-3 overflow-hidden hover:bg-gray-800 p-2 -ml-2 rounded-md transition-colors cursor-pointer w-full"
          >
            {/* Imagem de Perfil Dinâmica */}
            <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden border border-gray-600">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name.substring(0, 2).toUpperCase()
              )}
            </div>

            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate text-white">
                {user?.name}
              </span>
              <span className="text-xs text-gray-400 truncate">
                {user?.email}
              </span>
            </div>
          </NavLink>

          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-400 transition-colors p-2 flex-shrink-0 ml-2"
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* === ÁREA PRINCIPAL (MOBILE E DESKTOP) === */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* HEADER MOBILE (Oculto no Desktop) */}
        <header className="md:hidden bg-brand-dark text-white flex items-center justify-between p-4 shadow-md">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="font-bold flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-brand-blue border border-white"></div>
            HelpDesk
          </div>
          <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-xs font-bold">
            {user?.name.substring(0, 2).toUpperCase()}
          </div>
        </header>

        {/* MENU MOBILE EXPANSÍVEL */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-brand-dark text-white p-4 space-y-2 absolute top-16 left-0 right-0 z-50 border-t border-gray-700">
            {getNavItems().map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm ${
                    isActive
                      ? "bg-brand-blue text-white"
                      : "text-gray-400 hover:bg-gray-700"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-md text-red-400 hover:bg-gray-700 text-sm mt-4 border-t border-gray-700"
            >
              <LogOut size={20} />
              Sair do sistema
            </button>
          </div>
        )}

        {/* CONTEÚDO DA TELA (Rendeiriza a página ativa aqui) */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet /> {/* O React Router injeta as páginas filhas aqui */}
        </div>
      </main>
    </div>
  );
}
