import { Link } from 'react-router-dom';

export function Header() {
  return (
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
  );
}