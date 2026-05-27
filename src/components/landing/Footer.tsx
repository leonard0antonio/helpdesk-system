import { Link } from 'react-router-dom';

export function Footer() {
  
  // Função para simular páginas em construção sem quebrar a navegação

  return (
    <footer className="bg-brand-dark pt-16 pb-8 px-6 border-t border-gray-800 text-gray-400">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full border-2 border-brand-blue border-t-transparent"></div>
            <span className="text-xl font-bold text-white">HelpDesk</span>
          </div>
          <p className="max-w-sm mb-6 text-sm leading-relaxed">
            A plataforma definitiva para conectar técnicos, clientes e administradores em um único ecossistema focado em resolução.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Produto</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#funcionalidades" className="hover:text-brand-blue transition-colors">Funcionalidades</a></li>
            <li><a href="#casos-de-uso" className="hover:text-brand-blue transition-colors">Casos de Uso</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Acesso</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/login" className="hover:text-brand-blue transition-colors">Entrar</Link></li>
            <li><Link to="/register" className="hover:text-brand-blue transition-colors">Criar Conta</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-gray-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500">
        <p>© {new Date().getFullYear()} HelpDesk System. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <Link to="/termos" className="hover:text-white transition-colors">Termos</Link>
          <Link to="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}