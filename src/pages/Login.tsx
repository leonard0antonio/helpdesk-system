import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signIn({ email, password });
      navigate("/chamados"); 
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Erro ao realizar login. Verifique suas credenciais.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans relative">
      
      {/* Botão de Voltar Dinâmico */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-40 flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-brand-blue transition-colors bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-gray-200"
      >
        <ArrowLeft size={16} /> Voltar
      </button>

      {/* Lado Esquerdo: Área de Destaque Visual */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-brand-dark relative overflow-hidden p-12">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "url('/bg-login.jpg')", 
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-4 border-brand-blue border-t-transparent animate-spin-slow"></div>
          <span className="text-2xl font-bold text-white">HelpDesk</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-black text-white mb-6 leading-tight">
            Bem-vindo de volta.
          </h2>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-brand-blue" /> Gestão inteligente de chamados</li>
            <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-brand-blue" /> Acompanhamento de status em tempo real</li>
            <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-brand-blue" /> Conexão direta com sua equipe técnica</li>
          </ul>
        </div>
      </div>

      {/* Lado Direito: Formulário de Login */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 relative">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Acesse sua conta</h1>
            <p className="text-gray-500">Entre com seu e-mail e senha cadastrados.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm text-red-600 text-sm font-medium rounded-lg border border-red-200 flex items-start gap-3 animate-fade-in-up">
              <span className="mt-0.5 text-red-500">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Campo E-mail */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@exemplo.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all outline-none"
                />
              </div>
            </div>
            
            {/* Campo Senha */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Senha</label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Funcionalidade de recuperação em desenvolvimento!"); }} className="text-xs font-semibold text-brand-blue hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Botão de Submit */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-brand-dark text-white rounded-xl py-3.5 mt-4 hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10 disabled:opacity-70 font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Entrando...
                </>
              ) : (
                'Entrar no painel'
              )}
            </button>
          </form>

          {/* Link para Cadastro */}
          <div className="mt-8 text-center bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-3">Ainda não tem uma conta?</p>
            <Link 
              to="/register" 
              className="block w-full bg-gray-50 text-gray-800 border border-gray-200 font-bold py-2.5 rounded-lg hover:bg-gray-100 transition-all"
            >
              Criar conta gratuitamente
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}