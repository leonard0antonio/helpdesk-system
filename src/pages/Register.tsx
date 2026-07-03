import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle2, X } from 'lucide-react';
import { api } from '../services/api';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para controlar a abertura dos Modais
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptTerms) {
      setError('Você precisa aceitar os Termos de Serviço e a Política de Privacidade.');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/clients', { name, email, password });
      alert('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar conta. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans animate-fade-in">
      
      {/* Lado Esquerdo: Área de Destaque Visual */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-brand-dark relative overflow-hidden p-12">
        <div 
          className="absolute inset-0 opacity-40 animate-fade-in"
          style={{
            backgroundImage: "url('/bg-login.jpg')", 
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>

        <div className="relative z-10 flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="w-8 h-8 rounded-full border-4 border-brand-blue border-t-transparent animate-spin-slow"></div>
          <span className="text-2xl font-bold text-white">HelpDesk</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-black text-white mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Comece a transformar o seu atendimento.
          </h2>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-center gap-3 animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}><CheckCircle2 size={20} className="text-brand-blue" /> Orçamentos em tempo real</li>
            <li className="flex items-center gap-3 animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}><CheckCircle2 size={20} className="text-brand-blue" /> Acompanhamento de status</li>
            <li className="flex items-center gap-3 animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}><CheckCircle2 size={20} className="text-brand-blue" /> Histórico completo de serviços</li>
          </ul>
        </div>
      </div>

      {/* Lado Direito: Formulário de Cadastro */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 relative animate-fade-in-up">
        
        {/* Botão de Voltar movido para a área direita */}
        <Link 
          to="/"
          className="absolute top-6 left-6 md:top-8 md:left-8 z-40 flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-brand-blue transition-colors bg-white hover:bg-gray-50 px-4 py-2 rounded-full shadow-sm border border-gray-200 animate-fade-in-up"
        >
          <ArrowLeft size={16} /> Voltar ao Início
        </Link>

        <div className="w-full max-w-md mt-12 md:mt-0">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar nova conta</h1>
            <p className="text-gray-500">Junte-se à plataforma e simplifique seus chamados.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm text-red-600 text-sm font-medium rounded-lg border border-red-200 flex items-start gap-3 animate-fade-in-up">
              <span className="mt-0.5 text-red-500">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Campo Nome */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Carlos Silva"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all outline-none"
                />
              </div>
            </div>

            {/* Campo E-mail */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail corporativo ou pessoal</label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Senha de acesso</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  required
                  minLength={6}
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

            {/* Checkbox de Termos (Abre os Modais) */}
            <div className="flex items-start gap-3 mt-6">
              <input 
                type="checkbox" 
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                Eu concordo com os{' '}
                <button 
                  type="button" 
                  onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} 
                  className="text-brand-blue font-semibold hover:underline"
                >
                  Termos de Serviço
                </button>
                {' '}e a{' '}
                <button 
                  type="button" 
                  onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }} 
                  className="text-brand-blue font-semibold hover:underline"
                >
                  Política de Privacidade
                </button>.
              </label>
            </div>

            {/* Botão de Submit */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-brand-dark text-white rounded-xl py-3.5 mt-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10 disabled:opacity-70 font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Processando...
                </>
              ) : (
                'Criar minha conta'
              )}
            </button>
          </form>

          {/* Link para Login */}
          <div className="mt-8 text-center bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-3">
              Já possui uma conta?
            </p>
            <Link to="/login" className="block w-full bg-gray-50 text-gray-800 border border-gray-200 font-bold py-2.5 rounded-lg hover:bg-gray-100 transition-all">
              Fazer login
            </Link>
          </div>
          
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL: TERMOS DE SERVIÇO                     */}
      {/* ========================================== */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-fade-in-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Termos de Serviço</h2>
              <button onClick={() => setShowTermsModal(false)} className="text-gray-400 hover:text-gray-700 bg-white p-2 rounded-full shadow-sm">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto prose prose-sm max-w-none text-gray-600">
              <p>Ao acessar e utilizar nossa plataforma, você concorda em cumprir e estar vinculado aos seguintes termos de serviço.</p>
              <h3 className="text-gray-900 font-bold mt-4">1. Uso do Sistema</h3>
              <p>Nossa plataforma oferece infraestrutura SaaS no formato "Pay as you go". Você é responsável por manter a confidencialidade das suas credenciais de acesso.</p>
              <h3 className="text-gray-900 font-bold mt-4">2. Faturamento</h3>
              <p>O plano "Profissional" é cobrado por demanda. A tarifação de R$ 1,99 ocorre exclusivamente no encerramento de cada chamado.</p>
              <h3 className="text-gray-900 font-bold mt-4">3. Modificações do Serviço</h3>
              <p>Reservamo-nos o direito de modificar ou descontinuar, temporária ou permanentemente, o serviço (ou qualquer parte dele).</p>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setShowTermsModal(false)} className="bg-brand-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: POLÍTICA DE PRIVACIDADE               */}
      {/* ========================================== */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-fade-in-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Política de Privacidade</h2>
              <button onClick={() => setShowPrivacyModal(false)} className="text-gray-400 hover:text-gray-700 bg-white p-2 rounded-full shadow-sm">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto prose prose-sm max-w-none text-gray-600">
              <p>A sua privacidade é importante para nós. É política do HelpDesk System respeitar a sua privacidade em relação a qualquer informação que possamos coletar.</p>
              <h3 className="text-gray-900 font-bold mt-4">1. Informações que coletamos</h3>
              <p>Coletamos informações pessoais como nome, e-mail e dados de uso da plataforma exclusivamente para viabilizar o uso do sistema.</p>
              <h3 className="text-gray-900 font-bold mt-4">2. Segurança</h3>
              <p>As senhas são criptografadas antes de serem salvas no banco de dados. Imagens de perfil são armazenadas de forma segura em serviços de nuvem.</p>
              <h3 className="text-gray-900 font-bold mt-4">3. Retenção de Dados</h3>
              <p>Retemos as informações apenas pelo tempo necessário. Os usuários possuem a autonomia de solicitar a exclusão de suas contas a qualquer momento.</p>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setShowPrivacyModal(false)} className="bg-brand-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}