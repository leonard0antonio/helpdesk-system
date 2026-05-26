import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Chama a rota pública do backend que criamos para clientes
      await api.post('/clients', { name, email, password });
      
      alert('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login'); // Redireciona para o login após o sucesso
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar conta. Verifique os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-light">
      
      {/* Lado Esquerdo: Imagem (Mesma do Login) */}
      <div 
        className="hidden md:flex w-1/2 bg-cover bg-center relative" 
        style={{ backgroundImage: "url('/bg-login.jpg')" }}
      >
        <div className="absolute inset-0 bg-brand-blue/80 mix-blend-multiply"></div>
      </div>

      {/* Lado Direito: Formulário de Cadastro */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          
          <div className="flex justify-center mb-8 items-center gap-2">
             <div className="w-8 h-8 rounded-full border-4 border-brand-blue border-t-transparent"></div>
             <h1 className="text-2xl font-bold text-brand-blue">HelpDesk</h1>
          </div>

          <h2 className="text-lg font-semibold mb-1 text-gray-800">Crie sua conta</h2>
          <p className="text-sm text-gray-500 mb-6">Preencha os dados abaixo para acessar o portal</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Nome Completo</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ana Silva"
                required
                className="w-full border-b border-gray-300 focus:border-brand-blue focus:outline-none py-2 text-sm transition-colors bg-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@mail.com"
                required
                className="w-full border-b border-gray-300 focus:border-brand-blue focus:outline-none py-2 text-sm transition-colors bg-transparent"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                required
                minLength={6}
                className="w-full border-b border-gray-300 focus:border-brand-blue focus:outline-none py-2 text-sm transition-colors bg-transparent"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-brand-dark text-white rounded-md py-3 mt-4 hover:bg-gray-800 transition-colors disabled:opacity-70 font-medium"
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          {/* Link para voltar ao Login */}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-medium text-brand-blue hover:underline">
              Já tem uma conta? Faça login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}