import { Link } from 'react-router-dom';

export function CTA() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto bg-brand-blue rounded-3xl overflow-hidden relative shadow-2xl shadow-blue-900/20">
        {/* Elemento de fundo */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-2xl"></div>
        
        <div className="relative p-12 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para otimizar seus atendimentos?</h2>
            <p className="text-blue-100 text-lg">Junte-se à plataforma e ofereça uma experiência profissional para os seus clientes hoje mesmo.</p>
          </div>
          
          <Link 
            to="/register" 
            className="flex-shrink-0 bg-white text-brand-blue px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg"
          >
            Criar conta gratuita
          </Link>
        </div>
      </div>
    </section>
  );
}