import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Clock, Wrench, Users, BarChart3 } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-brand-blue selection:text-white">
      
      {/* ========================================== */}
      {/* CABEÇALHO (HEADER) */}
      {/* ========================================== */}
      <header className="absolute top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-4 border-brand-blue border-t-transparent animate-spin-slow"></div>
          <span className="text-xl font-bold text-brand-dark">HelpDesk</span>
        </div>
        
        <nav className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-sm font-semibold text-gray-600 hover:text-brand-blue transition-colors"
          >
            Entrar
          </Link>
          <Link 
            to="/register" 
            className="hidden md:flex text-sm font-semibold bg-brand-blue text-white px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            Criar Conta
          </Link>
        </nav>
      </header>

      {/* ========================================== */}
      {/* HERO SECTION (ÁREA DE DESTAQUE) */}
      {/* ========================================== */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-6">
        {/* Elemento de background decorativo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full bg-gradient-to-b from-blue-50/50 to-transparent -z-10 blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-6">
            Suporte técnico <span className="text-brand-blue">inteligente</span> para o seu negócio.
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Abra chamados, acompanhe orçamentos em tempo real e gerencie sua equipe de técnicos em uma plataforma única, rápida e escalável.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-xl hover:-translate-y-1"
            >
              Começar agora <ArrowRight size={20} />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-brand-dark border-2 border-gray-200 px-8 py-4 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Acessar painel
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* FEATURES (FUNCIONALIDADES) */}
      {/* ========================================== */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Feito para simplificar o seu dia a dia</h2>
            <p className="text-gray-500">Recursos poderosos desenhados para clientes, técnicos e administradores.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-brand-blue/30 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-blue-100 text-brand-blue rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Atendimento Ágil</h3>
              <p className="text-gray-500 leading-relaxed">
                Clientes abrem chamados em segundos, selecionam os serviços necessários e recebem a estimativa de valor instantaneamente.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-brand-blue/30 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wrench size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Controle Técnico</h3>
              <p className="text-gray-500 leading-relaxed">
                Técnicos possuem um painel dedicado para gerenciar os chamados atribuídos, mudar status e adicionar serviços extras durante a execução.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-brand-blue/30 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gestão Centralizada</h3>
              <p className="text-gray-500 leading-relaxed">
                Administradores têm visão global do negócio. Gestão completa de carteira de clientes, equipe técnica e catálogo de serviços.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* FOOTER */}
      {/* ========================================== */}
      <footer className="bg-brand-dark py-12 px-6 text-center border-t border-gray-800">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin-slow"></div>
          <span className="text-xl font-bold text-white">HelpDesk</span>
        </div>
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} HelpDesk System. Desenvolvido para simplificar processos.
        </p>
      </footer>

    </div>
  );
}