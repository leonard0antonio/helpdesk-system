import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-6">
      {/* Background Decorativo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full bg-gradient-to-b from-blue-50/50 to-transparent -z-10 blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-6 animate-fade-in-up">
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
  );
}