import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden px-6">
      {/* Background Decorativo */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-5xl h-[800px] bg-gradient-to-b from-blue-100/60 to-transparent -z-10 blur-3xl rounded-full"></div>
      
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-brand-blue text-sm font-semibold mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
          </span>
          Sistema HelpDesk v1.0
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight tracking-tight mb-6">
          Suporte técnico <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-indigo-500">
            inteligente e centralizado.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Transforme a maneira como sua equipe atende chamados. Orçamentos em tempo real, gestão de técnicos e total transparência para o seu cliente.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link 
            to="/register" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 hover:-translate-y-1"
          >
            Criar conta grátis <ArrowRight size={20} />
          </Link>
          <Link 
            to="/login" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-brand-dark border-2 border-gray-100 px-8 py-4 rounded-xl font-bold hover:border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
          >
            Acessar painel
          </Link>
        </div>

        {/* Mockup do Dashboard (Visual) */}
        <div className="relative mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-blue-900/5 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
            <div className="h-3 w-3 rounded-full bg-amber-400"></div>
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
          </div>
          <div className="p-4 sm:p-8 bg-gray-50/50 flex flex-col md:flex-row gap-6">
            {/* Fake Sidebar */}
            <div className="hidden md:flex flex-col gap-3 w-48 border-r border-gray-100 pr-6">
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-blue-100 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            </div>
            {/* Fake Content */}
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center mb-6">
                <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                <div className="h-8 w-24 bg-brand-blue/20 rounded-md"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="h-24 bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                  <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /><div className="h-6 w-1/4 bg-gray-800 rounded"></div></div>
                </div>
                <div className="h-24 bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                  <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                  <div className="h-6 w-1/4 bg-gray-800 rounded"></div>
                </div>
                <div className="h-24 bg-brand-blue rounded-xl p-4 shadow-sm flex flex-col justify-between opacity-90">
                  <div className="h-3 w-1/2 bg-white/50 rounded"></div>
                  <div className="h-6 w-1/3 bg-white rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}